import type gsap from "gsap";

// GSAP Timeline type
export type GSAPTimeline = gsap.core.Timeline;

/**
 * Animation v3: Simplified 3-Scene Structure
 *
 * SCENE 1: THE PROBLEM (~3s)
 *   - Browser with URL/loading/skeleton
 *   - Single green slot hydrates
 *   - Caption: "SvelteKit gives us one slot"
 *
 * SCENE 2: THE SOLUTION (~3s)
 *   - CLI + layout panel enter
 *   - CLI types command, shows output
 *   - Regions cascade into layout panel
 *   - Caption: "Layout Regions gives us as many as we need"
 *
 * SCENE 3: THE PAYOFF (~3-4s)
 *   - Browser with 4 slots hydrating
 *   - Caption: "One layout, unlimited regions"
 *   - Idle state with animated shimmer
 */
export const FRAME_LABELS = [
  "scene1-problem", // Browser loads, single slot hydrates
  "scene2-solution", // CLI + layout panel, regions cascade
  "scene3-payoff", // Browser with all regions hydrating
] as const;

export type FrameLabel = (typeof FRAME_LABELS)[number];

// Animation durations (in seconds)
export const DURATIONS = {
  framePause: 0.3, // Pause between major frames
  cliTyping: 0.05, // Per-character typing speed
  cliOutput: 0.4, // CLI output appearing
  contentFade: 0.4, // Content fading in
  regionPulse: 0.3, // Region hydration pulse
  browserFade: 0.5, // Browser frame appearing
} as const;

// Easing functions
export const EASINGS = {
  smooth: "power2.inOut",
  bounce: "back.out(1.2)",
  draw: "power1.inOut",
  fade: "power1.out",
  typing: "steps(1)",
} as const;
