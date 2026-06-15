import { Anchor } from "lucide-react";
import { motion } from "framer-motion";
import { skillGroups } from "../../data/portfolio";
import { revealVariants, staggerVariants } from "../../utils/motion";
import { Section } from "../Section";

export function Skills() {
  return (
    <Section id="skills" eyebrow="Crew inventory" title="Tools for the Voyage">
      <motion.div
        className="skill-grid"
        variants={staggerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {skillGroups.map((group) => (
          <motion.article
            className="skill-card gsap-hover-card"
            key={group.label}
            variants={revealVariants}
          >
            <div className="skill-card-header">
              <Anchor size={20} />
              <h3>{group.label}</h3>
            </div>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}
