import { useState, useEffect, useEffectEvent } from "react";
import Header from "components/Header/Header";
import Hero from "components/Hero/Hero";
import FileUploader from "components/FileUploader/FileUploader";
import Footer from "components/footer/footer";
import { convertImagesToText } from "services/api/ocrApi";
import { Send, Heart, Activity } from "lucide-react";
import "./OcrMainPage.scss";
import PanelLayout from "components/PanelLayout/PanelLayout";
import Results from "components/ResultsList/Results";

const OcrMainPage = () => {
  const [images, setImages] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const showWorkspace = images.length > 0;
  const showResults = images.some((img) => img.status === "done" && img.result);

  // Interactive Footer Feedback states
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Auto-selects the first file if none is selected
  useEffect(() => {
    if (images.length > 0 && !selectedImageId) {
      setSelectedImageId(images[0].id);
    } else if (images.length === 0) {
      setSelectedImageId(null);
    }
  }, [images, selectedImageId]);

  // Handler for adding images to the queue
  const handleFilesAdded = (newImages) => {
    setImages((prevImg) => {
      const combineImg = [...prevImg, ...newImages];
      if (!selectedImageId && newImages.length > 0) {
        setSelectedImageId(newImages[0].id);
      }
      return combineImg;
    });
  };

  // Handler for selecting a specific image
  const handleSelectImage = (id) => {
    setSelectedImageId(id);
  };

  // Handler for removing an individual image
  const handleRemoveImage = (id) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);

      console.log("Filtered ID: handleRemoveImage", filtered);

      if (selectedImageId === id) {
        if (filtered.length > 0) {
          setSelectedImageId(filtered[0].id);
        } else {
          setSelectedImageId(null);
        }
      }
      return filtered;
    });
  };

  // Clears all state and resets back to Step 1
  const handleClearAll = () => {
    // Revoke object URLs to prevent memory leaks
    images.forEach((img) => {
      if (img.previewUrl && img.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(img.previewUrl);
      }
    });
    setImages([]);
    setSelectedImageId(null);
    setIsProcessing(false);
  };

  // Send images to Backend for text convertion
  const handleConvert = async () => {
    console.log("handleConvert is click!");
    if (isProcessing) return;

    console.log("handleConvert is click!");

    const targets = images.filter(
      (img) => img.status === "idle" || img.status === "error",
    );
    if (targets.length === 0) return;

    setIsProcessing(true);

    // Swap states of target list to processing
    setImages((prev) =>
      prev.map((img) => {
        if (img.status === "idle" || img.status === "error") {
          return { ...img, status: "processing", progress: 0, error: null };
        }
        return img;
      }),
    );

    try {
      const files = targets.map((img) => img.file);

      const response = await convertImagesToText(files);

      console.log("API response:", response);

      setImages((prev) =>
        prev.map((img) => {
          const result = response.results.find((r) => r.filename === img.name);

          if (!result) return img;

          return {
            ...img,
            status: "done",
            progress: 100,
            result: {
              filename: result.filename,
              text: result.text,
              wordCount: result.text.trim().split(/\s+/).filter(Boolean).length,
            },
            error: null,
          };
        }),
      );
    } catch (err) {
      console.log("API response error:", err);
      setImages((prev) =>
        prev.map((img) =>
          targets.some((t) => t.id === img.id)
            ? {
                ...img,
                status: "error",
                progress: 0,
                error: err.message,
              }
            : img,
        ),
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateResultText = (id, newText) => {
    setImages((prev) =>
      prev.map((img) => {
        if (img.id === id && img.result) {
          return {
            ...img,
            result: {
              ...img.result,
              text: newText,
              wordCount: newText.trim().split(/\s+/).filter(Boolean).length,
            },
          };
        }
        return img;
      }),
    );

    console.log("Editing Text");
  };

  const forConsole = () => {
    if (images.length !== 0) {
      return images.map((img) => img.file);
    }
    return "No image";
  };

  console.log("Uploaded Images:", images);
  console.log("Actual File (images.map):", forConsole());
  console.log("Selected Images:", selectedImageId);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setFeedbackMsg("");
    setTimeout(() => {
      setFeedbackSubmitted(false);
    }, 4000);
  };

  return (
    <div className="layout-body" id="app-viewport">
      <Header />

      <main className="container main-content">
        {!showWorkspace ? (
          <div className="entry-flow animate-slide-down">
            <Hero />
            <div className="landing-uploader-wrapper">
              <FileUploader onFilesAdded={handleFilesAdded} />
            </div>
          </div>
        ) : (
          <div className="workspace-flow animate-slide-down">
            <div className="workspace-breadcrumbs">
              <span className="breadcrumb-parent">OCR / Workspace</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Batch Manager</span>
            </div>

            <PanelLayout
              images={images}
              selectedImageId={selectedImageId}
              onSelectImage={handleSelectImage}
              onRemoveImage={handleRemoveImage}
              onClearAll={handleClearAll}
              onConvert={handleConvert}
              onAddImages={handleFilesAdded}
              isProcessing={isProcessing}
            />
          </div>
        )}

        {showResults && (
          <Results
            images={images}
            onStartAgain={handleClearAll}
            onUpdateResultsText={handleUpdateResultText}
          />
        )}
      </main>

      <Footer
        feedbackSubmitted={feedbackSubmitted}
        handleFeedbackSubmit={handleFeedbackSubmit}
        setFeedbackMsg={setFeedbackMsg}
        feedbackMsg={feedbackMsg}
      />
    </div>
  );
};

export default OcrMainPage;
