import {
  Anchor,
  Compass,
  GraduationCap,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import { timelineItems } from "../../data/portfolio";
import {
  GsapGrandLineJourney,
  type GrandLineJourneyHandle,
} from "../GsapVoyageEffects";

type JourneyLandmark = {
  Icon: LucideIcon;
  coordinate: string;
  label: string;
  tone: "academy" | "festival" | "medical" | "navigation";
  x: string;
  y: string;
};

const journeyRoutePath =
  "M70 426 C118 386 166 366 210 353 C294 308 322 212 420 214 C534 216 538 420 640 358 C742 296 762 206 860 202";

const journeyLandmarks: JourneyLandmark[] = [
  {
    Icon: GraduationCap,
    coordinate: "07N / 23E",
    label: "Academy island",
    tone: "academy",
    x: "21%",
    y: "63%",
  },
  {
    Icon: Anchor,
    coordinate: "14N / 47E",
    label: "Festival port",
    tone: "festival",
    x: "42%",
    y: "38%",
  },
  {
    Icon: HeartPulse,
    coordinate: "08S / 69E",
    label: "Medical shipyard",
    tone: "medical",
    x: "64%",
    y: "64%",
  },
  {
    Icon: Compass,
    coordinate: "18N / 86E",
    label: "Compass outpost",
    tone: "navigation",
    x: "86%",
    y: "36%",
  },
];

type JourneyProps = {
  className?: string;
  controlled?: boolean;
  id?: string;
  onTimelineReady?: (handle: GrandLineJourneyHandle | null) => void;
};

export function Journey({
  className = "",
  controlled = false,
  id = "journey",
  onTimelineReady,
}: JourneyProps = {}) {
  const totalMilestones = timelineItems.length;

  return (
    <section
      className={`content-section journey-grand-line-section ${className}`}
      id={id}
      aria-labelledby="journey-title"
    >
      <GsapGrandLineJourney
        controlled={controlled}
        onTimelineReady={onTimelineReady}
      >
        <div className="journey-grand-line-viewport">
          <div className="section-heading journey-title-card">
            <p className="eyebrow">Island route</p>
            <h2 id="journey-title">Journey Timeline</h2>
          </div>

          <div className="journey-map-stage" aria-hidden="true">
            <div className="journey-map-camera">
              <div className="journey-map-board">
                <div className="journey-map-grain" />
                <div className="journey-map-depth journey-map-depth-back" />
                <div className="journey-map-depth journey-map-depth-front" />
                <svg
                  className="journey-route-svg"
                  viewBox="0 0 1000 560"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <filter
                      id="journey-route-shadow"
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="8"
                        stdDeviation="7"
                        floodColor="#2a170e"
                        floodOpacity="0.22"
                      />
                    </filter>
                  </defs>
                  <path
                    className="journey-route-outline"
                    d={journeyRoutePath}
                  />
                  <path
                    className="journey-route-dots"
                    d={journeyRoutePath}
                  />
                  <path
                    className="journey-route-progress"
                    d={journeyRoutePath}
                  />
                  <path
                    className="journey-route-motion-path"
                    d={journeyRoutePath}
                  />
                  <g className="journey-ship" aria-hidden="true">
                    <g className="journey-ship-body">
                      <path className="journey-ship-hull" d="M-42 12 L42 12 L28 30 L-28 30 Z" />
                      <path className="journey-ship-sail-main" d="M-8 -42 L-8 12 L-38 12 Z" />
                      <path className="journey-ship-sail-back" d="M0 -30 L0 12 L36 12 Z" />
                      <path className="journey-ship-mast" d="M-4 -46 L4 -46 L4 18 L-4 18 Z" />
                      <circle className="journey-ship-lantern" cx="31" cy="18" r="4" />
                    </g>
                  </g>
                </svg>

                <div className="journey-cloud journey-cloud-one" />
                <div className="journey-cloud journey-cloud-two" />
                <div className="journey-cloud journey-cloud-three" />
                <div className="journey-compass-rose" />
                <div className="journey-coordinate-grid" />

                {timelineItems.map((item, index) => {
                  const landmark = journeyLandmarks[index];
                  const Icon = landmark.Icon;

                  return (
                    <div
                      className={`journey-island journey-island-${landmark.tone}`}
                      data-journey-island={index}
                      key={item.title}
                      style={
                        {
                          "--journey-x": landmark.x,
                          "--journey-y": landmark.y,
                        } as CSSProperties
                      }
                    >
                      <span className="journey-island-shadow" />
                      <span className="journey-island-base" />
                      <span className="journey-island-ring" />
                      <span className="journey-island-icon">
                        <Icon size={28} strokeWidth={1.8} />
                      </span>
                      <span className="journey-island-label">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        {landmark.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className="journey-log-pose"
            aria-live="polite"
            aria-label="Journey progress"
          >
            <span className="journey-log-pose-ring" aria-hidden="true">
              <span className="journey-log-pose-needle" />
            </span>
            <span className="journey-log-pose-copy">
              <span>Log Pose</span>
              <strong data-journey-progress-count>
                01 / {String(totalMilestones).padStart(2, "0")}
              </strong>
            </span>
            <span className="journey-progress-track" aria-hidden="true">
              <span data-journey-progress-fill />
            </span>
          </div>

          <div
            className="journey-panels"
            aria-label="Rafael's portfolio journey timeline"
          >
            {timelineItems.map((item, index) => {
              const landmark = journeyLandmarks[index];
              const Icon = landmark.Icon;

              return (
                <article
                  className={`journey-panel journey-panel-${landmark.tone}`}
                  data-journey-panel={index}
                  key={item.title}
                >
                  <div className="journey-panel-stamp">
                    <Icon size={18} aria-hidden="true" />
                    <span>{landmark.coordinate}</span>
                  </div>
                  <span className="journey-panel-date">{item.date}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </GsapGrandLineJourney>
    </section>
  );
}
