import {
  Eye,
  Trash2,
  FileImage,
  Settings,
  Play,
  RefreshCw,
  XCircle,
} from "lucide-react";
import FileUploader from "components/FileUploader/FileUploader";
import React from "react";
import "./PanelLayout.scss";

const PanelLayout = ({
  images,
  selectedImageId,
  onSelectImage,
  onRemoveImage,
  onClearAll,
  onConvert,
  onAddImages,
  isProcessing,
}) => {
  const selectedImage =
    images.find((img) => img.id === selectedImageId) || images[0];

  const hasConvertibleImages = images.some((img) => {
    img.status === "idle" || img.status === "error";
  });
  return (
    <div className="workspace-grid" id="split-workspace">
      {/* LEFT PANEL: Queue & Manager */}
      <aside className="left-panel" aria-label="Image Upload queue selector">
        <div className="panel-header">
          <div className="panel-header__title">
            <Settings size={18} />
            <h2>Image Manager</h2>
          </div>
          <span className="panel-header__queue-counter">
            {images.length} {images.length === 1 ? "file" : "files"}
          </span>
        </div>

        <div className="queue-area">
          <div className="queue-scroll-imgs">
            <ul className="queue-list" id="image-queue-list">
              {images.map((img) => {
                const isSelected = selectedImage && img.id === selectedImage.id;

                let statusLabel = "Idle"; //  Display
                let statusClass = "status-idle"; // Style
                if (img.status === "processing") {
                  statusLabel = `Extracting ${img.progress}%`;
                  statusClass = "status-processing";
                } else if (img.status === "done") {
                  statusLabel = "Completed";
                  statusClass = "status-success";
                } else if (img.status === "error") {
                  statusLabel = "Extraction Failed";
                  statusClass = "status-error";
                }

                return (
                  <li
                    key={img.id}
                    className={`queue-item-card ${isSelected ? "selected" : ""}`}
                    onClick={() => onSelectImage(img.id)}
                    id={`queue-item-${img.id}`}
                  >
                    <div className="queue-item-thumbnail">
                      <img
                        src={img.previewUrl}
                        alt={img.name}
                        referrerPolicy="no-referrer"
                        className="thumbnail-image"
                      />
                    </div>

                    <div className="queue-item-details">
                      <span className="queue-item-name" title={img.name}>
                        {img.name}
                      </span>
                      <div className="queue-item-meta">
                        <span className="queue-item-size">{img.size}</span>
                        <span
                          className={`status-badge ${statusClass}`}
                          id={`badge-${img.id}`}
                        >
                          {img.status === "processing" && (
                            <span className="spinner-mini" aria-hidden="true" />
                          )}
                          {statusLabel}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="queue-item-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveImage(img.id);
                      }}
                      title={`Remove ${img.name} from queue`}
                      aria-label={`Remove file ${img.name}`}
                      disabled={isProcessing && img.status === "processing"}
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="queue-append-section">
            <FileUploader onFilesAdded={onAddImages} isMini={true} />
          </div>
        </div>
      </aside>

      {/* RIGHT PANEL: Live Visual Preview */}
      <section className="right-panel" aria-label="Selected image viewport">
        <div className="panel-header">
          <div className="panel-header__title">
            <Eye size={18} />
            <h2>Image Preview</h2>
          </div>
        </div>

        <div className="preview-viewport-container">
          {selectedImage ? (
            <div className="preview-viewport">
              <div className="preview-image-wrapper">
                <img
                  src={selectedImage.previewUrl}
                  alt={`Preview of ${selectedImage.name}`}
                  referrerPolicy="no-referrer"
                  className="preview-image"
                />
              </div>

              <div className="preview-meta-panel" id="preview-meta">
                <div className="meta-text-item">
                  <span className="meta-label">Filename:</span>
                  <span className="meta-val" title={selectedImage.name}>
                    {selectedImage.name}
                  </span>
                </div>
                <div className="meta-text-item">
                  <span className="meta-label">Format:</span>
                  <span className="meta-val">
                    {selectedImage.type || "Remote / Unknown"}
                  </span>
                </div>
                <div className="meta-text-item">
                  <span className="meta-label">File Size:</span>
                  <span className="meta-val">{selectedImage.size}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="preview-empty-state">
              <FileImage size={48} className="empty-icon" />
              <p>
                Select an image from the queue list to preview and view
                metadata.
              </p>
            </div>
          )}
        </div>

        {/* WORKSPACE ACTIONS DRAWER */}
        <div className="workspace-controls-bar">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClearAll}
            disabled={isProcessing}
            id="clear-all-workspace-btn"
          >
            <XCircle size={16} />
            <span>Clear Queue</span>
          </button>

          <button
            type="button"
            className="btn-primary flex-fill"
            onClick={onConvert}
            disabled={isProcessing || !hasConvertibleImages}
            id="convert-workspace-btn"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="spinning" size={16} />
                <span>Processing OCR Engine...</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>
                  Convert Images (
                  {
                    images.filter(
                      (img) => img.status === "idle" || img.status === "error",
                    ).length
                  }
                  )
                </span>
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
};

export default PanelLayout;
