import { useState, useEffect, useEffectEvent } from "react";
import Header from "components/Header/Header";
import Hero from "components/Hero/Hero";
import FileUploader from "components/FileUploader/FileUploader";
import Footer from "components/footer/footer";
import { Send, Heart, Activity } from "lucide-react";
import "./OcrMainPage.scss";
import PanelLayout from "components/PanelLayout/PanelLayout";

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

      if (selectedImageId === id) {
        if (filtered.length > 0) {
          setSelectedImageId(filtered[0].id);
        } else {
          setSelectedImageId(null);
        }
      }
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

  const handleConvert = async () => {
    if (isProcessing) return;

    const targets = images.filter(
      (img) => img.status === "idle" || img.status === "error",
    );
    if (targets.length === 0) return;

    // Swap states of target list to processing
    setImages((prev) => {
      prev.map((img) => {
        if (img.status === "idle" || img.status === "error") {
          return { ...img, status: "processing", progress: 0, error: null };
        }
        return img;
      });
    });

    // Perform OCR execution in parallel on all target images
    const ocrPromises = targets.map(async (img) => {
      try {
        const ocrData = await performOCR(
          img.file || img.previewUrl,
          (percent) => {
            // Progress updater callback
            setImages((prev) =>
              prev.map((item) => {
                if (item.id === img.id) {
                  return { ...item, progress: percent };
                }
                return item;
              }),
            );
          },
        );

        // Completed processing successfully
        setImages((prev) =>
          prev.map((item) => {
            if (item.id === img.id) {
              return {
                ...item,
                status: "done",
                progress: 100,
                result: ocrData,
                error: null,
              };
            }
            return item;
          }),
        );
      } catch (err) {
        // Handle processing failure safely
        setImages((prev) =>
          prev.map((item) => {
            if (item.id === img.id) {
              return {
                ...item,
                status: "error",
                progress: 0,
                error: err.message || "Extraction failed",
              };
            }
            return item;
          }),
        );
      }
    });

    await Promise.all(ocrPromises);
    setIsProcessing(false);
  };

  console.log("Uploaded Images:", images);
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
