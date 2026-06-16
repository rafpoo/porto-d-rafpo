import { FileText, Map, Send } from "lucide-react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { SiDocker, SiLaravel, SiMysql, SiNodedotjs, SiReact } from "react-icons/si";
import { CV_URL, heroStackStreamItems } from "../../data/portfolio";
import { linearLoopTransition, loopTransition, revealVariants, staggerVariants } from "../../utils/motion";
import { GsapBountyCarousel, GsapHeroConstellation } from "../GsapVoyageEffects";
import { TechIcon } from "../TechIcon";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isHeroInView = useInView(heroRef, { margin: "0px 0px -15% 0px" });
  const shouldAnimateHero = !shouldReduceMotion && isHeroInView;
  const { scrollY } = useScroll();
  const skyY = useTransform(
    scrollY,
    [0, 620],
    shouldReduceMotion ? [0, 0] : [0, 90],
  );
  const shipY = useTransform(
    scrollY,
    [0, 620],
    shouldReduceMotion ? [0, 0] : [0, 54],
  );
  const waveY = useTransform(
    scrollY,
    [0, 620],
    shouldReduceMotion ? [0, 0] : [0, 28],
  );

  return (
    <section
      className="hero-section"
      id="top"
      ref={heroRef}
      aria-labelledby="hero-heading"
    >
      <GsapHeroConstellation />
      <motion.svg
        className="hero-route-loop"
        viewBox="0 0 760 420"
        aria-hidden="true"
        initial={false}
      >
        <motion.path
          d="M54 296 C176 104 276 90 362 186 C458 294 596 286 704 98"
          animate={
            shouldAnimateHero
              ? {
                  pathLength: [0.12, 0.86, 0.12],
                  pathOffset: [0, 0.28, 0.92],
                }
              : shouldReduceMotion
              ? { pathLength: 1, pathOffset: 0 }
              : undefined
          }
          transition={loopTransition(9)}
        />
      </motion.svg>
      <motion.div
        className="hero-current-marker hero-current-marker-one"
        aria-hidden="true"
        animate={
          shouldAnimateHero
            ? { x: [0, 28, 0], y: [0, -14, 0], opacity: [0.42, 0.86, 0.42] }
            : undefined
        }
        transition={loopTransition(7)}
      >
        <TechIcon
          Icon={SiLaravel}
          label="TypeScript"
          className="tech-icon-laravel"
        />
      </motion.div>
      <motion.div
        className="hero-current-marker hero-current-marker-two"
        aria-hidden="true"
        animate={
          shouldAnimateHero
            ? { x: [0, -20, 0], y: [0, 18, 0], opacity: [0.36, 0.78, 0.36] }
            : undefined
        }
        transition={loopTransition(8.5, 0.4)}
      >
        <TechIcon
          Icon={SiNodedotjs}
          label="Node.js"
          className="tech-icon-node"
        />
      </motion.div>
      <motion.div
        className="hero-sky-map"
        style={{ y: shouldAnimateHero ? skyY : 0 }}
        aria-hidden="true"
        animate={shouldAnimateHero ? { rotate: 360 } : undefined}
        transition={linearLoopTransition(58)}
      >
        <span className="tech-orbit-item tech-orbit-react">
          <TechIcon Icon={SiReact} label="React" className="tech-icon-react" />
        </span>
        <span className="tech-orbit-item tech-orbit-mysql">
          <TechIcon Icon={SiMysql} label="MySQL" className="tech-icon-mysql" />
        </span>
        <span className="tech-orbit-item tech-orbit-docker">
          <TechIcon Icon={SiDocker} label="Docker" className="tech-icon-docker" />
        </span>
      </motion.div>
      <motion.div
        className="hero-tech-layer"
        style={{ y: shouldAnimateHero ? shipY : 0 }}
        aria-hidden="true"
      />
      <motion.div
        className="hero-stack-stream"
        style={{ y: shouldAnimateHero ? waveY : 0 }}
        aria-hidden="true"
      >
        <GsapBountyCarousel>
          {heroStackStreamItems.map((item) => (
            <div className="hero-stack-carousel-card" key={item.label}>
              <TechIcon
                Icon={item.Icon}
                label={item.label}
                className={`${item.className} tech-icon-wide`}
              />
            </div>
          ))}
        </GsapBountyCarousel>
      </motion.div>

      <motion.div
        className="hero-content"
        variants={staggerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p className="eyebrow" variants={revealVariants}>
          Informatics Undergraduate / Full-Stack Developer
        </motion.p>
        <motion.h1 id="hero-heading" variants={revealVariants}>
          Rafael's Voyage Log
        </motion.h1>
        <motion.p className="hero-lede" variants={revealVariants}>
          I build clean, maintainable full-stack web applications with React,
          TypeScript, Node.js, and MySQL, shaped by production work serving
          2,000+ campus users.
        </motion.p>
        <motion.div className="hero-actions" variants={revealVariants}>
          <a className="button button-primary gsap-hover-link" href="#projects">
            <Map size={18} />
            View Projects
          </a>
          <a
            className="button button-secondary gsap-hover-link"
            href={CV_URL}
            target="_blank"
            rel="noreferrer"
          >
            <FileText size={18} />
            View CV
          </a>
          <a className="button button-secondary gsap-hover-link" href="#contact">
            <Send size={18} />
            Send a Message
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
