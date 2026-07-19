import { useState } from "react";
import {
  Copy,
  Download,
  ChevronUp,
  ChevronDown,
  Check,
  FileDown,
  RotateCcw,
  AlertCircle,
  FileText,
} from "lucide-react";
import "./Results.scss";

const Results = ({ images, onStartAgain, onUpdateResultsText }) => {
  const processedImages = images.filter(
    (img) => img.status === "done" && img.result,
  );
  if (processedImages.length === 0) return null;

  const [collapsedIds, setCollapsedIds] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const toggleCollapse = (id) => {
    setCollapsedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Copy single card text to clipboard
  const handleCopyText = (id, text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1800);
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
        alert("Clipboard access denied.");
      });
  };

  // Download single card text
  const handleDownloadText = (filename, text) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Parse original extension to replace it with .txt
    const baseName =
      filename.substring(0, filename.lastIndexOf(".")) || filename;
    link.href = url;
    link.download = `${baseName}_extracted.txt`;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      className="results-section"
      id="ocr-results-dock"
      area-label="OCR processed results list"
    >
      <div className="results-section-header">
        <div className="results-section-header__leading">
          <FileText size={20} className="results-section-header__icon" />
          <h2>Extraction Results</h2>
          <span className="results-section-header__count-pill">
            {processedImages.length} processed
          </span>
        </div>

        {/* Dynamic Global Actions Tray */}
        <div className="results-section-header__global-actions-tray">
          <button
            type="button"
            className="btn-outcome btn-outline-secondary"
            onClick={onStartAgain}
            id="start-again-btn"
          >
            <RotateCcw size={15} />
            <span>Start Fresh</span>
          </button>

          <button
            type="button"
            className="btn-outcome btn-outline-primary"
            // onClick={handleDownloadAll}
            id="download-all-results-btn"
          >
            <FileDown size={15} />
            <span>Download All Results</span>
          </button>
        </div>
      </div>

      <div className="cards-stack">
        {processedImages.map((img) => {
          const isCollapsed = collapsedIds[img.id];

          return (
            <article
              key={img.id}
              className={`result-card ${isCollapsed ? "collapsed" : ""}`}
              id={`result-card-${img.id}`}
            >
              <div
                className="card-top-bar"
                onClick={() => toggleCollapse(img.id)}
                role="button"
                tabIndex={0} // make it focusable
                onKeyDown={(e) => {
                  if (e.key === "Enter") toggleCollapse(img.id);
                }}
              >
                <div className="card-top-bar__card-top-leading">
                  <div className="card-mini-thumbnail">
                    <img
                      src={img.previewUrl}
                      className="thumbnail-mini-img"
                      alt="source preview thumbnail"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="card-meta-titles">
                    <h3 className="card-filename" title={img.name}>
                      {img.name}
                    </h3>
                    <div className="specs-indicator">
                      <span>{img.size}</span>
                      <span className="separator-dot">•</span>
                      <span className="word-count">
                        {img.result.wordCount} words
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="card-top-bar__card-top-trailing"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="card-actions-wrapper">
                    <button
                      type="button"
                      className="card-tool-btn"
                      onClick={() => handleCopyText(img.id, img.result.text)}
                      title="Copy extracted text to clipboard"
                      aria-label="Copy extracted text"
                    >
                      {copiedId === img.id ? (
                        <Check size={14} className="copied-icon animate-pop" />
                      ) : (
                        <Copy size={14} />
                      )}
                      <span className="tool-btn-text">
                        {copiedId === img.id ? "Copied" : "Copy"}
                      </span>
                    </button>

                    <button
                      type="button"
                      className="card-tool-btn"
                      onClick={() =>
                        handleDownloadText(img.name, img.result.text)
                      }
                      title="Download as text file (.txt)"
                      aria-label="Download as code or text file"
                    >
                      <Download size={14} />
                      <span className="tool-btn-text">Download</span>
                    </button>

                    <button
                      type="button"
                      className="card-tool-btn collapse-toggle"
                      onClick={() => toggleCollapse(img.id)}
                      title={
                        isCollapsed
                          ? "Expand card content"
                          : "Minimize card content"
                      }
                      aria-label="Collapse panel toggler"
                    >
                      {isCollapsed ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronUp size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Text Area Card Content */}
              {!isCollapsed && (
                <div className="card-content-body animate-slide-down">
                  <div className="card-content-body__editor-status-banner">
                    <AlertCircle size={13} />
                    <span>
                      Extracted text is fully editable. Feel free to clean up
                      minor segment formatting typos below.
                    </span>
                  </div>
                  <textarea
                    className="card-content-body__ocr-textarea-output"
                    value={img.result.text}
                    onChange={(e) =>
                      onUpdateResultsText(img.id, e.target.value)
                    }
                    placeholder="No extracted text recorded or file is empty."
                    aria-label={`Extracted text editor for ${img.name}`}
                  />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Results;
