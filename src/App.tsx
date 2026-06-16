import { Menu, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { navItems, STRAW_HAT_URL } from "./data/portfolio";
import {
  GsapStrawHatStory,
  useGsapHoverEffects,
} from "./components/GsapVoyageEffects";
import { About } from "./components/sections/About";
import { Certifications } from "./components/sections/Certifications";
import { Contact } from "./components/sections/Contact";
import { Cv } from "./components/sections/Cv";
import { Hero } from "./components/sections/Hero";
import { Journey } from "./components/sections/Journey";
import { Projects } from "./components/sections/Projects";
import { RouteLog } from "./components/sections/RouteLog";
import { Skills } from "./components/sections/Skills";

function App() {
  const appRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  useGsapHoverEffects(appRef);

  const motionTransition = useMemo(
    () => ({
      duration: shouldReduceMotion ? 0.01 : 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    }),
    [shouldReduceMotion],
  );

  return (
    <div className="app-shell" ref={appRef}>
      <GsapStrawHatStory />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollYProgress }}
      />
      <header className="site-header" aria-label="Primary navigation">
        <a
          className="brand-mark gsap-hover-link"
          href="#top"
          aria-label="Rafael's Voyage Log home"
        >
          <span
            className="brand-emblem nav-straw-hat-anchor"
            aria-hidden="true"
          >
            <img
              className="nav-straw-hat-image"
              src={STRAW_HAT_URL}
              alt=""
              decoding="async"
            />
          </span>
          <span>Rafael Nicholas Po</span>
        </a>
        <nav className="desktop-nav" aria-label="Main menu">
          {navItems.map((item) => (
            <a className="gsap-hover-link" key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <button
          className="menu-button gsap-hover-link"
          type="button"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((value) => !value)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.nav
            id="mobile-menu"
            className="mobile-nav"
            aria-label="Mobile menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={motionTransition}
          >
            {navItems.map((item) => (
              <a
                className="gsap-hover-link"
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>

      <main id="main">
        <Hero />
        <About />
        {/* <Projects /> */}
        <RouteLog />
        <Skills />
        {/* <Certifications /> */}
        <Journey />
        <Cv />
        <Contact />
      </main>
    </div>
  );
}

export default App;
