import { ExternalLink, Github, Sailboat, Telescope } from "lucide-react";
import { motion } from "framer-motion";
import { projects } from "../../data/portfolio";
import type { PortfolioProject } from "../../types";
import { revealVariants, staggerVariants } from "../../utils/motion";
import { Section } from "../Section";

const projectIconMap = {
  external: ExternalLink,
  github: Github,
};

const projectCardVariants = [
  "treasure-map",
  "ship-log",
  "expedition-record",
] as const;

export function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Treasure map"
      title="Selected Project Voyages"
    >
      <motion.div
        className="project-grid"
        variants={staggerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </motion.div>
    </Section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: PortfolioProject;
  index: number;
}) {
  const variant = projectCardVariants[index % projectCardVariants.length];

  return (
    <motion.article
      className={`project-card project-card-${variant} gsap-hover-card`}
      data-gsap-tilt={index % 2 === 0 ? "-0.45" : "0.45"}
      variants={revealVariants}
    >
      <div
        className={`project-map project-map-${project.image.theme}`}
        aria-hidden="true"
      >
        <span className="project-map-label">{project.image.label}</span>
        <span className="project-boat">
          <Sailboat size={38} />
        </span>
      </div>
      <div className="project-body">
        <div className="project-meta">
          <span>{project.category}</span>
          <Telescope size={18} aria-hidden="true" />
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <ul
          className="stack-list"
          aria-label={`${project.title} technology stack`}
        >
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="project-actions">
          {project.links.map((link) => {
            const Icon = projectIconMap[link.icon];
            const isInternal = link.href.startsWith("#");

            return (
              <a
                className="gsap-hover-link"
                href={link.href}
                key={link.label}
                target={isInternal ? undefined : "_blank"}
                rel={isInternal ? undefined : "noreferrer"}
              >
                {link.label}
                <Icon size={16} />
              </a>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}
