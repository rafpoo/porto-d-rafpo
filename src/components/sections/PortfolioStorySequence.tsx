import { useCallback, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { GrandLineJourneyHandle } from "../GsapVoyageEffects";
import { Journey } from "./Journey";
import { SkillsContent } from "./Skills";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function PortfolioStorySequence() {
  const scope = useRef<HTMLElement>(null);
  const [journeyHandle, setJourneyHandle] =
    useState<GrandLineJourneyHandle | null>(null);

  const handleJourneyTimeline = useCallback(
    (handle: GrandLineJourneyHandle | null) => {
      setJourneyHandle(handle);
    },
    [],
  );

  useGSAP(
    () => {
      const root = scope.current;

      if (!root) {
        return;
      }

      const viewport = root.querySelector<HTMLElement>(
        ".portfolio-story-viewport",
      );
      const toolsPanel =
        root.querySelector<HTMLElement>("[data-story-tools]");
      const journeyPanel =
        root.querySelector<HTMLElement>("[data-story-journey]");
      const toolsHeading = root.querySelector<HTMLElement>(
        ".tools-story-heading",
      );
      const toolsChest = root.querySelector<HTMLElement>(".tools-chest");
      const chestLid = root.querySelector<HTMLElement>(".tools-chest-lid");
      const chestBase = root.querySelector<HTMLElement>(".tools-chest-base");
      const chestGlow = root.querySelector<HTMLElement>(".tools-chest-glow");
      const chestShadow =
        root.querySelector<HTMLElement>(".tools-chest-shadow");
      const skillCards = gsap.utils.toArray<HTMLElement>(
        ".tools-skill-card",
        root,
      );
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      root.classList.toggle("is-reduced-motion", reduceMotion);

      if (
        reduceMotion ||
        !journeyHandle ||
        !viewport ||
        !toolsPanel ||
        !journeyPanel ||
        !toolsHeading ||
        !toolsChest ||
        !chestLid ||
        !chestBase ||
        !chestGlow ||
        !chestShadow ||
        skillCards.length === 0
      ) {
        return;
      }

      const journeyTimeline = journeyHandle.timeline;
      journeyTimeline.progress(0).pause();

      const isMobileViewport = () => window.innerWidth <= 680;
      const isLargeViewport = () =>
        window.innerWidth >= 1440 || window.innerHeight >= 850;

      const calculateToolsScrollDistance = () => {
        const viewportHeight = window.innerHeight;
        const cardCount = Math.max(skillCards.length, 1);
        const fixedPhaseCount = 5;
        const mobile = isMobileViewport();
        const large = isLargeViewport();
        const baseVh = mobile ? 0.92 : large ? 1.18 : 1.04;
        const cardVh = mobile ? 0.54 : large ? 0.68 : 0.6;
        const phaseVh = mobile ? 0.44 : large ? 0.58 : 0.5;
        const rawDistance =
          viewportHeight *
          (baseVh + cardCount * cardVh + fixedPhaseCount * phaseVh);
        const minDistance =
          viewportHeight * (mobile ? 3.1 : large ? 4.3 : 3.6);
        const maxDistance =
          viewportHeight * (mobile ? 4.9 : large ? 6.15 : 5.35);

        return gsap.utils.clamp(minDistance, maxDistance, rawDistance);
      };

      const calculateScrollDistance = () =>
        Math.round(
          calculateToolsScrollDistance() +
            journeyHandle.calculateScrollDistance(),
        );

      journeyTimeline.timeScale(
        isLargeViewport() ? 0.14 : isMobileViewport() ? 0.22 : 0.16,
      );
      const syncedJourneyDuration = Math.max(journeyTimeline.duration(), 0.001);
      let lastSyncedJourneyProgress = -1;
      const syncJourneyTimeline = () => {
        const journeyStartTime = masterTimeline.labels["journey-intro"] ?? 0;
        const journeyProgress = gsap.utils.clamp(
          0,
          1,
          (masterTimeline.time() - journeyStartTime) / syncedJourneyDuration,
        );

        if (Math.abs(journeyProgress - lastSyncedJourneyProgress) < 0.0005) {
          return;
        }

        lastSyncedJourneyProgress = journeyProgress;
        journeyTimeline.progress(journeyProgress).pause();
      };

      gsap.set([toolsPanel, journeyPanel, toolsHeading, toolsChest], {
        clearProps: "all",
      });
      gsap.set(skillCards, {
        clearProps: "all",
      });
      gsap.set(toolsPanel, {
        autoAlpha: 1,
        yPercent: 0,
      });
      gsap.set(journeyPanel, {
        autoAlpha: 0,
        yPercent: isMobileViewport() ? 12 : 16,
      });
      gsap.set(toolsHeading, {
        autoAlpha: 0,
        y: isMobileViewport() ? 18 : 28,
      });
      gsap.set(toolsChest, {
        autoAlpha: 0,
        rotation: -2,
        scale: isMobileViewport() ? 0.84 : 0.88,
        transformOrigin: "50% 85%",
        y: isMobileViewport() ? 30 : 44,
      });
      gsap.set(chestLid, {
        rotationX: 0,
        transformOrigin: "50% 100%",
        y: 0,
      });
      gsap.set(chestBase, {
        transformOrigin: "50% 100%",
      });
      gsap.set(chestGlow, {
        autoAlpha: 0,
        scale: 0.72,
        transformOrigin: "50% 50%",
      });
      gsap.set(chestShadow, {
        autoAlpha: 0,
        scaleX: 0.72,
      });
      gsap.set(skillCards, {
        autoAlpha: 0,
        rotation: (index) => (index % 2 === 0 ? -4 : 4),
        scale: 0.86,
        transformOrigin: "50% 85%",
        x: (index) => (index - (skillCards.length - 1) / 2) * -18,
        y: isMobileViewport() ? 58 : 82,
      });

      const masterTimeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onUpdate: syncJourneyTimeline,
        scrollTrigger: {
          anticipatePin: 1,
          end: () => `+=${calculateScrollDistance()}`,
          id: "portfolio-tools-journey-story",
          invalidateOnRefresh: true,
          pin: viewport,
          refreshPriority: 1,
          scrub: isLargeViewport() ? 1.15 : isMobileViewport() ? 0.85 : 1,
          start: "top top",
          trigger: root,
        },
      });

      masterTimeline
        .addLabel("tools-enter")
        .to(
          toolsHeading,
          {
            autoAlpha: 1,
            duration: 0.56,
            ease: "power3.out",
            y: 0,
          },
          "tools-enter",
        )
        .to(
          chestShadow,
          {
            autoAlpha: 0.52,
            duration: 0.46,
            scaleX: 1,
          },
          "tools-enter+=0.08",
        )
        .to(
          toolsChest,
          {
            autoAlpha: 1,
            duration: 0.58,
            ease: "back.out(1.3)",
            rotation: 0,
            scale: 1,
            y: 0,
          },
          "tools-enter+=0.1",
        )
        .addLabel("chest-anticipation")
        .to(
          toolsChest,
          {
            duration: 0.24,
            ease: "sine.inOut",
            rotation: 1.2,
            y: -5,
            yoyo: true,
            repeat: 1,
          },
          "chest-anticipation",
        )
        .to(
          chestBase,
          {
            duration: 0.22,
            ease: "sine.inOut",
            scaleY: 0.98,
            yoyo: true,
            repeat: 1,
          },
          "chest-anticipation+=0.08",
        )
        .addLabel("chest-open")
        .to(
          chestLid,
          {
            duration: 0.54,
            ease: "back.out(1.12)",
            rotationX: -66,
            y: -10,
          },
          "chest-open",
        )
        .to(
          chestGlow,
          {
            autoAlpha: 1,
            duration: 0.46,
            scale: 1,
          },
          "chest-open+=0.08",
        );

      skillCards.forEach((card, index) => {
        const label = `tools-card-${index + 1}`;

        masterTimeline
          .addLabel(label)
          .to(
            card,
            {
              autoAlpha: 1,
              duration: 0.46,
              ease: "back.out(1.2)",
              rotation: index % 2 === 0 ? -0.8 : 0.8,
              scale: 1,
              x: 0,
              y: 0,
            },
            label,
          )
          .to(
            chestGlow,
            {
              duration: 0.3,
              scale: 1 + index * 0.035,
            },
            label,
          );
      });

      masterTimeline
        .addLabel("tools-settle")
        .to(
          skillCards,
          {
            duration: 0.42,
            ease: "power2.out",
            rotation: 0,
            stagger: 0.05,
            y: 0,
          },
          "tools-settle",
        )
        .to(
          toolsChest,
          {
            duration: 0.38,
            ease: "power2.out",
            scale: isMobileViewport() ? 0.86 : 0.9,
            y: isMobileViewport() ? 8 : 12,
          },
          "tools-settle",
        )
        .to({}, { duration: isLargeViewport() ? 0.44 : 0.34 })
        .addLabel("tools-complete")
        .addLabel("tools-to-journey")
        .to(
          toolsPanel,
          {
            autoAlpha: 0,
            duration: 0.58,
            ease: "power2.inOut",
            yPercent: isMobileViewport() ? -18 : -24,
          },
          "tools-to-journey",
        )
        .fromTo(
          journeyPanel,
          {
            autoAlpha: 0,
            yPercent: isMobileViewport() ? 12 : 16,
          },
          {
            autoAlpha: 1,
            duration: 0.58,
            ease: "power2.inOut",
            yPercent: 0,
          },
          "tools-to-journey",
        )
        .addLabel("journey-intro", "tools-to-journey+=0.18")
        .to(
          {},
          {
            duration: syncedJourneyDuration,
            ease: "none",
          },
          "journey-intro",
        )
        .addLabel("journey-route-draw", "journey-intro+=0.86")
        .addLabel("journey-first-milestone", "journey-intro+=2.1");

      syncJourneyTimeline();

      requestAnimationFrame(() => ScrollTrigger.refresh());
      void document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    {
      dependencies: [journeyHandle],
      revertOnUpdate: true,
      scope,
    },
  );

  return (
    <section
      className="portfolio-story-sequence"
      id="skills"
      ref={scope}
      aria-label="Tools for the Voyage and Journey Timeline"
    >
      <div className="portfolio-story-viewport">
        <div
          className="portfolio-story-panel portfolio-story-tools"
          data-story-tools
        >
          <div className="portfolio-story-inner tools-story-inner">
            <div className="section-heading tools-story-heading">
              <p className="eyebrow">Crew inventory</p>
              <h2>Tools for the Voyage</h2>
            </div>
            <SkillsContent animated={false} />
          </div>
        </div>

        <div
          className="portfolio-story-panel portfolio-story-journey"
          data-story-journey
        >
          <Journey
            className="portfolio-story-journey-section"
            controlled
            id="journey"
            onTimelineReady={handleJourneyTimeline}
          />
        </div>
      </div>
    </section>
  );
}
