// Mobile Detection and Landscape Orientation Script
// Enhanced for CBC-MAC Cryptography Simulation - Desktop & Landscape Optimized

class MobileDetection {
  constructor() {
    this.isMobile = this.detectMobile();
    this.isPortrait = this.detectPortrait();
    this.overlayShown = false;
    this.init();
    this.setupOrientationListener();
  }

  detectMobile() {
    // Check for mobile user agents
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Mobile device patterns
    const mobilePatterns = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
      /Opera Mini/i,
      /IEMobile/i,
      /Mobile/i,
    ];

    // Check screen size (additional check for small screens)
    const isSmallScreen = window.innerWidth <= 768 || window.innerHeight <= 600;

    // Check touch capability
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // Return true if any mobile pattern matches OR if it's a small touch screen
    return (
      mobilePatterns.some((pattern) => pattern.test(userAgent)) ||
      (isSmallScreen && isTouchDevice)
    );
  }

  detectPortrait() {
    // More robust portrait detection
    return window.innerHeight > window.innerWidth;
  }

  shouldShowWarning() {
    // Show warning if:
    // 1. Mobile device in portrait mode, OR
    // 2. Very small screen (< 768px width), OR
    // 3. Small screen height that would compress the crypto tables
    return (
      (this.isMobile && this.isPortrait) ||
      window.innerWidth < 768 ||
      window.innerHeight < 500
    );
  }

  setupOrientationListener() {
    // Listen for orientation changes
    const handleOrientationChange = () => {
      setTimeout(() => {
        this.isPortrait = this.detectPortrait();
        if (this.shouldShowWarning() && !this.overlayShown) {
          this.showOverlay();
        } else if (!this.shouldShowWarning() && this.overlayShown) {
          this.hideOverlay();
        }
      }, 100); // Small delay to let orientation change complete
    };

    // Multiple event listeners for better cross-device support
    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);

    // For iOS devices that don't fire orientationchange reliably
    setInterval(() => {
      const newPortrait = this.detectPortrait();
      if (newPortrait !== this.isPortrait) {
        this.isPortrait = newPortrait;
        handleOrientationChange();
      }
    }, 1000);
  }

  init() {
    if (this.shouldShowWarning() && !this.overlayShown) {
      // Wait for DOM to be ready
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.showOverlay());
      } else {
        this.showOverlay();
      }
    }
  }

  showOverlay() {
    if (this.overlayShown) return;

    this.overlayShown = true;

    // Determine message based on device orientation and size
    const isTabletLandscape =
      this.isMobile && !this.isPortrait && window.innerWidth >= 768;
    const isPhone = this.isMobile && window.innerWidth < 768;

    let title = "📱 Optimal Viewing Mode Required";
    let description =
      "This CBC-MAC cryptography simulation is designed for optimal viewing on larger screens.";
    let recommendations = [];

    if (isPhone && this.isPortrait) {
      title = "📱 Rotate to Landscape Mode";
      description =
        "For better viewing of CBC-MAC tables and forms, please rotate your device to landscape mode.";
      recommendations = [
        "🔄 Rotate your phone to landscape orientation",
        "📏 Use a tablet or larger device if available",
        "💻 Access from a desktop computer for best experience",
        "📊 Tables and forms will display better horizontally",
      ];
    } else if (isPhone && !this.isPortrait) {
      title = "📱 Small Screen Detected";
      description =
        "While landscape mode helps, CBC-MAC simulation works best on larger screens.";
      recommendations = [
        "✅ Landscape mode is good!",
        "📱 Consider using a tablet for easier interaction",
        "💻 Desktop computers provide the optimal experience",
        "🔍 Zoom controls may help with small elements",
      ];
    } else if (this.isPortrait) {
      title = "🔄 Landscape Mode Recommended";
      description =
        "CBC-MAC simulation tables display better in landscape orientation.";
      recommendations = [
        "🔄 Rotate your device to landscape mode",
        "📊 Cryptographic tables will be more readable",
        "🎯 Better access to simulation controls",
        "📏 More screen space for educational content",
      ];
    } else {
      recommendations = [
        "💻 Desktop/laptop computers provide optimal experience",
        "📱 Tablets in landscape mode work well",
        "🖱️ Mouse interaction enhances usability",
        "📊 Full visibility of cryptographic operations",
      ];
    }

    // Create overlay HTML
    const overlay = document.createElement("div");
    overlay.id = "mobile-warning-overlay";
    overlay.innerHTML = `
      <div class="mobile-overlay-backdrop">
        <div class="mobile-overlay-content">
          <div class="mobile-overlay-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" stroke="#3b82f6" stroke-width="2" fill="#dbeafe"/>
              <path d="M12 8V13M12 16H12.01" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h2 class="mobile-overlay-title">${title}</h2>
          <p class="mobile-overlay-description">${description}</p>
          <div class="mobile-overlay-crypto-info">
            <strong>🔐 CBC-MAC Simulation Features:</strong>
            <ul class="mobile-overlay-crypto-list">
              <li>• Interactive cryptographic function testing</li>
              <li>• Step-by-step MAC calculation tables</li>
              <li>• Binary input/output visualization</li>
              <li>• Educational examples and validation</li>
            </ul>
          </div>
          <ul class="mobile-overlay-list">
            ${recommendations.map((rec) => `<li>${rec}</li>`).join("")}
          </ul>
          <div class="mobile-overlay-actions">
            <button class="mobile-overlay-btn mobile-overlay-btn-primary" onclick="mobileDetection.continueAnyway()">
              ${isPhone ? "Continue on Phone" : "Continue Anyway"}
            </button>
            ${
              !isTabletLandscape
                ? `
            <button class="mobile-overlay-btn mobile-overlay-btn-secondary" onclick="mobileDetection.remindLater()">
              Remind Me Later
            </button>
            `
                : ""
            }
          </div>
          <p class="mobile-overlay-footer">
            💡 Tip: For the best cryptography learning experience, use a desktop or tablet in landscape mode.
          </p>
        </div>
      </div>
    `;

    // Add overlay styles
    const styles = `
      <style>
        .mobile-overlay-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }

        .mobile-overlay-content {
          background: white;
          border-radius: 16px;
          padding: 24px;
          max-width: 400px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          text-align: center;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: slideUp 0.3s ease-out;
        }

        .mobile-overlay-icon {
          margin: 0 auto 16px;
          width: 48px;
          height: 48px;
        }

        .mobile-overlay-title {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 12px;
          line-height: 1.3;
        }

        .mobile-overlay-description {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 16px;
          line-height: 1.5;
          text-align: left;
        }

        .mobile-overlay-list {
          text-align: left;
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 20px;
          padding-left: 0;
          list-style: none;
        }

        .mobile-overlay-list li {
          margin-bottom: 6px;
          line-height: 1.4;
        }

        .mobile-overlay-crypto-info {
          background: #f0f9ff;
          border: 1px solid #0ea5e9;
          border-radius: 8px;
          padding: 12px;
          margin: 16px 0;
          text-align: left;
        }

        .mobile-overlay-crypto-info strong {
          color: #0369a1;
          font-size: 14px;
        }

        .mobile-overlay-crypto-list {
          margin: 8px 0 0 0;
          padding-left: 16px;
          list-style: none;
        }

        .mobile-overlay-crypto-list li {
          font-size: 13px;
          color: #1e40af;
          margin-bottom: 4px;
          line-height: 1.3;
        }

        .mobile-overlay-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        .mobile-overlay-btn {
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }

        .mobile-overlay-btn-primary {
          background: #3b82f6;
          color: white;
        }

        .mobile-overlay-btn-primary:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .mobile-overlay-btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .mobile-overlay-btn-secondary:hover {
          background: #e5e7eb;
          transform: translateY(-1px);
        }

        .mobile-overlay-footer {
          font-size: 12px;
          color: #9ca3af;
          line-height: 1.4;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (min-width: 480px) {
          .mobile-overlay-actions {
            flex-direction: row;
          }
          
          .mobile-overlay-btn {
            width: auto;
            flex: 1;
          }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      </style>
    `;

    // Add styles to head
    document.head.insertAdjacentHTML("beforeend", styles);

    // Add overlay to body
    document.body.appendChild(overlay);

    // Prevent body scrolling
    document.body.style.overflow = "hidden";
  }

  continueAnyway() {
    this.hideOverlay();
  }

  remindLater() {
    this.hideOverlay();
    // Set a flag to show reminder again after some time or on next visit
    setTimeout(() => {
      if (this.shouldShowWarning()) {
        this.overlayShown = false;
        this.showOverlay();
      }
    }, 300000); // Remind again after 5 minutes
  }

  goBack() {
    // Try to go back in history, or redirect to a homepage if available
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // You can customize this to redirect to your main page
      alert(
        "Please bookmark this page and open it on a desktop computer for the best experience."
      );
    }
  }

  hideOverlay() {
    const overlay = document.getElementById("mobile-warning-overlay");
    if (overlay) {
      overlay.style.animation = "fadeOut 0.3s ease-out forwards";
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = "";
        this.overlayShown = false;
      }, 300);
    }
  }
}

// Initialize mobile detection
const mobileDetection = new MobileDetection();

// Export for use in other scripts if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = MobileDetection;
}
