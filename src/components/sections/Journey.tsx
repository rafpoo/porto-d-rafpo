import { motion, useReducedMotion } from "framer-motion";
import { timelineItems } from "../../data/portfolio";
import { revealVariants } from "../../utils/motion";
import { GsapJourneyRoute } from "../GsapVoyageEffects";
import { Section } from "../Section";

export function Journey() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section id="journey" eyebrow="Island route" title="Journey Timeline">
      <GsapJourneyRoute />
      <div
        className="timeline"
        aria-label="Rafael's portfolio journey timeline"
      >
        {timelineItems.map((item, index) => (
          <motion.article
            className="timeline-item gsap-hover-card"
            key={item.title}
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-90px" }}
            transition={{ delay: shouldReduceMotion ? 0 : index * 0.06 }}
          >
            <span className="timeline-date">{item.date}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
