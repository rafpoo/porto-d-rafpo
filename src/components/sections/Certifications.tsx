import { Award } from "lucide-react";
import { motion } from "framer-motion";
import { certifications } from "../../data/portfolio";
import { revealVariants, staggerVariants } from "../../utils/motion";
import { Section } from "../Section";

export function Certifications() {
  return (
    <Section
      id="certifications"
      eyebrow="Credential chest"
      title="Certifications"
    >
      <motion.div
        className="certification-grid"
        variants={staggerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {certifications.map((certificate) => (
          <motion.article
            className="certification-card gsap-hover-card"
            key={certificate}
            variants={revealVariants}
          >
            <Award size={22} aria-hidden="true" />
            <span>{certificate}</span>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}
