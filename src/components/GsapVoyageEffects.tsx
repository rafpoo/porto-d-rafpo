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
  ExternalLink,
  Github,
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
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";
import { LOG_POSE_ANGLES } from "./LogPoseDial";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);
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
    displayType?: "landscape" | "portrait";
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

      const hoverIcons = "svg, .brand-emblem, .cv-summary-icon";

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
              const distance = Math.abs(index - state.frame);
              const depthProgress = (depth + 1) / 2;
              const sideVisibility = gsap.utils.clamp(
                0,
                1,
                1 - (distance - 0.56) / 0.34,
              );
              const opacity =
                index === activeIndex
                  ? 1
                  : gsap.utils.clamp(
                      0,
                      0.74,
                      (0.18 + depthProgress * 0.56) * sideVisibility,
                    );
              const scale = gsap.utils.clamp(
                0.68,
                1,
                0.76 + depthProgress * 0.24,
              );

              gsap.set(card, {
                autoAlpha: opacity,
                pointerEvents: index === activeIndex ? "auto" : "none",
                rotationY: -normalizedAngle,
                rotationZ: side * -2.6,
                scale,
                transformOrigin: "50% 50%",
                x: side * metrics.radiusX,
                xPercent: -50,
                y: Math.abs(side) * 14,
                yPercent: -50,
                z: (depth - 1) * metrics.radiusZ,
                zIndex:
                  index === activeIndex
                    ? 30
                    : opacity > 0.01
                      ? Math.round(10 + depthProgress * 8)
                      : 0,
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
              id: "about-wanted-poster-story",
              invalidateOnRefresh: true,
              onRefresh: () => {
                updateMetrics();
                previousRenderedFrame = Number.NaN;
                renderWheel();
              },
              pin: true,
              refreshPriority: 100,
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
            {projects.map((project, index) => {
              const displayType = project.image.displayType ?? "portrait";
              const display = displayType === "landscape" ? "web" : "mobile";
              const shots =
                displayType === "landscape"
                  ? ["overview", "flow", "detail"]
                  : ["overview", "flow", "mobile"];

              return (
                <article
                  className="about-roulette-card"
                  data-display={display}
                  key={project.title}
                >
                  <div
                    className={`roulette-card-screen roulette-display-${display} ${
                      displayType === "landscape"
                        ? "desktop-mockup project-screenshot--landscape"
                        : ""
                    }`}
                    aria-hidden="true"
                  >
                    <div className="roulette-screen-fan">
                      {shots.map((shot) => (
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
                                : display === "web"
                                  ? "Web view"
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
              );
            })}
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

export type GrandLineJourneyHandle = {
  calculateScrollDistance: () => number;
  timeline: gsap.core.Timeline;
};

type GsapGrandLineJourneyProps = {
  children: ReactNode;
  controlled?: boolean;
  onTimelineReady?: (handle: GrandLineJourneyHandle | null) => void;
};

export function GsapGrandLineJourney({
  children,
  controlled = false,
  onTimelineReady,
}: GsapGrandLineJourneyProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;

      if (!root) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(
        {
          isLargeDesktop: "(min-width: 1440px) and (min-height: 850px)",
          isDesktop: "(min-width: 981px) and (max-width: 1439px), (min-width: 981px) and (max-height: 849px)",
          isTablet: "(min-width: 681px) and (max-width: 980px)",
          isMobile: "(max-width: 680px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const {
            isLargeDesktop,
            isDesktop,
            isTablet,
            isMobile,
            reduceMotion,
          } =
            context.conditions as {
              isLargeDesktop: boolean;
              isDesktop: boolean;
              isTablet: boolean;
              isMobile: boolean;
              reduceMotion: boolean;
            };
          const viewport = root.querySelector<HTMLElement>(
            ".journey-grand-line-viewport",
          );
          const mapStage =
            root.querySelector<HTMLElement>(".journey-map-stage");
          const mapCamera =
            root.querySelector<HTMLElement>(".journey-map-camera");
          const mapBoard = root.querySelector<HTMLElement>(".journey-map-board");
          const titleCard =
            root.querySelector<HTMLElement>(".journey-title-card");
          const logPose =
            root.querySelector<HTMLElement>(".journey-log-pose");
          const logPoseAsset = root.querySelector<HTMLElement>(
            ".journey-log-pose-asset",
          );
          const logPoseGlow = root.querySelector<HTMLElement>(
            ".journey-log-pose-glow",
          );
          const progressCount = root.querySelector<HTMLElement>(
            "[data-journey-progress-count]",
          );
          const progressFill = root.querySelector<HTMLElement>(
            "[data-journey-progress-fill]",
          );
          const needle = root.querySelector<HTMLElement>(
            ".journey-log-pose-needle",
          );
          const routeOutline = root.querySelector<SVGPathElement>(
            ".journey-route-outline",
          );
          const routeProgress = root.querySelector<SVGPathElement>(
            ".journey-route-progress",
          );
          const routeMotion = root.querySelector<SVGPathElement>(
            ".journey-route-motion-path",
          );
          const ship = root.querySelector<SVGGElement>(".journey-ship");
          const shipBody =
            root.querySelector<SVGGElement>(".journey-ship-body");
          const panels = gsap.utils.toArray<HTMLElement>(
            "[data-journey-panel]",
            root,
          );
          const islands = gsap.utils.toArray<HTMLElement>(
            "[data-journey-island]",
            root,
          );
          const clouds = gsap.utils.toArray<HTMLElement>(
            ".journey-cloud",
            root,
          );
          const decorativeLayers = gsap.utils.toArray<HTMLElement>(
            ".journey-map-depth, .journey-compass-rose, .journey-coordinate-grid",
            root,
          );

          root.classList.remove("is-reduced-motion");
          [...panels, ...islands].forEach((element) => {
            element.classList.remove("is-active", "is-past");
          });
          gsap.set(
            [
              viewport,
              mapStage,
              mapCamera,
              mapBoard,
              titleCard,
              logPose,
              logPoseAsset,
              logPoseGlow,
              progressFill,
              needle,
              routeOutline,
              routeProgress,
              ship,
              shipBody,
              ...panels,
              ...clouds,
              ...decorativeLayers,
            ].filter(Boolean),
            { clearProps: "all" },
          );
          gsap.set(islands, {
            clearProps: "transform,opacity,visibility",
          });

          if (
            !viewport ||
            !mapStage ||
            !mapCamera ||
            !mapBoard ||
            !titleCard ||
            !logPose ||
            !logPoseAsset ||
            !logPoseGlow ||
            !progressCount ||
            !progressFill ||
            !needle ||
            !routeOutline ||
            !routeProgress ||
            !routeMotion ||
            !ship ||
            !shipBody ||
            panels.length === 0 ||
            islands.length === 0
          ) {
            return;
          }

          if (reduceMotion) {
            onTimelineReady?.(null);
            root.classList.add("is-reduced-motion");
            panels.forEach((panel) => {
              panel.classList.add("is-active");
              panel.removeAttribute("aria-hidden");
            });
            islands.forEach((island) => {
              island.classList.add("is-active");
            });
            progressCount.textContent = `01 / ${String(panels.length).padStart(
              2,
              "0",
            )}`;
            gsap.set([routeOutline, routeProgress], { strokeDashoffset: 0 });
            gsap.set(progressFill, { scaleX: 1, transformOrigin: "0% 50%" });
            gsap.set(logPoseAsset, {
              scale: 1,
              transformOrigin: "50% 50%",
            });
            gsap.set(logPoseGlow, { opacity: 0.32 });
            gsap.set(needle, {
              rotation: 58,
              svgOrigin: "100 100",
            });
            return;
          }

          const routeLength = routeProgress.getTotalLength();
          const outlineLength = routeOutline.getTotalLength();
          const totalMilestones = panels.length;
          const travelPhaseCount = Math.max(totalMilestones - 1, 0);
          const cardRevealPhaseCount = totalMilestones;
          const fixedPhaseCount = 3;
          const totalScrollPhases =
            fixedPhaseCount + travelPhaseCount + cardRevealPhaseCount;
          let master: gsap.core.Timeline | undefined;
          const scrollConfig = isMobile
            ? {
                baseVh: 0.7,
                cardVh: 0.78,
                phaseVh: 0.58,
                maxVh: 4.75,
                minVh: 3.75,
                scrub: 0.92,
                startOffsetVh: 0.045,
                startOffsetMax: 36,
              }
            : isTablet
              ? {
                  baseVh: 0.82,
                  cardVh: 0.84,
                  phaseVh: 0.66,
                  maxVh: 5.4,
                  minVh: 4.25,
                  scrub: 1.04,
                  startOffsetVh: 0.04,
                  startOffsetMax: 42,
                }
              : isLargeDesktop
                ? {
                    baseVh: 1.0,
                    cardVh: 0.94,
                    phaseVh: 0.82,
                    maxVh: 6.65,
                    minVh: 5.45,
                    scrub: 1.28,
                    startOffsetVh: 0.025,
                    startOffsetMax: 28,
                  }
                : {
                    baseVh: 0.9,
                    cardVh: 0.86,
                    phaseVh: 0.72,
                    maxVh: 5.85,
                    minVh: 4.8,
                    scrub: 1.16,
                    startOffsetVh: 0.055,
                    startOffsetMax: 56,
                  };
          const calculateScrollDistance = () => {
            const viewportHeight = window.innerHeight;
            const rawDistance =
              viewportHeight *
              (scrollConfig.baseVh +
                cardRevealPhaseCount * scrollConfig.cardVh +
                (travelPhaseCount + fixedPhaseCount) * scrollConfig.phaseVh);
            const durationBasedDistance =
              (master?.duration() ?? totalScrollPhases) *
              viewportHeight *
              (isLargeDesktop ? 0.41 : isMobile ? 0.36 : 0.38);
            const minDistance = viewportHeight * scrollConfig.minVh;
            const maxDistance = viewportHeight * scrollConfig.maxVh;

            return Math.round(
              gsap.utils.clamp(
                minDistance,
                maxDistance,
                Math.max(rawDistance, durationBasedDistance),
              ),
            );
          };
          const routeViewBox = routeMotion.ownerSVGElement?.viewBox.baseVal;
          const routeViewBoxWidth = routeViewBox?.width || 1000;
          const routeViewBoxHeight = routeViewBox?.height || 560;
          const routeStart = 0;
          const toViewBoxCoordinate = (value: string, total: number) => {
            const trimmedValue = value.trim();
            const numericValue = Number.parseFloat(trimmedValue);

            if (Number.isNaN(numericValue)) {
              return 0;
            }

            return trimmedValue.endsWith("%")
              ? (numericValue / 100) * total
              : numericValue;
          };
          const findClosestRouteProgress = (island: HTMLElement) => {
            const islandStyles = getComputedStyle(island);
            const targetX = toViewBoxCoordinate(
              islandStyles.getPropertyValue("--journey-x"),
              routeViewBoxWidth,
            );
            const targetY = toViewBoxCoordinate(
              islandStyles.getPropertyValue("--journey-y"),
              routeViewBoxHeight,
            );
            let closestProgress = 0;
            let closestDistance = Number.POSITIVE_INFINITY;

            for (let step = 0; step <= 220; step += 1) {
              const progress = step / 220;
              const point = routeMotion.getPointAtLength(
                routeLength * progress,
              );
              const distance = Math.hypot(point.x - targetX, point.y - targetY);

              if (distance < closestDistance) {
                closestDistance = distance;
                closestProgress = progress;
              }
            }

            return closestProgress;
          };
          let previousComputedStop = routeStart;
          const routeStops = islands.slice(0, totalMilestones).map(
            (island, index) => {
              const isFinalStop = index === totalMilestones - 1;
              const minimumStop = index === 0 ? 0.04 : previousComputedStop + 0.04;
              const maximumStop = isFinalStop ? 1 : 0.96;
              const computedStop = isFinalStop
                ? 1
                : findClosestRouteProgress(island);
              const clampedStop = gsap.utils.clamp(
                minimumStop,
                maximumStop,
                computedStop,
              );

              previousComputedStop = clampedStop;
              return clampedStop;
            },
          );
          const cameraScale = isMobile ? 1.01 : isDesktop ? 1 : 0.99;
          const cameraPositions = [
            {
              rotationX: isMobile ? 5 : 8,
              rotationY: 0,
              rotationZ: -0.8,
              scale: cameraScale,
              xPercent: isMobile ? 1.8 : 1.2,
              yPercent: isMobile ? 1 : 0.5,
            },
            {
              rotationX: isMobile ? 5 : 8,
              rotationY: 0,
              rotationZ: 0.6,
              scale: isMobile ? 1.02 : 1.01,
              xPercent: isMobile ? 0.8 : 0.4,
              yPercent: isMobile ? 0 : -0.5,
            },
            {
              rotationX: isMobile ? 5 : 8,
              rotationY: 0,
              rotationZ: -0.5,
              scale: isMobile ? 1.02 : 1.01,
              xPercent: isMobile ? -0.8 : -0.4,
              yPercent: isMobile ? 0.5 : 0,
            },
            {
              rotationX: isMobile ? 5 : 8,
              rotationY: 0,
              rotationZ: 0.7,
              scale: cameraScale,
              xPercent: isMobile ? -1.8 : -1.2,
              yPercent: isMobile ? 1 : 0.5,
            },
          ];
          const panelPositions = [
            { xPercent: 0, yPercent: 0 },
            { xPercent: 0, yPercent: 0 },
            { xPercent: 0, yPercent: 0 },
            { xPercent: 0, yPercent: 0 },
          ];
          const motionPath = (start: number, end: number) => ({
            align: routeMotion,
            alignOrigin: [0.5, 0.62],
            autoRotate: true,
            end,
            path: routeMotion,
            start,
          });
          const logPoseStates = [
            {
              accentColor: "rgba(184, 136, 45, 0.58)",
              glow: 0.3,
              pulse: 1,
              rotation: LOG_POSE_ANGLES[0],
            },
            {
              accentColor: "rgba(143, 36, 28, 0.56)",
              glow: 0.46,
              pulse: 1.025,
              rotation: LOG_POSE_ANGLES[1],
            },
            {
              accentColor: "rgba(15, 118, 110, 0.58)",
              glow: 0.62,
              pulse: 1.04,
              rotation: LOG_POSE_ANGLES[2],
            },
            {
              accentColor: "rgba(23, 52, 74, 0.58)",
              glow: 0.78,
              pulse: 1.055,
              rotation: LOG_POSE_ANGLES[3],
            },
          ];
          const logPoseEase = gsap.parseEase("sine.inOut");
          const getShortestRotation = (from: number, to: number) => {
            const delta = gsap.utils.wrap(-180, 180, to - from);

            return from + delta;
          };
          const getLogPoseState = (progress: number) => {
            const clampedProgress = gsap.utils.clamp(0, 1, progress);
            const stateProgress =
              clampedProgress * Math.max(logPoseStates.length - 1, 1);
            const startIndex = Math.min(
              Math.floor(stateProgress),
              logPoseStates.length - 1,
            );
            const endIndex = Math.min(startIndex + 1, logPoseStates.length - 1);
            const easedProgress = logPoseEase(stateProgress - startIndex);
            const startState = logPoseStates[startIndex];
            const endState = logPoseStates[endIndex];
            const endRotation = getShortestRotation(
              startState.rotation,
              endState.rotation,
            );

            return {
              glow: gsap.utils.interpolate(
                startState.glow,
                endState.glow,
                easedProgress,
              ),
              pulse: gsap.utils.interpolate(
                startState.pulse,
                endState.pulse,
                easedProgress,
              ),
              rotation: gsap.utils.interpolate(
                startState.rotation,
                endRotation,
                easedProgress,
              ),
            };
          };

          let activeIndex = -1;
          const setActive = (
            nextIndex: number,
            syncPanelVisual = true,
            force = false,
          ) => {
            const clampedIndex = gsap.utils.clamp(
              0,
              totalMilestones - 1,
              nextIndex,
            );
            const activeChanged = clampedIndex !== activeIndex;

            if (!activeChanged && !force) {
              return;
            }

            activeIndex = clampedIndex;
            logPose.style.setProperty(
              "--journey-log-pose-accent",
              logPoseStates[clampedIndex]?.accentColor ??
                "rgba(184, 136, 45, 0.58)",
            );
            root.style.setProperty(
              "--journey-active-progress",
              String(clampedIndex / Math.max(totalMilestones - 1, 1)),
            );
            progressCount.textContent = `${String(clampedIndex + 1).padStart(
              2,
              "0",
            )} / ${String(totalMilestones).padStart(2, "0")}`;

            panels.forEach((panel, index) => {
              panel.classList.toggle("is-active", index === clampedIndex);
              panel.classList.toggle("is-past", index < clampedIndex);
              panel.setAttribute(
                "aria-hidden",
                index === clampedIndex ? "false" : "true",
              );
            });

            if (syncPanelVisual && activeChanged && master) {
              const sectionExitTime = master.labels["section-exit"];
              const isInsideStory =
                sectionExitTime === undefined ||
                master.time() < sectionExitTime - 0.02;

              if (isInsideStory) {
                panels.forEach((panel, index) => {
                  const isCurrent = index === clampedIndex;

                  if (isCurrent) {
                    gsap.set(panel, {
                      autoAlpha: 1,
                      rotationX: 0,
                      scale: 1,
                      xPercent: 0,
                      y: 0,
                      yPercent: 0,
                      z: 0,
                    });
                    gsap.set(panel.children, {
                      autoAlpha: 1,
                      y: 0,
                    });
                  }

                  if (!isCurrent) {
                    gsap.set(panel, {
                      autoAlpha: 0,
                      rotationX: isMobile ? 0 : -9,
                      scale: 0.92,
                      y: isMobile ? 28 : 36,
                      z: isMobile ? 0 : -120,
                    });
                    gsap.set(panel.children, {
                      autoAlpha: 0,
                      y: 14,
                    });
                  }
                });
              }
            }

            islands.forEach((island, index) => {
              island.classList.toggle("is-active", index === clampedIndex);
              island.classList.toggle("is-past", index < clampedIndex);
            });
          };

          const setProgressScale = gsap.quickSetter(progressFill, "scaleX");
          const setNeedleRotation = gsap.quickSetter(needle, "rotation", "deg");
          const setGlowOpacity = gsap.quickSetter(logPoseGlow, "opacity");
          const setLogPoseScale = gsap.quickSetter(logPoseAsset, "scale");
          const updateHudProgress = (progress: number) => {
            const clampedProgress = gsap.utils.clamp(0, 1, progress);
            const logPoseState = getLogPoseState(clampedProgress);

            setProgressScale(clampedProgress);
            setNeedleRotation(logPoseState.rotation);
            setGlowOpacity(logPoseState.glow);
            setLogPoseScale(logPoseState.pulse);
          };

          gsap.set(routeOutline, {
            strokeDasharray: outlineLength,
            strokeDashoffset: outlineLength,
          });
          gsap.set(routeProgress, {
            strokeDasharray: routeLength,
            strokeDashoffset: routeLength,
          });
          gsap.set(progressFill, {
            scaleX: 0,
            transformOrigin: "0% 50%",
          });
          gsap.set(logPoseAsset, {
            scale: 1,
            transformOrigin: "50% 50%",
          });
          gsap.set(logPoseGlow, {
            opacity: logPoseStates[0].glow,
          });
          gsap.set(needle, {
            rotation: logPoseStates[0].rotation,
            svgOrigin: "100 100",
          });
          gsap.set(ship, {
            autoAlpha: 0,
            motionPath: motionPath(routeStart, routeStart),
            scale: isMobile ? 0.76 : 0.82,
            transformOrigin: "50% 62%",
          });
          gsap.set(shipBody, {
            transformOrigin: "50% 50%",
          });
          gsap.set(mapCamera, {
            rotationX: isMobile ? 4 : 7,
            rotationY: 0,
            rotationZ: 0,
            scale: isMobile ? 0.98 : 0.97,
            transformOrigin: "50% 50%",
            xPercent: 0,
            yPercent: 0,
          });
          gsap.set(mapBoard, {
            transformOrigin: "50% 50%",
          });
          gsap.set(titleCard, {
            autoAlpha: 1,
            scale: 1,
            transformOrigin: "50% 0%",
            xPercent: -50,
            y: 0,
          });
          gsap.set(logPose, {
            autoAlpha: 0,
            x: isMobile ? 0 : 24,
          });
          gsap.set(panels, {
            autoAlpha: 0,
            rotationX: isMobile ? 0 : -9,
            scale: 0.92,
            transformOrigin: "50% 58%",
            y: isMobile ? 28 : 36,
            z: isMobile ? 0 : -120,
          });
          panels.forEach((panel) => {
            gsap.set(panel.children, {
              autoAlpha: 0,
              y: 14,
            });
          });
          gsap.set(islands, {
            autoAlpha: 0.64,
            scale: 0.86,
            transformOrigin: "50% 50%",
            xPercent: -50,
            yPercent: -50,
            z: isMobile ? 0 : 42,
          });
          gsap.set(clouds, {
            autoAlpha: isMobile ? 0.3 : 0.62,
          });
          setActive(0, false, true);

          const holdTimes: number[] = [];
          const updateActiveFromTime = () => {
            if (!master) {
              return;
            }

            const currentTime = master.time();
            const nextIndex = holdTimes.reduce(
              (closest, holdTime, index) =>
                currentTime >= holdTime - 0.28 ? index : closest,
              0,
            );
            setActive(nextIndex);
          };
          const syncScrollState = () => {
            if (!master) {
              return;
            }

            updateHudProgress(master.progress());
            updateActiveFromTime();
          };

          master = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            onUpdate: syncScrollState,
            paused: controlled,
            scrollTrigger: controlled
              ? undefined
              : {
                  end: () => `+=${calculateScrollDistance()}`,
                  id: "grand-line-journey",
                  invalidateOnRefresh: true,
                  onEnter: syncScrollState,
                  onEnterBack: syncScrollState,
                  onLeave: () => {
                    updateHudProgress(1);
                    setActive(totalMilestones - 1, false, true);
                  },
                  onLeaveBack: () => {
                    master?.progress(0);
                    updateHudProgress(0);
                    setActive(0, false, true);
                  },
                  onRefresh: syncScrollState,
                  pin: viewport,
                  refreshPriority: 0,
                  scrub: scrollConfig.scrub,
                  start: () => {
                    const currentScroll =
                      window.scrollY ||
                      document.documentElement.scrollTop ||
                      document.body.scrollTop ||
                      0;
                    const skillsSection = document.getElementById("skills");
                    const skillsEnd = skillsSection
                      ? skillsSection.getBoundingClientRect().bottom +
                        currentScroll
                      : Number.NEGATIVE_INFINITY;
                    const journeyTop =
                      root.getBoundingClientRect().top + currentScroll;
                    const earlyStartOffset = Math.min(
                      window.innerHeight * scrollConfig.startOffsetVh,
                      scrollConfig.startOffsetMax,
                    );

                    return Math.max(skillsEnd, journeyTop) - earlyStartOffset;
                  },
                  trigger: root,
                },
          });

          master
            .addLabel("intro", 0)
            .to(
              titleCard,
              {
                duration: 0.7,
                ease: "power2.out",
                scale: isMobile ? 0.98 : 0.95,
                y: isMobile ? -8 : -18,
              },
              "intro",
            )
            .to(
              logPose,
              {
                autoAlpha: 1,
                duration: 0.58,
                x: 0,
              },
              "intro",
            )
            .to(
              routeOutline,
              {
                duration: 1.12,
                ease: "power2.out",
                strokeDashoffset: 0,
              },
              "intro+=0.22",
            )
            .to(
              decorativeLayers,
              {
                duration: 1,
                ease: "power2.out",
                opacity: 1,
                stagger: 0.08,
                y: 0,
              },
              "intro+=0.28",
            )
            .to(
              islands,
              {
                autoAlpha: 0.72,
                duration: 0.72,
                scale: 0.9,
                stagger: 0.09,
              },
              "intro+=0.46",
            )
            .to(
              routeProgress,
              {
                duration: 0.96,
                ease: "none",
                strokeDashoffset: routeLength * (1 - (routeStops[0] ?? 0)),
              },
              "intro+=0.86",
            )
            .to(
              ship,
              {
                autoAlpha: 1,
                duration: 0.24,
                ease: "back.out(1.4)",
                scale: isMobile ? 0.82 : 0.9,
              },
              "intro+=0.78",
            )
            .to(
              ship,
              {
                duration: 0.96,
                ease: "none",
                motionPath: motionPath(routeStart, routeStops[0] ?? routeStart),
                scale: isMobile ? 0.82 : 0.9,
              },
              "intro+=0.86",
            )
            .to(
              mapCamera,
              {
                duration: 0.96,
                ...cameraPositions[0],
              },
              "intro+=0.86",
            );

          panels.forEach((panel, index) => {
            const previousPanel = panels[index - 1];
            const previousIsland = islands[index - 1];
            const currentIsland = islands[index];
            const panelParts = Array.from(panel.children);
            const previousRouteStop =
              index > 0 ? routeStops[index - 1] ?? routeStart : routeStart;
            const routeStop = routeStops[index] ?? 1;
            const cameraPosition =
              cameraPositions[index] ??
              cameraPositions[cameraPositions.length - 1];
            const panelPosition =
              panelPositions[index] ?? panelPositions[panelPositions.length - 1];

            if (index > 0) {
              master
                .addLabel(`travel-${index - 1}-${index}`)
                .to(
                  routeProgress,
                  {
                    duration: 1.08,
                    ease: "none",
                    strokeDashoffset: routeLength * (1 - routeStop),
                  },
                  `travel-${index - 1}-${index}`,
                )
                .to(
                  ship,
                  {
                    duration: 1.08,
                    ease: "none",
                    motionPath: motionPath(previousRouteStop, routeStop),
                    scale: isMobile ? 0.82 : 0.9,
                  },
                  `travel-${index - 1}-${index}`,
                )
                .to(
                  shipBody,
                  {
                    duration: 0.34,
                    ease: "sine.inOut",
                    rotation: index % 2 === 0 ? -4 : 4,
                    yoyo: true,
                    repeat: 1,
                  },
                  `travel-${index - 1}-${index}`,
                )
                .to(
                  mapCamera,
                  {
                    duration: 1.08,
                    ...cameraPosition,
                  },
                  `travel-${index - 1}-${index}`,
                )
                .to(
                  clouds,
                  {
                    duration: 1.08,
                    ease: "none",
                    xPercent: (_, target) =>
                      Number((target as HTMLElement).dataset.cloudDrift ?? 0) +
                      (index % 2 === 0 ? -6 : 6),
                  },
                  `travel-${index - 1}-${index}`,
                )
                .to(
                  previousPanel,
                  {
                    autoAlpha: 0,
                    duration: 0.34,
                    ease: "power2.in",
                    rotationX: isMobile ? 0 : 8,
                    scale: 0.92,
                    y: isMobile ? -20 : -30,
                    z: isMobile ? 0 : -130,
                  },
                  `travel-${index - 1}-${index}+=1.02`,
                )
                .to(
                  previousPanel?.children ?? [],
                  {
                    autoAlpha: 0,
                    duration: 0.18,
                    stagger: 0.025,
                    y: -10,
                  },
                  `travel-${index - 1}-${index}+=1.02`,
                )
                .to(
                  previousIsland,
                  {
                    autoAlpha: 0.76,
                    duration: 0.34,
                    scale: 0.92,
                    xPercent: -50,
                    yPercent: -50,
                    z: isMobile ? 0 : 36,
                  },
                  `travel-${index - 1}-${index}+=1.02`,
                );
            }

            master
              .addLabel(`milestone-${index}-enter`)
              .to(
                currentIsland,
                {
                  autoAlpha: 1,
                  duration: 0.52,
                  ease: "back.out(1.45)",
                  scale: isMobile ? 1 : 1.08,
                  xPercent: -50,
                  yPercent: -50,
                  z: isMobile ? 0 : 68,
                },
                `milestone-${index}-enter`,
              )
              .to(
                panel,
                {
                  autoAlpha: 1,
                  duration: 0.58,
                  ease: "power3.out",
                  rotationX: 0,
                  scale: 1,
                  xPercent: panelPosition.xPercent,
                  y: 0,
                  yPercent: panelPosition.yPercent,
                  z: 0,
                },
                `milestone-${index}-enter+=0.08`,
              )
              .to(
                panelParts,
                {
                  autoAlpha: 1,
                  duration: 0.4,
                  ease: "power2.out",
                  stagger: 0.055,
                  y: 0,
                },
                `milestone-${index}-enter+=0.18`,
              )
              .addLabel(`milestone-${index}-hold`);

            holdTimes[index] = master.duration();

            master.to({}, { duration: isMobile ? 0.95 : 1.22 });
          });

          const finalPanel = panels[panels.length - 1];
          const finalIsland = islands[islands.length - 1];
          const routeEnd = routeStops[routeStops.length - 1] ?? 1;

          master
            .addLabel("final-overview")
            .to(
              routeProgress,
              {
                duration: 0.82,
                ease: "none",
                strokeDashoffset: 0,
              },
              "final-overview",
            )
            .to(
              ship,
              {
                duration: 0.82,
                ease: "none",
                motionPath: motionPath(routeEnd, routeEnd),
                scale: isMobile ? 0.78 : 0.86,
              },
              "final-overview",
            )
            .to(
              mapCamera,
              {
                duration: 0.98,
                rotationX: isMobile ? 4 : 7,
                rotationY: 0,
                rotationZ: 0,
                scale: isMobile ? 0.98 : 0.96,
                xPercent: 0,
                yPercent: 0,
              },
              "final-overview",
            )
            .to(
              finalIsland,
              {
                duration: 0.52,
                scale: isMobile ? 1.02 : 1.08,
              },
              "final-overview+=0.18",
            )
            .to({}, { duration: isMobile ? 0.72 : 0.9 })
            .addLabel("section-exit")
            .to(
              finalPanel,
              {
                autoAlpha: 0,
                duration: 0.5,
                ease: "power2.inOut",
                scale: 0.94,
                y: isMobile ? 18 : 28,
                z: isMobile ? 0 : -120,
              },
              "section-exit",
            )
            .to(
              finalPanel.children,
              {
                autoAlpha: 0,
                duration: 0.24,
                stagger: 0.025,
                y: 10,
              },
              "section-exit",
            )
            .to(
              [titleCard, logPose],
              {
                autoAlpha: 0.72,
                duration: 0.48,
                y: -8,
              },
              "section-exit+=0.04",
            )
            .to(
              mapCamera,
              {
                duration: 0.66,
                scale: isMobile ? 0.94 : 0.92,
                xPercent: 0,
                yPercent: 0,
              },
              "section-exit+=0.02",
            );

          updateHudProgress(0);

          if (controlled) {
            master.pause(0);
            onTimelineReady?.({ calculateScrollDistance, timeline: master });
          } else {
            requestAnimationFrame(() => ScrollTrigger.refresh());
            void document.fonts?.ready.then(() => ScrollTrigger.refresh());
          }

          return () => {
            if (controlled) {
              onTimelineReady?.(null);
            }
          };
        },
      );

      return () => {
        mm.revert();
      };
    },
    { dependencies: [controlled, onTimelineReady], revertOnUpdate: true, scope },
  );

  return (
    <div className="journey-grand-line-story" ref={scope}>
      {children}
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
