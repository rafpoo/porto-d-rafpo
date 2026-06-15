import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { STRAW_HAT_URL } from "../data/portfolio";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section
      className="content-section"
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${id}-title`}>
          {id === "about" ? (
            <>
              About the Capta
              <span className="captain-hat-anchor">
                in
                <span className="straw-hat-dock" aria-hidden="true">
                  <img
                    className="straw-hat-dock-image"
                    src={STRAW_HAT_URL}
                    alt=""
                    decoding="async"
                  />
                </span>
              </span>
            </>
          ) : (
            title
          )}
        </h2>
      </motion.div>
      {children}
    </section>
  );
}
