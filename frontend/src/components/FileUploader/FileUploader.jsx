import { useEffect, useRef, useState } from "react";
import {
  Upload,
  Clipboard,
  Link as LinkIcon,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import "./FileUploader.scss";

const FileUploader = ({ onFilesAdded, isMini = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const fileInputRef = useRef(null);

  // ? Generate a random ID
  const generateId = () =>
    `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // ? Formats file sizes
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSelectedFiles = (files) => {
    const validImages = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (validImages.length === 0) {
      alert("Please upload image files only (PNG, JPG, WEBP, etc.)");
      return;
    }

    const newImageObjects = validImages.map((file) => {
      return {
        id: generateId(),
        file: file,
        name: file.name,
        size: formatSize(file.size),
        type: file.type,
        previewUrl: URL.createObjectURL(file),
        status: "idle",
        progress: 0,
        result: null,
        error: null,
      };
    });

    onFilesAdded(newImageObjects);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleSelectedFiles(e.dataTransfer.files);
    }
  };

  // Clipboard Paste handler (global hook when uploader is mounted)
  useEffect(() => {
    const handlePaste = (e) => {
      if (
        e.clipboardData &&
        e.clipboardData.files &&
        e.clipboardData.files.length > 0
      )
        e.preventDefault();
      handleSelectedFiles(e.clipboardData.files);
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  // Public image URL processor
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    setUrlError("");

    if (!urlInput.trim()) {
      setUrlError("Please enter a valid image URL");
      return;
    }

    // Basic URL format validation
    try {
      const parsedUrl = new URL(urlInput);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        setUrlError("Only HTTP or HTTPS URLs are supported");
        return;
      }
    } catch (_) {
      setUrlError(
        "Please enter a valid format, starting with http:// or https://",
      );
      return;
    }

    // Extracts last segment as name or uses default
    const urlName =
      urlInput.substring(urlInput.lastIndexOf("/") + 1).split("?")[0] ||
      "remote_image.jpg";

    // Simulate receiving remote image
    const newImageUrlObject = {
      id: generateId(),
      file: null, // Remote URL source has no local File handle
      name: urlName,
      size: "Remote URL",
      type: "image/jpeg",
      previewUrl: urlInput,
      status: "idle",
      progress: 0,
      result: null,
      error: null,
    };

    onFilesAdded([newImageUrlObject]);
    setUrlInput("");
  };

  return (
    <div
      className={`uploader-container ${isMini ? "uploader-mini" : "uploader-standard"}`}
      id="uploader-box"
    >
      <div
        className={`dropzone ${isDragging ? "drag-active" : ""}`}
        onClick={handleBoxClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button" // on-standard element behaves as a button.
        tabIndex={0} // Make natively non-focusable element to become fopcusable
        aria-label="Upload file dropzone. Drag & drop images, click to browse, or paste directly."
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          multiple
          accept="image/*" // Only allow the user to select image files.
          onChange={(e) => {
            if (e.target.files) handleSelectedFiles(e.target.files);
          }}
        />

        <div className="dropzone__dropzone-content">
          {" "}
          {/* Unused CSS */}
          <div className="uploader-icon-ring">
            <Upload className="upload-icon" size={28} />
          </div>
          {isMini ? (
            <p className="dropzone-text-mini">
              Drag & Drop or <span className="highlight">Browse</span> to append
              images
            </p>
          ) : (
            <div className="dropzone-text-main">
              <h3>Drag & drop your images here</h3>
              <p>
                Supports PNG, JPEG, WEBP. Click to{" "}
                <span className="highlight">browse files</span>.
              </p>
              <div className="clipboard-indicator">
                <Clipboard size={14} />
                <span>Or simply paste any captured image from clipboard</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isMini && (
        <div className="url-ingestion-block">
          {/* Unused CSS */}
          <div className="url-separator">
            <span>or fetch from web</span>
          </div>

          <form onSubmit={handleUrlSubmit} className="url-form">
            <div className="url-input-wrapper">
              <LinkIcon className="input-icon" size={16} />
              <input
                type="text"
                placeholder="Paste public image URL (e.g. https://example.com/receipt.jpg)"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setUrlError("");
                }}
                className="url-textbox"
                aria-label="Image URL Input"
              />
            </div>
            <button type="submit" className="url-submit-btn">
              <ImageIcon size={16} />
              <span>Import URL</span>
            </button>
          </form>

          {urlError && (
            <div className="url-error" id="url-error-msg">
              <AlertCircle size={14} />
              <span>{urlError}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
