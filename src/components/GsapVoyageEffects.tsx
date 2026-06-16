import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";
import {
  Database,
  ExternalLink,
  Github,
  LockKeyhole,
  ServerCog,
  Smartphone,
} from "lucide-react";
import type { IconType } from "react-icons";
import {
  SiExpress,
  SiNodedotjs,
  SiReact,
  SiSupabase,
  SiTypescript,
} from "react-icons/si";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
ScrollTrigger.config({ ignoreMobileResize: true });

type BountyCounterProps = {
  decimals?: number;
  label: string;
  suffix?: string;
  useGrouping?: boolean;
  value: number;
};

type ScrollytellingProject = {
  category: string;
  description: string;
  image: {
    label: string;
    theme: "lagoon" | "sunset" | "storm";
  };
  links: {
    label: string;
    href: string;
    icon: "external" | "github";
  }[];
  stack: string[];
  title: string;
};

type AboutScrollytellingProps = {
  children: ReactNode;
  projects: ScrollytellingProject[];
};

const STRAW_HAT_URL = `${import.meta.env.BASE_URL}assets/straw-hat.png`;

function isElementVisible(element: Element) {
  const rect = element.getBoundingClientRect();

  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < window.innerHeight &&
    rect.left < window.innerWidth
  );
}

const routeLogItems = [
  {
    icon: ServerCog,
    label: "01",
    title: "API Harbor",
    text: "REST APIs, clean CRUD flows, and Sequelize models for production campus platforms.",
    tools: ["Express.js", "Node.js", "Sequelize"],
  },
  {
    icon: LockKeyhole,
    label: "02",
    title: "Auth Gate",
    text: "OAuth2, Apereo CAS SSO, Supabase auth, and Row Level Security for safer access control.",
    tools: ["OAuth2", "CAS SSO", "Supabase RLS"],
  },
  {
    icon: Database,
    label: "03",
    title: "Data Reef",
    text: "Relational schemas, admin dashboards, ticketing flows, payment states, and reporting views.",
    tools: ["MySQL", "PostgreSQL", "Midtrans"],
  },
  {
    icon: Smartphone,
    label: "04",
    title: "Mobile Island",
    text: "Attendance, medical booking, offline sync, maps, notifications, and Android-first workflows.",
    tools: ["React Native", "Kotlin", "Firebase"],
  },
];

function formatCounter(
  value: number,
  decimals: number,
  suffix = "",
  useGrouping = true,
) {
  return `${value.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
    useGrouping,
  })}${suffix}`;
}

function TechIcon({
  className,
  Icon,
  label,
}: {
  className?: string;
  Icon: IconType;
  label: string;
}) {
  return (
    <span
      className={`tech-icon ${className ?? ""}`}
      title={label}
      aria-label={label}
    >
      <Icon aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export function useGsapHoverEffects(scopeRef: RefObject<HTMLElement | null>) {
  useGSAP(
    (_, contextSafe) => {
      const root = scopeRef.current;

      if (!root || !contextSafe) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const cards = gsap.utils.toArray<HTMLElement>(
        '.gsap-hover-card:not([data-gsap-hover="static"])',
        root,
      );
      const links = gsap.utils.toArray<HTMLElement>(".gsap-hover-link", root);

      gsap.set([...cards, ...links], {
        transformOrigin: "50% 50%",
      });

      if (reduceMotion) {
        return;
      }

      const hoverIcons =
        "svg, .brand-emblem, .cv-summary-icon, .route-log-index";

      cards.forEach((card, index) => {
        card.dataset.gsapTilt =
          card.dataset.gsapTilt ?? (index % 2 === 0 ? "-0.45" : "0.45");
      });

      const handleCardEnter = contextSafe((event: Event) => {
        const target = event.currentTarget as HTMLElement;
        const tilt = Number(target.dataset.gsapTilt ?? 0.45);
        const isCompact = window.matchMedia("(max-width: 680px)").matches;

        gsap.to(target, {
          duration: 0.38,
          ease: "power3.out",
          overwrite: "auto",
          rotation: isCompact ? 0 : tilt,
          scale: 1.012,
          y: isCompact ? -4 : -8,
        });

        gsap.to(target.querySelectorAll(hoverIcons), {
          duration: 0.38,
          ease: "power3.out",
          overwrite: "auto",
          rotation: -6,
          scale: 1.08,
        });
      });

      const handleCardLeave = contextSafe((event: Event) => {
        const target = event.currentTarget as HTMLElement;

        gsap.to(target, {
          duration: 0.32,
          ease: "power2.out",
          overwrite: "auto",
          rotation: 0,
          scale: 1,
          y: 0,
        });

        gsap.to(target.querySelectorAll(hoverIcons), {
          duration: 0.32,
          ease: "power2.out",
          overwrite: "auto",
          rotation: 0,
          scale: 1,
          x: 0,
        });
      });

      const handleLinkEnter = contextSafe((event: Event) => {
        const target = event.currentTarget as HTMLElement;

        gsap.to(target, {
          duration: 0.22,
          ease: "power2.out",
          overwrite: "auto",
          scale: 1.025,
          y: -3,
        });

        gsap.to(target.querySelectorAll("svg"), {
          duration: 0.22,
          ease: "power2.out",
          overwrite: "auto",
          rotation: -8,
          scale: 1.12,
          x: 3,
        });
      });

      const handleLinkLeave = contextSafe((event: Event) => {
        const target = event.currentTarget as HTMLElement;

        gsap.to(target, {
          duration: 0.2,
          ease: "power2.out",
          overwrite: "auto",
          scale: 1,
          y: 0,
        });

        gsap.to(target.querySelectorAll("svg"), {
          duration: 0.2,
          ease: "power2.out",
          overwrite: "auto",
          rotation: 0,
          scale: 1,
          x: 0,
        });
      });

      cards.forEach((card) => {
        card.addEventListener("pointerenter", handleCardEnter);
        card.addEventListener("pointerleave", handleCardLeave);
      });

      links.forEach((link) => {
        link.addEventListener("pointerenter", handleLinkEnter);
        link.addEventListener("pointerleave", handleLinkLeave);
      });

      return () => {
        cards.forEach((card) => {
          card.removeEventListener("pointerenter", handleCardEnter);
          card.removeEventListener("pointerleave", handleCardLeave);
        });

        links.forEach((link) => {
          link.removeEventListener("pointerenter", handleLinkEnter);
          link.removeEventListener("pointerleave", handleLinkLeave);
        });
      };
    },
    { scope: scopeRef },
  );
}

export function GsapStrawHatStory() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const wrapper = scope.current;
      const hat = wrapper?.querySelector<HTMLImageElement>(
        ".straw-hat-story-image",
      );
      const dock = document.querySelector<HTMLElement>(".straw-hat-dock");
      const dockImage = document.querySelector<HTMLImageElement>(
        ".straw-hat-dock-image",
      );
      const navHat = document.querySelector<HTMLElement>(
        ".nav-straw-hat-anchor",
      );
      const about = document.querySelector<HTMLElement>("#about");

      if (!wrapper || !hat || !dock || !dockImage || !navHat || !about) {
        return;
      }

      if (reduceMotion) {
        gsap.set(wrapper, { autoAlpha: 0 });
        gsap.set(navHat, { autoAlpha: 1 });
        gsap.set(dockImage, { autoAlpha: 1, scale: 1, rotation: 45 });
        return;
      }

      const getNavOffset = () => {
        const navRect = navHat.getBoundingClientRect();
        const centerX = navRect.left + navRect.width / 2;
        const centerY = navRect.top + navRect.height / 2;

        return {
          x: centerX - window.innerWidth / 2,
          y: centerY - window.innerHeight / 2,
        };
      };

      const getNavScale = () => {
        const navRect = navHat.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();
        const wrapperWidth = wrapperRect.width || window.innerWidth;

        return navRect.width / wrapperWidth;
      };

      const getDockOffset = () => {
        const dockRect = dock.getBoundingClientRect();
        const centerX = dockRect.left + dockRect.width / 2;
        const centerY = dockRect.top + dockRect.height / 2;

        return {
          x: centerX - window.innerWidth / 2,
          y: centerY - window.innerHeight / 2,
        };
      };

      const getEndScale = () => (window.innerWidth < 680 ? 0.34 : 0.2);

      gsap.set(wrapper, {
        autoAlpha: 0,
        left: "50%",
        pointerEvents: "none",
        position: "fixed",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
        zIndex: 80,
      });

      gsap.set(hat, {
        filter: "drop-shadow(0 34px 44px rgba(3, 15, 28, 0.32))",
        rotation: -16,
        scale: getNavScale,
        transformOrigin: "50% 52%",
        x: () => getNavOffset().x,
        y: () => getNavOffset().y,
      });

      gsap.set(navHat, {
        autoAlpha: 1,
      });

      gsap.set(dockImage, {
        autoAlpha: 0,
        rotation: 45,
        scale: 0.82,
        transformOrigin: "50% 52%",
      });

      const hatTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: about,
          start: "top bottom",
          end: "top 20%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      hatTimeline
        .to(
          wrapper,
          {
            autoAlpha: 1,
            duration: 0.04,
            ease: "none",
          },
          0,
        )
        .to(
          navHat,
          {
            autoAlpha: 0,
            duration: 0.05,
            ease: "none",
          },
          0,
        )
        .to(
          hat,
          {
            duration: 0.38,
            ease: "power1.inOut",
            rotation: 340,
            scale: () => (window.innerWidth < 680 ? 0.62 : 0.72),
            x: 0,
            y: () => (window.innerWidth < 680 ? -8 : 0),
          },
          0.06,
        )
        .to(
          hat,
          {
            duration: 0.54,
            ease: "power2.inOut",
            rotation: 765,
            scale: getEndScale,
            x: () => getDockOffset().x,
            y: () => getDockOffset().y,
          },
          0.44,
        )
        .to(
          dockImage,
          {
            autoAlpha: 1,
            duration: 0.16,
            ease: "none",
            rotation: 45,
            scale: 1,
          },
          0.82,
        )
        .to(
          wrapper,
          {
            autoAlpha: 0,
            duration: 0.18,
            ease: "none",
          },
          0.86,
        );

      gsap.to(dockImage, {
        y: -8,
        duration: 3.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        scrollTrigger: {
          trigger: dock,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play pause resume pause",
        },
      });

      ScrollTrigger.refresh();
    },
    { scope },
  );

  return (
    <div className="straw-hat-story" ref={scope} aria-hidden="true">
      <img
        className="straw-hat-story-image"
        src={STRAW_HAT_URL}
        alt=""
        decoding="async"
      />
    </div>
  );
}

export function GsapBountyCarousel({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);

  useGSAP(
    () => {
      const root = scope.current;

      if (!root) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const track = root.querySelector<HTMLElement>(".bounty-carousel-track");
      const firstSet = root.querySelector<HTMLElement>(".bounty-carousel-set");

      if (!track || !firstSet) {
        return;
      }

      if (reduceMotion) {
        gsap.set(track, { clearProps: "all" });
        return;
      }

      const createLoop = () => {
        const gap = Number.parseFloat(getComputedStyle(track).columnGap || "0");
        const distance = firstSet.offsetWidth + gap;

        if (distance <= 1) {
          return null;
        }

        gsap.set(track, { x: 0 });

        return gsap.to(track, {
          duration: 14,
          ease: "none",
          paused: true,
          repeat: -1,
          x: -distance,
        });
      };

      let loop = createLoop();
      const playLoop = () => loop?.play();
      const pauseLoop = () => loop?.pause();
      const visibilityTrigger = ScrollTrigger.create({
        end: "bottom top",
        onEnter: playLoop,
        onEnterBack: playLoop,
        onLeave: pauseLoop,
        onLeaveBack: pauseLoop,
        start: "top bottom",
        trigger: root,
      });

      if (loop && isElementVisible(root)) {
        loop.play();
      }

      const handleResize = () => {
        loop?.kill();
        loop = createLoop();
        visibilityTrigger.refresh();

        if (loop && isElementVisible(root)) {
          loop.play();
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        visibilityTrigger.kill();
        loop?.kill();
        window.removeEventListener("resize", handleResize);
      };
    },
    { scope },
  );

  return (
    <div className="bounty-carousel" ref={scope}>
      <div className="bounty-carousel-track">
        <div className="bounty-carousel-set">
          {items.map((item, index) =>
            isValidElement(item)
              ? cloneElement(item as ReactElement<Record<string, unknown>>, {
                  key: `bounty-${index}`,
                })
              : item,
          )}
        </div>
        <div className="bounty-carousel-set" aria-hidden="true">
          {items.map((item, index) =>
            isValidElement(item)
              ? cloneElement(item as ReactElement<Record<string, unknown>>, {
                  key: `bounty-clone-${index}`,
                })
              : item,
          )}
        </div>
      </div>
    </div>
  );
}

export function GsapAboutScrollytelling({
  children,
  projects,
}: AboutScrollytellingProps) {
  const scope = useRef<HTMLDivElement>(null);
  const posterStageRef = useRef<HTMLDivElement>(null);
  const posterWrapperRef = useRef<HTMLDivElement>(null);
  const posterHingeRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLElement | null>(null);
  const leftTapeRef = useRef<HTMLSpanElement>(null);
  const rightTapeRef = useRef<HTMLSpanElement>(null);
  const storyItems = Children.toArray(children);
  const [posterChild, ...contentChildren] = storyItems;
  const posterNode = isValidElement(posterChild)
    ? cloneElement(
        posterChild as ReactElement<Record<string, unknown>>,
        { ref: posterRef } as Record<string, unknown>,
      )
    : posterChild;

  useGSAP(
    () => {
      const root = scope.current;

      if (!root) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 981px)",
          isMobile: "(max-width: 680px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, isMobile, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };
          const posterStage = posterStageRef.current;
          const posterWrapper = posterWrapperRef.current;
          const posterHinge = posterHingeRef.current;
          const poster =
            posterRef.current ??
            root.querySelector<HTMLElement>(".about-profile-card");
          const leftTape = leftTapeRef.current;
          const rightTape = rightTapeRef.current;
          const copy = root.querySelector<HTMLElement>(".about-story-copy");
          const roulette = root.querySelector<HTMLElement>(".about-roulette");
          const wheel = root.querySelector<HTMLElement>(
            ".about-roulette-orbit",
          );
          const cards = gsap.utils.toArray<HTMLElement>(
            ".about-roulette-card",
            root,
          );
          const clearTargets = [
            posterStage,
            posterWrapper,
            posterHinge,
            poster,
            leftTape,
            rightTape,
            copy,
            roulette,
            wheel,
            ...cards,
          ].filter(Boolean);

          root.classList.remove("is-pinned-ready", "is-wanted-exit-ready");
          cards.forEach((card) => {
            card.classList.remove("is-active");
            card.removeAttribute("aria-hidden");
          });
          gsap.set(clearTargets, { clearProps: "all" });

          if (
            !posterStage ||
            !posterWrapper ||
            !posterHinge ||
            !poster ||
            !leftTape ||
            !rightTape ||
            !copy ||
            !roulette
          ) {
            return;
          }

          const useRoulette = isDesktop && !reduceMotion && Boolean(wheel);

          root.classList.add("is-wanted-exit-ready");

          if (useRoulette) {
            root.classList.add("is-pinned-ready");
          }

          const state = { frame: 0 };
          const segment = cards.length > 0 ? 360 / cards.length : 0;
          let previousActiveIndex = -1;
          let previousRenderedFrame = Number.NaN;
          const metrics = {
            fallDistance: 0,
            fallRotation: 0,
            fallX: 0,
            hangRotation: 0,
            hangX: 0,
            hangY: 0,
            radiusZ: 0,
            radiusX: 0,
            releaseRotation: 0,
            rightTapeHangRotation: 0,
            rightTapeHangX: 0,
            rightTapeHangY: 0,
            stageDrop: 0,
            stageScale: 1,
            stageTravelX: 0,
          };

          const updateMetrics = () => {
            const rootWidth = root.getBoundingClientRect().width;
            const wheelWidth =
              wheel?.getBoundingClientRect().width || rootWidth;
            const posterRect = posterWrapper.getBoundingClientRect();
            const stageMaxTravel = Math.max(
              0,
              rootWidth - posterStage.offsetLeft - posterStage.offsetWidth - 16,
            );

            metrics.fallDistance =
              window.innerHeight + posterRect.height * 1.18 + 120;
            metrics.fallRotation = isMobile ? -12 : -22;
            metrics.fallX = isMobile ? -24 : -54;
            metrics.hangRotation = isMobile ? -17 : -24;
            metrics.hangX = isMobile ? -3 : -8;
            metrics.hangY = Math.min(
              posterRect.height * (isMobile ? 0.045 : 0.06),
              isMobile ? 20 : 30,
            );
            metrics.radiusX = Math.min(wheelWidth * 0.32, 270);
            metrics.radiusZ = Math.min(wheelWidth * 0.42, 320);
            metrics.releaseRotation = isMobile ? -13 : -17;
            metrics.rightTapeHangRotation = isMobile ? -3 : -5;
            metrics.rightTapeHangX = isMobile ? 14 : 28;
            metrics.rightTapeHangY = isMobile ? 8 : 16;
            metrics.stageDrop = isDesktop
              ? window.innerHeight < 760
                ? 30
                : 58
              : isMobile
                ? 10
                : 24;
            metrics.stageScale = isDesktop ? 0.82 : isMobile ? 0.92 : 0.88;
            metrics.stageTravelX = isDesktop
              ? Math.min(rootWidth * 0.58, 660, stageMaxTravel)
              : Math.min(rootWidth * 0.18, 90, stageMaxTravel);
          };

          const renderWheel = () => {
            if (!useRoulette || cards.length === 0) {
              return;
            }

            if (Math.abs(state.frame - previousRenderedFrame) < 0.02) {
              return;
            }

            previousRenderedFrame = state.frame;

            const activeIndex = gsap.utils.clamp(
              0,
              cards.length - 1,
              Math.floor(state.frame + 0.08),
            );

            if (activeIndex !== previousActiveIndex) {
              cards.forEach((card, index) => {
                const isActive = index === activeIndex;

                card.classList.toggle("is-active", isActive);
                card.setAttribute("aria-hidden", isActive ? "false" : "true");
              });
              previousActiveIndex = activeIndex;
            }

            cards.forEach((card, index) => {
              const angle = (index - state.frame) * segment;
              const normalizedAngle = gsap.utils.wrap(-180, 180, angle);
              const radians = (normalizedAngle * Math.PI) / 180;
              const depth = Math.cos(radians);
              const side = Math.sin(radians);
              const depthProgress = (depth + 1) / 2;
              const opacity = gsap.utils.clamp(0.18, 1, 0.22 + depthProgress);
              const scale = gsap.utils.clamp(
                0.68,
                1,
                0.76 + depthProgress * 0.24,
              );

              gsap.set(card, {
                opacity,
                rotationY: -normalizedAngle,
                rotationZ: side * -2.6,
                scale,
                transformOrigin: "50% 50%",
                x: side * metrics.radiusX,
                xPercent: -50,
                y: Math.abs(side) * 14,
                yPercent: -50,
                z: (depth - 1) * metrics.radiusZ,
                zIndex: Math.round(200 + depth * 100),
              });
            });
          };

          updateMetrics();
          renderWheel();

          gsap.set(posterStage, {
            autoAlpha: 1,
            force3D: true,
            rotation: 0,
            scale: 1,
            transformOrigin: "50% 50%",
            willChange: "transform",
            x: 0,
            y: 0,
          });
          gsap.set(posterWrapper, {
            autoAlpha: 1,
            force3D: true,
            transformOrigin: "50% 50%",
            willChange: "transform",
            x: 0,
            y: 0,
            rotation: 0,
          });
          gsap.set(posterHinge, {
            force3D: true,
            transformOrigin: "50% 50%",
            willChange: "transform",
            x: 0,
            y: 0,
            rotation: 0,
          });
          gsap.set(poster, {
            transformOrigin: "50% 50%",
            willChange: "transform",
          });
          gsap.set(leftTape, {
            autoAlpha: 1,
            force3D: true,
            rotation: -8,
            scale: 1,
            transformOrigin: "42% 50%",
            willChange: "opacity, transform",
            x: 0,
            xPercent: -28,
            y: 0,
            yPercent: -10,
          });
          gsap.set(rightTape, {
            autoAlpha: 1,
            force3D: true,
            rotation: 8,
            scale: 1,
            transformOrigin: "72% 70%",
            willChange: "opacity, transform",
            x: 0,
            xPercent: 28,
            y: 0,
            yPercent: -10,
          });
          gsap.set(copy, {
            willChange: "opacity, transform",
          });

          if (useRoulette) {
            gsap.set(roulette, {
              autoAlpha: 0,
              scale: 0.96,
              transformOrigin: "36% 50%",
              y: 42,
            });
          }

          const maxFrame = Math.max(0, cards.length - 1);
          const rouletteHoldDuration = isDesktop ? 2.8 : 2.25;
          const rouletteTransitionDuration = isDesktop ? 0.5 : 0.45;
          const rouletteSpinDuration =
            maxFrame > 0
              ? maxFrame *
                  (rouletteHoldDuration + rouletteTransitionDuration) +
                rouletteHoldDuration
              : rouletteHoldDuration;
          const rouletteStartOffset = 0.45;
          const rouletteExitStart =
            2 + rouletteStartOffset + rouletteSpinDuration + 0.7;
          const getScrollDistance = () => {
            const projectStepScroll = isDesktop ? 1200 : isMobile ? 820 : 980;
            const setupAndExitScroll = isDesktop
              ? 3200
              : isMobile
                ? 2500
                : 2850;
            const distance = Math.round(
              setupAndExitScroll + maxFrame * projectStepScroll,
            );

            return `+=${gsap.utils.clamp(4800, 10800, distance)}`;
          };
          const getReducedScrollDistance = () =>
            `+=${Math.max(Math.round(window.innerHeight * 0.85), 720)}`;
          const timeline = gsap.timeline({
            scrollTrigger: {
              anticipatePin: 1,
              end: reduceMotion ? getReducedScrollDistance : getScrollDistance,
              invalidateOnRefresh: true,
              onRefresh: () => {
                updateMetrics();
                previousRenderedFrame = Number.NaN;
                renderWheel();
              },
              pin: true,
              refreshPriority: -1,
              scrub: reduceMotion ? 0.35 : 0.8,
              start: "top top",
              trigger: root,
            },
          });

          if (reduceMotion) {
            timeline
              .to([leftTape, rightTape], {
                autoAlpha: 0,
                duration: 0.2,
                ease: "none",
                scale: 0.92,
              })
              .to(
                copy,
                {
                  autoAlpha: 0.82,
                  duration: 0.2,
                  ease: "none",
                },
                0,
              )
              .to(posterWrapper, {
                autoAlpha: 0,
                duration: 0.55,
                ease: "none",
                y: () => Math.min(window.innerHeight * 0.36, 320),
              });
          } else {
            timeline
              .addLabel("hold", 0)
              .to(
                posterStage,
                {
                  duration: 1.1,
                  ease: "none",
                  x: 0,
                },
                "hold",
              )
              .addLabel("movePoster", 1.1)
              .to(
                copy,
                {
                  autoAlpha: 0,
                  duration: 0.9,
                  ease: "power2.inOut",
                  y: isMobile ? -20 : -48,
                },
                "movePoster",
              )
              .to(
                posterStage,
                {
                  duration: 0.9,
                  ease: "power2.inOut",
                  rotation: isMobile ? 0.8 : 1.4,
                  scale: () => metrics.stageScale,
                  x: () => metrics.stageTravelX,
                  y: () => metrics.stageDrop,
                },
                "movePoster",
              )
              .addLabel("roulette", 2)
              .addLabel("leftTape", rouletteExitStart)
              .to(
                posterStage,
                {
                  duration: 0.2,
                  ease: "none",
                  rotation: isMobile ? 0.8 : 1.4,
                  scale: () => metrics.stageScale,
                  x: () => metrics.stageTravelX,
                  y: () => metrics.stageDrop,
                },
                "leftTape-=0.2",
              )
              .to(
                leftTape,
                {
                  autoAlpha: 0,
                  duration: 1.15,
                  ease: "power2.inOut",
                  rotation: isMobile ? -22 : -30,
                  scale: 0.68,
                  x: isMobile ? -8 : -14,
                  y: isMobile ? -12 : -20,
                },
                "leftTape",
              )
              .addLabel("hang", rouletteExitStart + 1.15)
              .set(
                posterHinge,
                {
                  transformOrigin: "100% 0%",
                },
                "hang",
              )
              .to(
                posterHinge,
                {
                  duration: 1.9,
                  ease: "power2.out",
                  rotation: () => metrics.hangRotation,
                  x: () => metrics.hangX,
                  y: () => metrics.hangY,
                },
                "hang",
              )
              .to(
                rightTape,
                {
                  duration: 1.9,
                  ease: "power2.out",
                  rotation: () => metrics.rightTapeHangRotation,
                  x: () => metrics.rightTapeHangX,
                  y: () => metrics.rightTapeHangY,
                },
                "hang",
              )
              .addLabel("wiggle", rouletteExitStart + 3.05)
              .to(
                posterHinge,
                {
                  duration: 0.55,
                  ease: "sine.inOut",
                  rotation: isMobile ? -12 : -15,
                },
                "wiggle",
              )
              .to(posterHinge, {
                duration: 0.45,
                ease: "sine.inOut",
                rotation: isMobile ? -16 : -20,
              })
              .to(posterHinge, {
                duration: 0.45,
                ease: "sine.inOut",
                rotation: isMobile ? -13 : -16,
              })
              .to(posterHinge, {
                duration: 0.35,
                ease: "sine.inOut",
                rotation: () => metrics.releaseRotation,
              })
              .addLabel("rightTape", rouletteExitStart + 4.5)
              .to(
                rightTape,
                {
                  autoAlpha: 0,
                  duration: 1,
                  ease: "power2.inOut",
                  rotation: isMobile ? 20 : 30,
                  scale: 0.66,
                  x: isMobile ? 30 : 48,
                  y: isMobile ? -18 : -28,
                },
                "rightTape",
              )
              .to(
                posterHinge,
                {
                  duration: 1,
                  ease: "sine.inOut",
                  rotation: () => metrics.releaseRotation,
                  y: () => metrics.hangY + (isMobile ? 6 : 10),
                },
                "rightTape",
              )
              .addLabel("fall", rouletteExitStart + 5.5)
              .set(
                posterWrapper,
                {
                  transformOrigin: "50% 50%",
                },
                "fall",
              )
              .to(
                posterWrapper,
                {
                  duration: 2,
                  ease: "power3.in",
                  rotation: () => metrics.fallRotation,
                  x: () => metrics.fallX,
                  y: () => metrics.fallDistance,
                },
                "fall",
              )
              .to(
                posterHinge,
                {
                  duration: 2,
                  ease: "power2.in",
                  rotation: () => metrics.releaseRotation - (isMobile ? 8 : 14),
                },
                "fall",
              )
              .to(
                posterWrapper,
                {
                  autoAlpha: 0,
                  duration: 0.25,
                  ease: "none",
                },
                "fall+=1.72",
              );

            if (useRoulette) {
              timeline
                .to(
                  roulette,
                  {
                    autoAlpha: 1,
                    duration: 1.1,
                    ease: "power2.out",
                    scale: 1,
                    y: 0,
                  },
                  "movePoster+=0.65",
                )
                .to(
                  state,
                  {
                    duration: 0.35,
                    ease: "none",
                    frame: 0,
                    onUpdate: renderWheel,
                  },
                  "roulette",
                )
                .to(
                  state,
                  {
                    duration: 0.9,
                    ease: "none",
                    frame: maxFrame,
                    onUpdate: renderWheel,
                  },
                  "leftTape-=0.4",
                );

              for (let frame = 0; frame <= maxFrame; frame += 1) {
                const holdOffset =
                  rouletteStartOffset +
                  frame *
                    (rouletteHoldDuration + rouletteTransitionDuration);

                timeline.to(
                  state,
                  {
                    duration: rouletteHoldDuration,
                    ease: "none",
                    frame,
                    onUpdate: renderWheel,
                  },
                  `roulette+=${holdOffset}`,
                );

                if (frame < maxFrame) {
                  timeline.to(
                    state,
                    {
                      duration: rouletteTransitionDuration,
                      ease: "none",
                      frame: frame + 1,
                      onUpdate: renderWheel,
                    },
                    `roulette+=${holdOffset + rouletteHoldDuration}`,
                  );
                }
              }
            }
          }

          const refresh = () => ScrollTrigger.refresh();
          const loadingImages = gsap.utils
            .toArray<HTMLImageElement>("img", root)
            .filter((image) => !image.complete);

          loadingImages.forEach((image) => {
            image.addEventListener("load", refresh, { once: true });
          });

          requestAnimationFrame(refresh);

          return () => {
            loadingImages.forEach((image) => {
              image.removeEventListener("load", refresh);
            });
            root.classList.remove("is-pinned-ready", "is-wanted-exit-ready");
            cards.forEach((card) => {
              card.classList.remove("is-active");
              card.removeAttribute("aria-hidden");
            });
          };
        },
      );

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div className="about-scrollytelling" ref={scope}>
      <div className="about-pinned-stage">
        <div className="about-grid about-story-grid">
          <div className="wanted-poster-stage" ref={posterStageRef}>
            <span
              className="wanted-poster-tape wanted-poster-tape-left"
              ref={leftTapeRef}
              aria-hidden="true"
            />
            <span
              className="wanted-poster-tape wanted-poster-tape-right"
              ref={rightTapeRef}
              aria-hidden="true"
            />
            <div className="wanted-poster-fall-plane" ref={posterWrapperRef}>
              <div className="wanted-poster-hinge-plane" ref={posterHingeRef}>
                {posterNode}
              </div>
            </div>
          </div>
          {contentChildren}
        </div>
        <div className="about-roulette" aria-label="Selected project roulette">
          <div className="about-roulette-heading">
            <strong>Projects</strong>
          </div>
          <div className="about-roulette-orbit">
            {projects.map((project, index) => (
              <article className="about-roulette-card" key={project.title}>
                <div className="roulette-card-screen" aria-hidden="true">
                  <div className="roulette-screen-fan">
                    {["overview", "flow", "mobile"].map((shot) => (
                      <div
                        className={`roulette-app-shot roulette-app-shot-${shot} project-map-${project.image.theme}`}
                        key={`${project.title}-${shot}`}
                      >
                        <div className="roulette-screen-toolbar">
                          <span />
                          <span />
                          <span />
                        </div>
                        <span className="project-map-label">
                          {shot === "overview"
                            ? project.image.label
                            : shot === "flow"
                              ? project.category
                              : "App view"}
                        </span>
                        <div className="roulette-app-layout">
                          <span className="roulette-app-sidebar" />
                          <span className="roulette-app-panel roulette-app-panel-wide" />
                          <span className="roulette-app-panel" />
                          <span className="roulette-app-panel" />
                          <span className="roulette-app-chart" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="roulette-card-copy">
                  <div className="project-meta">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{project.category}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <ul className="stack-list">
                    {project.stack.slice(0, 5).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div
                    className="roulette-link-list"
                    aria-label={`${project.title} repository links`}
                  >
                    {project.links.map((link) => {
                      const LinkIcon =
                        link.icon === "github" ? Github : ExternalLink;
                      const isInternal = link.href.startsWith("#");

                      return (
                        <a
                          className="roulette-repo-link gsap-hover-link"
                          href={link.href}
                          key={`${project.title}-${link.label}`}
                          target={isInternal ? undefined : "_blank"}
                          rel={isInternal ? undefined : "noreferrer"}
                        >
                          <LinkIcon size={14} aria-hidden="true" />
                          <span>{link.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function GsapHeroConstellation() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;

      if (!root) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const paths = gsap.utils.toArray<SVGPathElement>(
        ".gsap-constellation-path",
        root,
      );
      const mapNodes = gsap.utils.toArray<SVGCircleElement>(
        ".gsap-map-node",
        root,
      );
      const currentDots = gsap.utils.toArray<HTMLElement>(
        ".gsap-current-dot",
        root,
      );
      const compass = root.querySelector<HTMLElement>(".gsap-hero-compass");
      const animatedTargets = [...mapNodes, ...currentDots, compass].filter(
        Boolean,
      );

      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: reduceMotion ? 0 : length,
        });
      });

      if (reduceMotion) {
        gsap.set(animatedTargets, {
          autoAlpha: 0.78,
          scale: 1,
        });
        return;
      }

      const mapTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
      mapTimeline
        .to(paths, {
          strokeDashoffset: 0,
          duration: 3.2,
          ease: "power2.inOut",
          stagger: 0.22,
        })
        .to(
          paths,
          {
            strokeDashoffset: (_, target: SVGPathElement) =>
              -target.getTotalLength(),
            duration: 3.2,
            ease: "power2.inOut",
            stagger: 0.18,
          },
          "+=0.3",
        );

      const nodeTween = gsap.to(mapNodes, {
        autoAlpha: 0.95,
        duration: 1.8,
        ease: "sine.inOut",
        repeat: -1,
        scale: 1.28,
        stagger: { amount: 1.1, from: "random" },
        yoyo: true,
      });

      const dotTween = gsap.to(currentDots, {
        duration: 5.8,
        ease: "sine.inOut",
        repeat: -1,
        stagger: 0.6,
        x: (index) => (index % 2 === 0 ? 24 : -18),
        y: (index) => (index % 2 === 0 ? -18 : 22),
        yoyo: true,
      });

      const compassTween = compass
        ? gsap.to(compass, {
            duration: 18,
            ease: "none",
            repeat: -1,
            rotation: 360,
            transformOrigin: "50% 50%",
          })
        : null;
      const animations = [
        mapTimeline,
        nodeTween,
        dotTween,
        compassTween,
      ].filter(Boolean);
      const setActive = (active: boolean) => {
        animations.forEach((animation) => {
          if (active) {
            animation?.resume();
          } else {
            animation?.pause();
          }
        });
      };
      const heroSection = root.closest<HTMLElement>(".hero-section") ?? root;
      const visibilityTrigger = ScrollTrigger.create({
        end: "bottom top",
        onEnter: () => setActive(true),
        onEnterBack: () => setActive(true),
        onLeave: () => setActive(false),
        onLeaveBack: () => setActive(false),
        start: "top bottom",
        trigger: heroSection,
      });

      setActive(isElementVisible(heroSection));

      return () => {
        visibilityTrigger.kill();
      };
    },
    { scope },
  );

  return (
    <div className="gsap-hero-constellation" ref={scope} aria-hidden="true">
      <svg viewBox="0 0 760 420" className="gsap-constellation-svg">
        <path
          className="gsap-constellation-path"
          d="M78 276 C164 138 296 104 396 184 C486 256 576 206 696 94"
        />
        <path
          className="gsap-constellation-path"
          d="M122 326 C222 258 306 294 390 238 C478 180 542 122 636 144"
        />
        <circle className="gsap-map-node" cx="78" cy="276" r="7" />
        <circle className="gsap-map-node" cx="396" cy="184" r="8" />
        <circle className="gsap-map-node" cx="696" cy="94" r="7" />
        <circle className="gsap-map-node" cx="390" cy="238" r="6" />
      </svg>
      <span className="gsap-current-dot gsap-current-dot-one">
        <TechIcon
          Icon={SiTypescript}
          label="TypeScript"
          className="tech-icon-typescript"
        />
      </span>
      <span className="gsap-current-dot gsap-current-dot-two">
        <TechIcon
          Icon={SiExpress}
          label="Node.js"
          className="tech-icon-express"
        />
      </span>
      <span className="gsap-hero-compass">
        <TechIcon Icon={SiSupabase} label="" className="tech-icon-supabase" />
      </span>
    </div>
  );
}

export function GsapBountyCounter({
  decimals = 0,
  label,
  suffix,
  useGrouping = true,
  value,
}: BountyCounterProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const target = valueRef.current;

      if (!target) {
        return;
      }

      const setValue = (nextValue: number) => {
        target.textContent = formatCounter(
          nextValue,
          decimals,
          suffix,
          useGrouping,
        );
      };

      if (reduceMotion) {
        setValue(value);
        return;
      }

      const counter = { value: 0 };
      gsap.to(counter, {
        value,
        duration: 1.45,
        ease: "power3.out",
        onUpdate: () => setValue(counter.value),
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 82%",
          once: true,
        },
      });
    },
    { scope: cardRef },
  );

  return (
    <div className="bounty-card gsap-bounty-card" ref={cardRef}>
      <strong ref={valueRef}>
        {formatCounter(value, decimals, suffix, useGrouping)}
      </strong>
      <span>{label}</span>
    </div>
  );
}

export function GsapJourneyRoute() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const path = root?.querySelector<SVGPathElement>(
        ".gsap-journey-route-path",
      );
      const islands = gsap.utils.toArray<SVGCircleElement>(
        ".gsap-route-island",
        root,
      );
      const ship = root?.querySelector<SVGGElement>(".gsap-route-ship");
      const shipBody = root?.querySelector<SVGGElement>(
        ".gsap-route-ship-body",
      );

      if (!root || !path || !ship || !shipBody) {
        return;
      }

      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: reduceMotion ? 0 : length,
      });

      if (reduceMotion) {
        gsap.set([...islands, ship], {
          autoAlpha: 1,
          scale: 1,
          x: 0,
          y: 0,
          rotation: 0,
        });
        return;
      }

      const idleTween = gsap.to(shipBody, {
        duration: 2.8,
        ease: "sine.inOut",
        paused: true,
        repeat: -1,
        rotation: 1.4,
        transformOrigin: "50% 50%",
        y: -8,
        yoyo: true,
      });

      const routeTimeline = gsap.timeline({ paused: true });

      routeTimeline
        .to(path, {
          duration: 1.35,
          ease: "power2.inOut",
          strokeDashoffset: 0,
        })
        .fromTo(
          islands,
          { autoAlpha: 0, scale: 0.35 },
          {
            autoAlpha: 1,
            duration: 0.58,
            ease: "back.out(1.7)",
            scale: 1,
            stagger: 0.16,
            transformOrigin: "50% 50%",
          },
          0.18,
        )
        .fromTo(
          ship,
          { autoAlpha: 0, x: -80, y: 32, rotation: -8 },
          {
            autoAlpha: 1,
            duration: 0.76,
            ease: "power2.out",
            rotation: 0,
            x: 0,
            y: 0,
          },
          0.38,
        );

      const routeTrigger = ScrollTrigger.create({
        end: "bottom 16%",
        onEnter: () => {
          idleTween.play();
          routeTimeline.restart();
        },
        onEnterBack: () => {
          idleTween.play();
          routeTimeline.restart();
        },
        onLeave: () => {
          idleTween.pause();
          routeTimeline.progress(1).pause();
        },
        onLeaveBack: () => {
          idleTween.pause();
          routeTimeline.reverse();
        },
        refreshPriority: 20,
        start: "top 76%",
        trigger: root,
      });

      if (isElementVisible(root)) {
        idleTween.play();
      }

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        routeTrigger.kill();
        idleTween.kill();
        routeTimeline.kill();
      };
    },
    { scope },
  );

  return (
    <div className="gsap-journey-route" ref={scope} aria-hidden="true">
      <svg viewBox="0 0 960 220">
        <path
          className="gsap-journey-route-path"
          d="M72 148 C192 42 304 190 426 94 C548 -2 638 170 774 78 C842 32 882 56 918 92"
        />
        <circle className="gsap-route-island" cx="72" cy="148" r="16" />
        <circle className="gsap-route-island" cx="426" cy="94" r="18" />
        <circle className="gsap-route-island" cx="774" cy="78" r="15" />
        <g className="gsap-route-ship" transform="translate(852 70)">
          <g className="gsap-route-ship-body">
            <path d="M0 32 L96 32 L78 54 L20 54 Z" />
            <path d="M42 0 L42 32 L8 32 Z" />
            <path d="M48 8 L48 32 L84 32 Z" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export function GsapRouteLogbook() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const path = root?.querySelector<SVGPathElement>(".gsap-logbook-path");
      const islands = gsap.utils.toArray<SVGCircleElement>(
        ".gsap-logbook-island",
        root,
      );
      const ship = root?.querySelector<SVGGElement>(".gsap-logbook-ship");
      const shipBody = root?.querySelector<SVGGElement>(
        ".gsap-logbook-ship-body",
      );
      const cards = gsap.utils.toArray<HTMLElement>(".route-log-card", root);

      if (!root || !path || !ship || !shipBody) {
        return;
      }

      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: reduceMotion ? 0 : length,
      });

      if (reduceMotion) {
        gsap.set([...islands, ship, ...cards], {
          autoAlpha: 1,
          rotation: 0,
          scale: 1,
          x: 0,
          y: 0,
        });
        return;
      }

      const idleTween = gsap.to(shipBody, {
        duration: 2.7,
        ease: "sine.inOut",
        paused: true,
        repeat: -1,
        rotation: 1.2,
        transformOrigin: "50% 50%",
        y: -7,
        yoyo: true,
      });

      const routeTimeline = gsap.timeline({ paused: true });

      routeTimeline
        .to(path, {
          duration: 1.45,
          ease: "power2.inOut",
          strokeDashoffset: 0,
        })
        .fromTo(
          islands,
          { autoAlpha: 0, scale: 0.35 },
          {
            autoAlpha: 1,
            duration: 0.58,
            ease: "back.out(1.5)",
            scale: 1,
            stagger: 0.12,
            transformOrigin: "50% 50%",
          },
          0.18,
        )
        .fromTo(
          cards,
          {
            autoAlpha: 0,
            rotation: (index) => (index % 2 === 0 ? -1.4 : 1.4),
            y: 34,
          },
          {
            autoAlpha: 1,
            duration: 0.62,
            ease: "power2.out",
            rotation: 0,
            stagger: 0.1,
            y: 0,
          },
          0.28,
        )
        .fromTo(
          ship,
          { autoAlpha: 0, rotation: -10, x: -70, y: 20 },
          {
            autoAlpha: 1,
            duration: 0.76,
            ease: "power2.out",
            rotation: 0,
            x: 0,
            y: 0,
          },
          0.42,
        );

      const routeTrigger = ScrollTrigger.create({
        end: "bottom 14%",
        onEnter: () => {
          idleTween.play();
          routeTimeline.restart();
        },
        onEnterBack: () => {
          idleTween.play();
          routeTimeline.restart();
        },
        onLeave: () => {
          idleTween.pause();
          routeTimeline.progress(1).pause();
        },
        onLeaveBack: () => {
          idleTween.pause();
          routeTimeline.reverse();
        },
        refreshPriority: 10,
        start: "top 74%",
        trigger: root,
      });

      if (isElementVisible(root)) {
        idleTween.play();
      }

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        routeTrigger.kill();
        idleTween.kill();
        routeTimeline.kill();
      };
    },
    { scope },
  );

  return (
    <div className="gsap-route-logbook" ref={scope}>
      <div className="route-log-map" aria-hidden="true">
        <svg viewBox="0 0 1020 260">
          <path
            className="gsap-logbook-path"
            d="M70 188 C176 64 274 76 354 146 C446 226 550 220 632 126 C720 24 826 50 948 106"
          />
          <circle className="gsap-logbook-island" cx="70" cy="188" r="18" />
          <circle className="gsap-logbook-island" cx="354" cy="146" r="20" />
          <circle className="gsap-logbook-island" cx="632" cy="126" r="18" />
          <circle
            className="gsap-logbook-island route-log-current"
            cx="948"
            cy="106"
            r="20"
          />
          <g className="gsap-logbook-ship" transform="translate(868 86)">
            <g className="gsap-logbook-ship-body">
              <path d="M0 30 L86 30 L70 50 L16 50 Z" />
              <path d="M38 0 L38 30 L8 30 Z" />
              <path d="M44 7 L44 30 L78 30 Z" />
            </g>
          </g>
        </svg>
      </div>

      <div className="route-log-grid">
        {routeLogItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <article
              className="route-log-card gsap-hover-card"
              data-gsap-tilt={index % 2 === 0 ? "-0.45" : "0.45"}
              key={item.title}
            >
              <div className="route-log-index">
                <Icon size={22} />
                <span>{item.label}</span>
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <ul aria-label={`${item.title} technologies`}>
                {item.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
