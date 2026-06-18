import { Anchor } from "lucide-react";
import { motion } from "framer-motion";
import { skillGroups } from "../../data/portfolio";
import { revealVariants, staggerVariants } from "../../utils/motion";
import { Section } from "../Section";

type SkillsContentProps = {
  animated?: boolean;
};

function ToolsChest() {
  return (
    <div className="tools-voyage-stage" aria-hidden="true">
      <div className="tools-chest-shadow" />
      <div className="tools-chest">
        <div className="tools-chest-glow" />
        <div className="tools-chest-lid">
          <span className="tools-chest-metal tools-chest-metal-left" />
          <span className="tools-chest-metal tools-chest-metal-right" />
        </div>
        <div className="tools-chest-base">
          <span className="tools-chest-lock" />
          <span className="tools-chest-plank tools-chest-plank-one" />
          <span className="tools-chest-plank tools-chest-plank-two" />
        </div>
      </div>
    </div>
  );
}

function SkillCard({
  group,
  className = "",
}: {
  group: (typeof skillGroups)[number];
  className?: string;
}) {
  return (
    <article className={`skill-card gsap-hover-card ${className}`}>
      <div className="skill-card-header">
        <Anchor size={20} />
        <h3>{group.label}</h3>
      </div>
      <ul>
        {group.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

export function SkillsContent({ animated = true }: SkillsContentProps) {
  if (!animated) {
    return (
      <div className="tools-voyage-content">
        <ToolsChest />
        <div className="skill-grid tools-skill-grid">
          {skillGroups.map((group) => (
            <SkillCard
              className="tools-skill-card"
              group={group}
              key={group.label}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="tools-voyage-content">
      <ToolsChest />
      <motion.div
        className="skill-grid tools-skill-grid"
        variants={staggerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {skillGroups.map((group) => (
          <motion.article
            className="skill-card gsap-hover-card tools-skill-card"
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
    </div>
  );
}

export function Skills() {
  return (
    <Section id="skills" eyebrow="Crew inventory" title="Tools for the Voyage">
      <SkillsContent />
    </Section>
  );
}
