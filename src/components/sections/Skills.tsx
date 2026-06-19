import { Anchor } from "lucide-react";
import { motion } from "framer-motion";
import type { Ref } from "react";
import { skillGroups } from "../../data/portfolio";
import { revealVariants, staggerVariants } from "../../utils/motion";
import { Section } from "../Section";
import {
  TreasureChest3D,
  type TreasureChest3DHandle,
} from "./TreasureChest3D";

type SkillsContentProps = {
  animated?: boolean;
  chestRef?: Ref<TreasureChest3DHandle>;
};

function ToolsChest({
  chestRef,
}: {
  chestRef?: Ref<TreasureChest3DHandle>;
}) {
  return (
    <>
      <div className="tools-voyage-stage" aria-hidden="true">
        <div className="tools-chest-shadow" />
        <div className="tools-chest">
          <TreasureChest3D ref={chestRef} />
          <span className="tools-chest-glow" />
          <span className="tools-chest-ray tools-chest-ray-one" />
          <span className="tools-chest-ray tools-chest-ray-two" />
          <span className="tools-chest-ray tools-chest-ray-three" />
          <span className="tools-chest-sparkle tools-chest-sparkle-one" />
          <span className="tools-chest-sparkle tools-chest-sparkle-two" />
          <span className="tools-chest-sparkle tools-chest-sparkle-three" />
          <span className="tools-chest-dust tools-chest-dust-one" />
          <span className="tools-chest-dust tools-chest-dust-two" />
        </div>
      </div>
      <p className="tools-chest-attribution">
        3D model{" "}
        <a
          href="https://sketchfab.com/3d-models/animated-treasure-chest-8a91221263b74048a4511dad9119203f"
          target="_blank"
          rel="noreferrer"
        >
          "Animated Treasure Chest"
        </a>{" "}
        by{" "}
        <a
          href="https://sketchfab.com/kaynichol"
          target="_blank"
          rel="noreferrer"
        >
          Kay Nichol
        </a>
        , licensed under{" "}
        <a
          href="http://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noreferrer"
        >
          CC BY 4.0
        </a>
        .
      </p>
    </>
  );
}

function SkillCategoryCard({
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

function InventoryCards({ animated }: { animated: boolean }) {
  if (!animated) {
    return (
      <div className="skill-grid tools-skill-grid">
        {skillGroups.map((group) => (
          <SkillCategoryCard
            className="tools-skill-card"
            group={group}
            key={group.label}
          />
        ))}
      </div>
    );
  }

  return (
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
  );
}

export function SkillsContent({
  animated = true,
  chestRef,
}: SkillsContentProps) {
  return (
    <div className="tools-voyage-content">
      <ToolsChest chestRef={chestRef} />
      <InventoryCards animated={animated} />
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
