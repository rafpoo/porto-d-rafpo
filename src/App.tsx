import { ArrowUp, Menu, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { NAV_STRAW_HAT_URL, navItems } from "./data/portfolio";
import {
  GsapStrawHatStory,
  useGsapHoverEffects,
} from "./components/GsapVoyageEffects";
import { About } from "./components/sections/About";
import { Contact } from "./components/sections/Contact";
import { Cv } from "./components/sections/Cv";
import { Hero } from "./components/sections/Hero";
import {
  PortfolioStorySequence,
  scrollToJourneyPhase,
} from "./components/sections/PortfolioStorySequence";
import { Projects } from "./components/sections/Projects";

function App() {
  const appRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
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

  const closeMobileMenu = useCallback((restoreFocus = false) => {
    setIsMenuOpen(false);

    if (restoreFocus) {
      requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const menu = mobileMenuRef.current;
    const focusableLinks = Array.from(
      menu?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? [],
    );
    const previousBodyOverflow = document.body.style.overflow;
    const focusFrame = requestAnimationFrame(() => focusableLinks[0]?.focus());

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileMenu(true);
        return;
      }

      if (event.key !== "Tab" || focusableLinks.length === 0) {
        return;
      }

      const firstLink = focusableLinks[0];
      const lastLink = focusableLinks[focusableLinks.length - 1];

      if (event.shiftKey && document.activeElement === firstLink) {
        event.preventDefault();
        lastLink.focus();
      } else if (!event.shiftKey && document.activeElement === lastLink) {
        event.preventDefault();
        firstLink.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMobileMenu, isMenuOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 981px)");
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    if (desktopQuery.matches) {
      setIsMenuOpen(false);
    }

    desktopQuery.addEventListener("change", handleDesktopChange);

    return () =>
      desktopQuery.removeEventListener("change", handleDesktopChange);
  }, []);

  useEffect(() => {
    const sectionIds = [
      "top",
      ...navItems
        .map((item) => item.href.replace(/^#/, ""))
        .filter((id) => id !== "journey"),
    ];
    const visibleSections = new Map<string, IntersectionObserverEntry>();
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!("IntersectionObserver" in window) || sections.length === 0) {
      return undefined;
    }

    const updateActiveSection = () => {
      const candidates = Array.from(visibleSections.values()).filter(
        (entry) => entry.isIntersecting,
      );

      if (candidates.length === 0) {
        return;
      }

      const targetLine = window.innerHeight * 0.24;
      candidates.sort(
        (first, second) =>
          Math.abs(first.boundingClientRect.top - targetLine) -
          Math.abs(second.boundingClientRect.top - targetLine),
      );

      setActiveSection((candidates[0].target as HTMLElement).id);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).id;

          if (entry.isIntersecting) {
            visibleSections.set(id, entry);
          } else {
            visibleSections.delete(id);
          }
        });

        updateActiveSection();
      },
      {
        rootMargin: "-18% 0px -70% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleNavigation = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>, href: string, mobile = false) => {
      const sectionId = href.replace(/^#/, "");

      if (mobile) {
        closeMobileMenu(true);
      }

      setActiveSection(sectionId);

      if (sectionId === "journey") {
        event.preventDefault();
        scrollToJourneyPhase();
      }
    },
    [closeMobileMenu],
  );

  const handleStoryPhaseChange = useCallback(
    (phase: "skills" | "journey") => setActiveSection(phase),
    [],
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
              src={NAV_STRAW_HAT_URL}
              alt=""
              decoding="async"
              fetchPriority="high"
              width="96"
              height="96"
            />
          </span>
          <span>Rafael Nicholas Po</span>
        </a>
        <nav className="desktop-nav" aria-label="Main menu">
          {navItems.map((item) => (
            <a
              aria-current={
                activeSection === item.href.replace(/^#/, "")
                  ? "location"
                  : undefined
              }
              className="gsap-hover-link"
              key={item.href}
              href={item.href}
              onClick={(event) => handleNavigation(event, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button
          className="menu-button gsap-hover-link"
          ref={menuButtonRef}
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
          <motion.button
            className="mobile-nav-backdrop"
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={motionTransition}
            onClick={() => closeMobileMenu(true)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.nav
            id="mobile-menu"
            className="mobile-nav"
            ref={mobileMenuRef}
            aria-label="Mobile menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={motionTransition}
          >
            {navItems.map((item) => (
              <a
                aria-current={
                  activeSection === item.href.replace(/^#/, "")
                    ? "location"
                    : undefined
                }
                className="gsap-hover-link"
                key={item.href}
                href={item.href}
                onClick={(event) =>
                  handleNavigation(event, item.href, true)
                }
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
        <Projects />
        <PortfolioStorySequence onActivePhaseChange={handleStoryPhaseChange} />
        <Cv />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="site-footer-inner">
        <p className="site-footer-identity">
          <strong>Rafael Nicholas Po</strong>
          <span aria-hidden="true"> / </span>
          <span>Rafael's Voyage Log</span>
        </p>
        <a
          className="button button-tertiary site-footer-back-to-top gsap-hover-link"
          href="#top"
        >
          Back to top
          <ArrowUp size={18} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}

export default App;
