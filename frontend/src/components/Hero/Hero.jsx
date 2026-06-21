import React from "react";
import { Eye, Shield, Sparkles } from "lucide-react";
import "./Hero.scss";

const Hero = () => {
  return (
    <section className="hero" id="workspace-hero">
      <div className="container hero-container">
        <div className="hero-container__hero-badge">
          <Sparkles className="hero-badge-icon" size={12} />
          <span>SaaS Grade Extraction Engine</span>
        </div>

        <h1 className="hero-container__hero-title">
          Convert Images to Text Instantly
        </h1>
        <p className="hero-container__hero-subtitle">
          Upload one or multiple images and extract text with high accuracy.
          Supports dragging, clipboard pasting, and public URL fetches with
          privacy-first client-side queuing.
        </p>

        <div className="hero-container__hero-features">
          <div className="hero-feature-item">
            <Shield className="feature-icon" size={16} />
            <span>Secure & Private Processing</span>
          </div>

          <div className="hero-feature-item">
            <Eye className="feature-icon" size={16} />
            <span>Side-by-side Layout Engine</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
