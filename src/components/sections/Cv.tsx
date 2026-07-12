import { Download, FileText, GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState, type CSSProperties } from "react";
import { CV_URL } from "../../data/portfolio";
import { Section } from "../Section";

type CvViewerState = "error" | "loading" | "ready";

const visuallyHiddenStyle: CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

const viewerOverlayStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 1,
  display: "grid",
  placeItems: "center",
  margin: 0,
  border: "1px solid rgba(42, 23, 14, 0.3)",
  borderRadius: "8px",
  background: "var(--parchment-texture)",
  color: "var(--ink-700)",
  padding: "24px",
  textAlign: "center",
};

export function Cv() {
  const shouldReduceMotion = useReducedMotion();
  const [viewerState, setViewerState] =
    useState<CvViewerState>("loading");
  const motionTransition = useMemo(
    () => ({
      duration: shouldReduceMotion ? 0.01 : 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    }),
    [shouldReduceMotion],
  );
  const viewerStatus =
    viewerState === "loading"
      ? "Loading CV preview..."
      : viewerState === "error"
        ? "The embedded CV preview is unavailable. Use Open CV or Download above instead."
        : "CV preview is ready.";

  return (
    <Section id="cv" eyebrow="Captain's papers" title="View My CV">
      <motion.div
        className="cv-panel"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={motionTransition}
      >
        <div className="cv-summary gsap-hover-card">
          <div className="cv-summary-icon" aria-hidden="true">
            <GraduationCap size={28} />
          </div>
          <div>
            <h3>Rafael Nicholas Po - CV</h3>
            <p>
              Includes education, technical skills, MAXIMA UMN production
              platform experience, TrustEnd, MEDEASE, and organization
              experience.
            </p>
          </div>
          <div className="cv-actions">
            <a
              className="button button-primary gsap-hover-link"
              href={CV_URL}
              target="_blank"
              rel="noreferrer"
            >
              <FileText size={18} />
              Open CV
            </a>
            <a
              className="button button-secondary cv-download gsap-hover-link"
              href={CV_URL}
              download
            >
              <Download size={18} />
              Download
            </a>
          </div>
        </div>
        <div
          className={`cv-viewer-shell is-${viewerState}`}
          data-cv-viewer-state={viewerState}
          aria-busy={viewerState === "loading"}
          style={{ position: "relative" }}
        >
          <p
            id="cv-viewer-status"
            className="cv-viewer-status"
            role={viewerState === "error" ? "alert" : "status"}
            aria-live={viewerState === "error" ? "assertive" : "polite"}
            aria-atomic="true"
            style={
              viewerState === "ready"
                ? visuallyHiddenStyle
                : viewerOverlayStyle
            }
          >
            {viewerStatus}
          </p>
          <iframe
            className="cv-viewer"
            src={CV_URL}
            title="Rafael Nicholas Po CV PDF preview"
            loading="lazy"
            aria-busy={viewerState === "loading"}
            aria-describedby="cv-viewer-status"
            aria-hidden={viewerState === "ready" ? undefined : true}
            tabIndex={viewerState === "ready" ? 0 : -1}
            onLoad={() => setViewerState("ready")}
            onError={() => setViewerState("error")}
            style={{ opacity: viewerState === "ready" ? 1 : 0 }}
          />
        </div>
      </motion.div>
    </Section>
  );
}
