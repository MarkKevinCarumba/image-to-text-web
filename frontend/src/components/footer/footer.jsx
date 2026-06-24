import React from "react";
import { Send, Heart, Activity } from "lucide-react";
import "./footer.scss";

const Footer = ({
  feedbackSubmitted,
  handleFeedbackSubmit,
  setFeedbackMsg,
  feedbackMsg,
}) => {
  return (
    <footer className="workspace-footer" id="app-footer">
      <div className="container footer-content-grid">
        {/* Column 1: Brand & Purpose */}
        <div className="footer-col brand-col">
          <h3 className="footer-col-title">Image To Text OCR</h3>
          <p className="footer-col-desc">
            A high-precision, privacy-first offline batch extraction queue
            optimized by{" "}
            <strong className="text-primary font-semibold">MarkDev</strong> for
            invoices, bills, receipts, and source code.
          </p>
          <span className="api-badge">
            <span className="api-badge-indicator-dot" />
            API Sandbox Connected
          </span>
        </div>

        {/* Column 2: Document Toolkit */}
        <div className="footer-col features-col">
          <h4 className="footer-col-subheading">Features Suite</h4>
          <ul className="footer-menu-links">
            <li>
              <a href="#uploader-box" className="footer-txt-link">
                Batch Image Queuer
              </a>
            </li>
            <li>
              <a href="#split-workspace" className="footer-txt-link">
                Split-Pane Previewer
              </a>
            </li>
            <li>
              <a href="#ocr-results-dock" className="footer-txt-link">
                Interactive Code Editor
              </a>
            </li>
            <li>
              <a
                href="#docs"
                className="footer-txt-link"
                onClick={(e) => {
                  e.preventDefault();
                  alert(
                    "Open Source SDK schemas are ready to integrate later.",
                  );
                }}
              >
                Developer Sandbox APIs
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Live Engine Metrics */}
        <div className="footer-col engine-col">
          <h4 className="footer-col-subheading">Engine Telemetry</h4>
          <ul className="footer-telemetry-list">
            <li className="telemetry-item">
              <span className="telemetry-label">Version:</span>
              <span className="telemetry-value">v1.2.0-Stable</span>
            </li>
            <li className="telemetry-item">
              <span className="telemetry-label">Engine Latency:</span>
              <span className="telemetry-value text-success">~380ms / img</span>
            </li>
            <li className="telemetry-item">
              <span className="telemetry-label">File Limits:</span>
              <span className="telemetry-value">Unlimited Queues</span>
            </li>
            <li className="telemetry-item">
              <span className="telemetry-label">Database Type:</span>
              <span className="telemetry-value font-mono">
                Drizzle SQL Ready
              </span>
            </li>
          </ul>
        </div>

        {/* Column 4: Quick Feedback Form */}
        <div className="footer-col feedback-col">
          <h4 className="footer-col-subheading">Sandbox Feedback</h4>
          <p className="feedback-hint">
            Enjoying of the open source batch converter? Send us suggestions!
          </p>

          {feedbackSubmitted ? (
            <div
              className="feedback-success-card animate-pop"
              id="feedback-success-note"
            >
              <Activity size={14} className="spinning" />
              <span>
                Feedback stored cleanly. Thank you for supporting OCR suite!
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleFeedbackSubmit}
              className="footer-feedback-form"
            >
              <input
                type="text"
                placeholder="Enter suggestions or bugs..."
                value={feedbackMsg}
                onChange={(e) => setFeedbackMsg(e.target.value)}
                className="footer-feedback-input"
                aria-label="Submit Feedback to Sandboxed Storage"
                required
              />
              <button
                type="submit"
                className="footer-feedback-btn"
                aria-label="Submit comment"
              >
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom copyright section */}
      <div className="footer-bottom-bar">
        <div className="container bottom-bar-layout">
          <p className="footer-copyright-text">
            &copy; {new Date().getFullYear()} Image To Text OCR Suite. Standard
            Apache-2.0 License.
          </p>

          <div className="made-with-love">
            <span>Engineered with</span>
            <Heart size={12} className="heart-iconPulse" />
            <span>
              by{" "}
              <strong
                className="text-secondary font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                MarkDev
              </strong>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
