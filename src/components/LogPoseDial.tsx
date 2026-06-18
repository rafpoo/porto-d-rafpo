import type { CSSProperties } from "react";

export const LOG_POSE_ANGLES = [58, 52, 126, 48] as const;

type LogPoseDialProps = {
  activeState?: number;
  className?: string;
  progress?: number;
  reducedMotion?: boolean;
};

const TICK_COUNT = 40;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const shortestAngle = (from: number, to: number) => {
  const delta = ((((to - from) % 360) + 540) % 360) - 180;

  return from + delta;
};

const getNeedleAngle = (activeState: number, progress?: number) => {
  if (progress === undefined) {
    return LOG_POSE_ANGLES[clamp(activeState, 0, LOG_POSE_ANGLES.length - 1)];
  }

  const scaledProgress = clamp(progress, 0, 1) * (LOG_POSE_ANGLES.length - 1);
  const startIndex = Math.floor(scaledProgress);
  const endIndex = clamp(startIndex + 1, 0, LOG_POSE_ANGLES.length - 1);
  const localProgress = scaledProgress - startIndex;
  const startAngle = LOG_POSE_ANGLES[startIndex];
  const endAngle = shortestAngle(startAngle, LOG_POSE_ANGLES[endIndex]);

  return startAngle + (endAngle - startAngle) * localProgress;
};

export function LogPoseDial({
  activeState = 0,
  className = "",
  progress,
  reducedMotion = false,
}: LogPoseDialProps) {
  const angle = getNeedleAngle(activeState, reducedMotion ? undefined : progress);
  const glowOpacity = 0.3 + clamp(activeState, 0, 3) * 0.16;
  const style = {
    "--log-pose-glow-opacity": glowOpacity,
    "--log-pose-needle-angle": `${angle}deg`,
  } as CSSProperties;

  return (
    <span
      aria-hidden="true"
      className={`journey-log-pose-asset log-pose-dial ${className}`}
      style={style}
    >
      <svg
        className="log-pose-dial-svg"
        focusable="false"
        viewBox="0 0 200 200"
      >
        <defs>
          <radialGradient id="log-pose-parchment" cx="42%" cy="34%" r="72%">
            <stop offset="0%" stopColor="#fff4c9" />
            <stop offset="58%" stopColor="#f3dfad" />
            <stop offset="100%" stopColor="#d6b978" />
          </radialGradient>
          <radialGradient id="log-pose-glow" cx="50%" cy="50%" r="58%">
            <stop offset="0%" stopColor="rgba(255, 215, 122, 0.48)" />
            <stop offset="68%" stopColor="rgba(255, 196, 87, 0.2)" />
            <stop offset="100%" stopColor="rgba(255, 196, 87, 0)" />
          </radialGradient>
          <linearGradient id="log-pose-ring" x1="36" x2="164" y1="30" y2="170">
            <stop offset="0%" stopColor="#f0c56b" />
            <stop offset="46%" stopColor="#b8863b" />
            <stop offset="100%" stopColor="#74501e" />
          </linearGradient>
          <linearGradient id="log-pose-needle-red" x1="100" x2="100" y1="28" y2="128">
            <stop offset="0%" stopColor="#d75a45" />
            <stop offset="52%" stopColor="#8f1f13" />
            <stop offset="100%" stopColor="#4d100b" />
          </linearGradient>
          <filter id="log-pose-paper-grain" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              baseFrequency="0.8"
              numOctaves="2"
              result="noise"
              seed="8"
              type="fractalNoise"
            />
            <feColorMatrix
              in="noise"
              result="grain"
              type="matrix"
              values="0 0 0 0 0.24 0 0 0 0 0.18 0 0 0 0 0.08 0 0 0 0.12 0"
            />
            <feBlend in="SourceGraphic" in2="grain" mode="multiply" />
          </filter>
          <filter id="log-pose-soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="4"
              floodColor="#2a170e"
              floodOpacity="0.24"
              stdDeviation="4"
            />
          </filter>
        </defs>

        <circle
          className="journey-log-pose-glow log-pose-dial-outer-glow"
          cx="100"
          cy="100"
          r="88"
        />
        <circle
          className="log-pose-dial-outer-ring"
          cx="100"
          cy="100"
          filter="url(#log-pose-soft-shadow)"
          r="78"
        />
        <circle
          className="log-pose-dial-base"
          cx="100"
          cy="100"
          filter="url(#log-pose-paper-grain)"
          r="68"
        />

        <g className="log-pose-dial-guides">
          <line x1="100" x2="100" y1="38" y2="162" />
          <line x1="38" x2="162" y1="100" y2="100" />
          <line x1="56" x2="144" y1="56" y2="144" />
          <line x1="144" x2="56" y1="56" y2="144" />
          <circle cx="100" cy="100" r="42" />
          <circle cx="100" cy="100" r="58" />
        </g>

        <g className="log-pose-dial-radial-marks">
          {Array.from({ length: TICK_COUNT }, (_, index) => {
            const isMajor = index % 5 === 0;
            const isCardinal = index % 10 === 0;

            return (
              <line
                className={
                  isCardinal
                    ? "log-pose-dial-tick is-cardinal"
                    : isMajor
                      ? "log-pose-dial-tick is-major"
                      : "log-pose-dial-tick"
                }
                key={index}
                transform={`rotate(${(360 / TICK_COUNT) * index} 100 100)`}
                x1="100"
                x2="100"
                y1={isCardinal ? 30 : isMajor ? 34 : 38}
                y2="46"
              />
            );
          })}
        </g>

        <path
          className="log-pose-dial-compass-star"
          d="M100 52 L109 91 L148 100 L109 109 L100 148 L91 109 L52 100 L91 91 Z"
        />

        <g
          className="journey-log-pose-needle log-pose-dial-needle"
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: "100px 100px",
          }}
        >
          <path
            className="log-pose-dial-needle-shadow"
            d="M100 26 L112 102 L100 96 L88 102 Z"
          />
          <path
            className="log-pose-dial-needle-main"
            d="M100 28 L110 101 L100 96 L90 101 Z"
          />
          <path
            className="log-pose-dial-needle-tail"
            d="M100 105 L107 150 L100 164 L93 150 Z"
          />
        </g>

        <circle className="log-pose-dial-center-cap" cx="100" cy="100" r="10" />
        <circle className="log-pose-dial-center-dot" cx="100" cy="100" r="4" />
        <path
          className="journey-log-pose-highlight log-pose-dial-highlight"
          d="M58 63 C80 43 119 39 143 58"
        />
      </svg>
    </span>
  );
}
