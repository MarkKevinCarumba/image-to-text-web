import React from "react";
import Header from "components/Header/Header";
import Hero from "components/Hero/Hero";
import FileUploader from "components/FileUploader/FileUploader";
import "./OcrMainPage.scss";
import Footer from "components/footer/footer";

const OcrMainPage = () => {
  return (
    <div className="layout-body" id="app-viewport">
      <Header />

      <main className="container main-content">
        <div className="entry-flow animate-slide-down">
          <Hero />

          <div className="landing-uploader-wrapper">
            <FileUploader />
          </div>
        </div>

        <div className="workspace-flow animate-slide-down">
          <div className="workspace-breadcrumbs">
            <span className="breadcrumb-parent">OCR / Workspace</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Batch Manager</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OcrMainPage;
