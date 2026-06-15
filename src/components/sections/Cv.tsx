import { Download, FileText, GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { CV_URL } from "../../data/portfolio";
import { Section } from "../Section";

export function Cv() {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = useMemo(
    () => ({
      duration: shouldReduceMotion ? 0.01 : 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    }),
    [shouldReduceMotion],
  );

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
              platform experience, TrustEnd, MEDEASE, organizations, and Huawei
              certifications.
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
        <iframe
          className="cv-viewer"
          src={CV_URL}
          title="Rafael Nicholas Po CV PDF preview"
        />
      </motion.div>
    </Section>
  );
}
