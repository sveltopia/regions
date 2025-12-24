<script lang="ts">
  import { browser, dev } from "$app/environment";
  import { onMount } from "svelte";
  import gsap from "gsap";
  import { MousePointer, RotateCcw } from "lucide-svelte";
  import AnimationControls from "./AnimationControls.svelte";
  import { FRAME_LABELS, DURATIONS, type GSAPTimeline } from "./types";

  /**
   * RegionsAnimation V2: Visual storytelling with 3-act structure
   *
   * Act 1: Problem → Need → Solution Intro (Frames 0-2, ~4-5 seconds)
   *   Frame 0: "SvelteKit gives us one slot" + green main content
   *   Frame 1: "But we need..." + colored regions appear
   *   Frame 2: "Layout Regions makes it easy." → flows into CLI
   *
   * Act 2: The Solution (Frames 3+)
   *   - CLI demonstrates quick "boom boom boom" magic wand
   *
   * Act 3: The Payoff
   *   - Data flow visualization with 3D layers
   */

  interface Props {
    devMode?: boolean;
    autoPlay?: boolean;
  }

  let { devMode = dev, autoPlay = true }: Props = $props();

  // Frame positions as percentages (relative to 900x500 canvas)
  // Wider frames (412.5px) with 25px margins and 25px gap
  const POSITIONS = {
    // X positions (percentage of 900px)
    cliX: "2.78%", // 25/900
    layoutX: "51.39%", // 462.5/900
    browserCenterX: "27.08%", // 243.75/900 (centered)
    browserRightX: "85%", // off-screen right for Scene 3 entry
    // Y positions (percentage of 500px)
    browserY: "20%", // 100/500
    cliY: "20%", // 100/500 - same as browser
    layoutY: "20%", // 100/500 - same as browser
    // Widths/heights (percentage)
    browserWidth: "45.83%", // 412.5/900
    browserHeight: "74%", // 370/500
    frameWidth: "45.83%", // 412.5/900
    frameHeight: "74%", // 370/500 - all frames same height
  };

  // Timeline ref
  let timeline: GSAPTimeline | null = $state(null);

  // === CAPTION REFS ===
  // Scene 1: "SvelteKit gives us one place to render page content in a layout."
  let caption0: HTMLDivElement;
  let caption0Line1: HTMLSpanElement;

  // Scene 2: "Layout Regions give us as many as we need."
  let caption2: HTMLDivElement;
  let caption2Line1: HTMLSpanElement;

  // Scene 3: Final payoff caption (two lines for staggered fade)
  let caption3: HTMLDivElement;
  let caption3Line1: HTMLSpanElement;
  let caption3Line2: HTMLSpanElement;

  // === BROWSER FRAME REFS ===
  let browserFrame: HTMLDivElement;
  let urlBar: HTMLDivElement;
  let urlText: HTMLSpanElement;
  let mouseCursor: HTMLDivElement;
  let loadingSpinner: SVGSVGElement;
  let pageLayout: HTMLDivElement;

  // === CLI FRAME REFS ===
  let cliFrame: HTMLDivElement;
  let cliCommandLine: HTMLDivElement;
  let cliText: HTMLSpanElement; // Single element for typed text + cursor

  // CLI output refs (simplified skeleton wizard)
  let cliOutputContainer: HTMLDivElement;
  let cliHeader: HTMLDivElement;
  let cliSkeleton1: HTMLDivElement;
  let cliSkeleton2: HTMLDivElement;
  let cliSkeleton3: HTMLDivElement;
  let cliSkeletonBar1: HTMLDivElement;
  let cliSkeletonBar2: HTMLDivElement;
  let cliSkeletonBar3: HTMLDivElement;
  let cliGenerating: HTMLDivElement;
  let cliFiles: HTMLDivElement;
  let cliDone: HTMLDivElement;

  // Layout panel refs (+layout.svelte that appears alongside CLI)
  let layoutPanel: HTMLDivElement;
  let layoutPanelContent: HTMLDivElement;
  let layoutRegionsWrapper: HTMLDivElement;
  let layoutRegionsTag: HTMLDivElement;
  let layoutRegionHeader: HTMLDivElement;
  let layoutRegionSidebar: HTMLDivElement;
  let layoutRegionFooter: HTMLDivElement;
  let layoutRenderChildren: HTMLDivElement;

  // Layout regions (hardcoded - turn orange in Frame 1)
  let layoutHeader: HTMLDivElement;
  let layoutSidebar: HTMLDivElement;
  let layoutFooter: HTMLDivElement;

  // Content regions (page-specific - get colored in Frame 2+)
  let pageHeader: HTMLDivElement;
  let mainContent: HTMLDivElement;
  let pageFooter: HTMLDivElement;
  let sidebarBlock1: HTMLDivElement;
  let sidebarBlock2: HTMLDivElement;

  // Fill overlay refs (for bottom-to-top fill animation)
  let fillLayoutHeader: HTMLDivElement;
  let fillSidebarBlock1: HTMLDivElement;
  let fillLayoutFooter: HTMLDivElement;
  let fillPageHeader: HTMLDivElement;
  let fillSidebarBlock2: HTMLDivElement;
  let fillPageFooter: HTMLDivElement;
  let fillMainContent: HTMLDivElement;

  // Idle animation state
  let lastTracedIndex = -1;

  // Pulse overlay refs for idle animation shimmer (all 4 region boxes)
  let pulseOverlayGreen: HTMLDivElement;
  let pulseOverlayPurple: HTMLDivElement;
  let pulseOverlayBlue: HTMLDivElement;
  let pulseOverlayAmber: HTMLDivElement;

  // Reduced motion support
  let prefersReducedMotion = $state(false);

  // Restart button state
  let showRestartButton = $state(false);

  function handleRestart() {
    if (!timeline) return;
    showRestartButton = false;
    timeline.restart();
  }

  $effect(() => {
    if (browser) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      prefersReducedMotion = mediaQuery.matches;

      const handler = (e: MediaQueryListEvent) => {
        prefersReducedMotion = e.matches;
      };
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  });

  onMount(() => {
    if (prefersReducedMotion) return;

    // === INITIAL STATES ===

    // Caption 0: "SvelteKit gives us one place to render page content in a layout."
    gsap.set(caption0, { opacity: 1, visibility: "visible" });
    gsap.set(caption0Line1, { clipPath: "inset(0 100% 0 0)" });

    // Caption 2: "Layout Regions gives us as many as we need." - hidden initially
    gsap.set(caption2, { opacity: 0, visibility: "visible" });
    gsap.set(caption2Line1, { clipPath: "inset(0 100% 0 0)" });

    // Caption 3: Final payoff - both lines hidden initially (will fade in)
    gsap.set(caption3, { opacity: 0, visibility: "visible" });
    gsap.set([caption3Line1, caption3Line2], { opacity: 0 });

    // CLI frame: below canvas, hidden
    gsap.set(cliFrame, {
      y: 100,
      opacity: 0,
      visibility: "visible",
    });

    // Layout panel: off to the right, hidden
    gsap.set(layoutPanel, {
      x: 60,
      opacity: 0,
      visibility: "visible",
    });
    // Hide everything except render children initially
    gsap.set(layoutRegionsWrapper, { opacity: 0 });
    gsap.set(layoutRegionsTag, { opacity: 0 });
    gsap.set([layoutRegionHeader, layoutRegionSidebar, layoutRegionFooter], {
      opacity: 0,
      y: 10,
      scale: 0.95,
    });

    // CLI text: starts with just cursor
    if (cliText) cliText.innerHTML = '<span class="cli-cursor">▌</span>';

    // CLI output: all lines hidden initially
    // Container hidden until command is typed
    gsap.set(cliOutputContainer, { opacity: 0 });

    // Individual CLI output lines - must be set explicitly for GSAP to manage them
    gsap.set([cliHeader, cliGenerating, cliFiles, cliDone], { opacity: 0 });

    // Skeleton rows: hidden AND clipped for wipe-in effect
    gsap.set([cliSkeleton1, cliSkeleton2, cliSkeleton3], {
      opacity: 0,
      clipPath: "inset(0 100% 0 0)",
    });

    // Fill overlays: start clipped from top (hidden) - will reveal bottom-to-top like buckets
    gsap.set(
      [
        fillLayoutHeader,
        fillSidebarBlock1,
        fillLayoutFooter,
        fillPageHeader,
        fillSidebarBlock2,
        fillPageFooter,
        fillMainContent,
      ],
      { clipPath: "inset(100% 0 0 0)" }
    );

    // Browser: below canvas, hidden (visibility set to visible for GSAP)
    gsap.set(browserFrame, {
      y: 120,
      opacity: 0,
      visibility: "visible",
    });

    // Browser loading elements: hidden initially
    gsap.set(mouseCursor, {
      x: 350, // Off right edge
      y: 15, // Near URL bar height
      opacity: 0,
    });

    gsap.set(loadingSpinner, {
      opacity: 0,
      rotation: 0,
    });

    // Page layout: hidden initially (wipes down after URL loads)
    gsap.set(pageLayout, {
      clipPath: "inset(0 0 100% 0)", // Hidden from bottom
    });

    // URL text: start empty
    if (urlText) {
      urlText.textContent = "";
    }

    // Create timeline (always paused initially, delay handles autoPlay)
    const tl = gsap.timeline({
      paused: true,
    });

    // Delay start to let page settle (prevents jumpy animation on initial render)
    if (autoPlay) {
      gsap.delayedCall(1, () => {
        tl.play();
      });
    }

    // =========================================================================
    // ANIMATION V3: 3-SCENE STRUCTURE (~8-10 seconds)
    // =========================================================================

    // Helper function to create and animate particles
    const createParticles = (
      fromEl: HTMLElement,
      toEl: HTMLElement,
      color: string,
      onComplete: () => void
    ) => {
      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();
      const canvasRect = document
        .querySelector(".animation-canvas")
        ?.getBoundingClientRect();

      if (!canvasRect) return;

      const fromX = fromRect.left - canvasRect.left + fromRect.width / 2;
      const fromY = fromRect.top - canvasRect.top + fromRect.height / 2;
      const toX = toRect.left - canvasRect.left + toRect.width / 2;
      const toY = toRect.top - canvasRect.top + toRect.height / 2;

      const particleCount = 24;
      const particles: HTMLDivElement[] = [];
      const container = document.querySelector(".animation-canvas");

      if (!container) return;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        const size = 4 + Math.random() * 4; // 4-8px varied sizes
        particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: ${color};
          box-shadow: 0 0 ${size + 4}px ${color};
          pointer-events: none;
          z-index: 100;
          opacity: 0;
        `;
        container.appendChild(particle);
        particles.push(particle);
      }

      particles.forEach((particle, i) => {
        const delay = i * 0.025; // Faster stagger (was 0.05)
        const offsetX = (Math.random() - 0.5) * 50; // More spread
        const offsetY = (Math.random() - 0.5) * 30;

        gsap.set(particle, { left: fromX, top: fromY, opacity: 0 });

        gsap.to(particle, {
          left: toX + offsetX,
          top: toY + offsetY,
          opacity: 1,
          duration: 0.2, // Faster travel (was 0.35)
          delay: delay,
          ease: "power2.out",
        });

        gsap.to(particle, {
          left: toX,
          top: toY,
          opacity: 0,
          duration: 0.15, // Faster fade (was 0.3)
          delay: delay + 0.2,
          ease: "power2.in",
          onComplete: () => {
            particle.remove();
            if (i === particleCount - 1) {
              onComplete();
            }
          },
        });
      });
    };

    // URL for typing animation
    const fullUrl = "regions.sveltopia.com";

    // =========================================================================
    // SCENE 1: THE PROBLEM (~4s)
    // Caption wipes → URL types → page wipes down → green slot hydrates
    // =========================================================================
    tl.addLabel(FRAME_LABELS[0]);

    // Browser bounces in from bottom (with blank content area)
    tl.to(
      browserFrame,
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
      },
      FRAME_LABELS[0]
    );

    // Caption wipes in smoothly after browser intro finishes
    tl.to(
      caption0Line1,
      { clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "power2.out" },
      `${FRAME_LABELS[0]}+=0.5`
    );

    // Brief pause for reading, then mouse moves to URL bar
    tl.to(
      mouseCursor,
      { opacity: 1, duration: 0.1 },
      `${FRAME_LABELS[0]}+=1.0`
    );
    tl.to(
      mouseCursor,
      { x: 180, y: 12, duration: 0.25, ease: "power2.out" },
      `${FRAME_LABELS[0]}+=1.05`
    );

    // URL bar highlights
    tl.call(
      () => urlBar?.classList.add("active"),
      [],
      `${FRAME_LABELS[0]}+=1.25`
    );

    // URL types in
    tl.to(
      urlText,
      {
        duration: 0.5,
        ease: "none",
        onUpdate: function () {
          const progress = this.progress();
          const charsToShow = Math.floor(progress * fullUrl.length);
          if (urlText) {
            urlText.textContent =
              fullUrl.substring(0, charsToShow) +
              (charsToShow < fullUrl.length ? "|" : "");
          }
        },
        onComplete: () => {
          if (urlText) urlText.textContent = fullUrl;
        },
      },
      `${FRAME_LABELS[0]}+=1.3`
    );

    // Cursor fades out
    tl.to(
      mouseCursor,
      { opacity: 0, duration: 0.1 },
      `${FRAME_LABELS[0]}+=1.85`
    );

    // Loading spinner
    tl.to(
      loadingSpinner,
      { opacity: 1, duration: 0.1 },
      `${FRAME_LABELS[0]}+=1.9`
    );
    tl.to(
      loadingSpinner,
      { rotation: 360, duration: 0.4, ease: "linear" },
      `${FRAME_LABELS[0]}+=1.9`
    );
    tl.to(
      loadingSpinner,
      { opacity: 0, duration: 0.1 },
      `${FRAME_LABELS[0]}+=2.25`
    );

    // Page wipes down (grey boxes appear)
    tl.to(
      pageLayout,
      { clipPath: "inset(0 0 0% 0)", duration: 0.4, ease: "power2.out" },
      `${FRAME_LABELS[0]}+=2.3`
    );

    // Single green slot hydrates with particles (starts as page wipe finishes)
    tl.addLabel("scene1Hydrate", `${FRAME_LABELS[0]}+=2.65`);

    tl.call(
      () => {
        createParticles(
          layoutRenderChildren,
          mainContent,
          "#84cc16", // lime-500
          () => {}
        );
      },
      [],
      "scene1Hydrate"
    );

    tl.to(
      fillMainContent,
      { clipPath: "inset(0% 0 0 0)", duration: 0.35, ease: "power2.out" },
      "scene1Hydrate+=0.15"
    );

    // Brief pause on Scene 1
    tl.addLabel("scene1End", "scene1Hydrate+=0.5");

    // =========================================================================
    // SCENE 2: THE SOLUTION (~3s)
    // CLI + layout panel enter, quick text swap, single generation, regions cascade
    // =========================================================================
    tl.addLabel(FRAME_LABELS[1], "scene1End+=0.3");

    // Fade out caption 0
    tl.to(
      caption0,
      { opacity: 0, duration: 0.2, ease: "power2.out" },
      FRAME_LABELS[1]
    );

    // Browser fades and drops out
    tl.to(
      browserFrame,
      { y: 50, opacity: 0, duration: 0.4, ease: "power2.in" },
      FRAME_LABELS[1]
    );

    // Reset URL bar for Scene 3
    tl.call(
      () => {
        if (urlBar) urlBar.classList.remove("active");
        if (urlText) urlText.textContent = "";
      },
      [],
      `${FRAME_LABELS[1]}+=0.3`
    );

    // Reset main content fill
    tl.set(
      fillMainContent,
      { clipPath: "inset(100% 0 0 0)" },
      `${FRAME_LABELS[1]}+=0.3`
    );

    // CLI enters from bottom
    tl.to(
      cliFrame,
      { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.5)" },
      `${FRAME_LABELS[1]}+=0.5`
    );

    // Layout panel enters from right
    tl.to(
      layoutPanel,
      { x: 0, opacity: 1, duration: 0.4, ease: "back.out(1.5)" },
      `${FRAME_LABELS[1]}+=0.6`
    );

    // Show render children when panel enters (green slot is always there)
    tl.to(
      layoutRenderChildren,
      { opacity: 1, duration: 0.2 },
      `${FRAME_LABELS[1]}+=0.8`
    );

    // Show caption 2 AFTER frames animate in (around 1.1s)
    tl.set(caption2, { opacity: 1 }, `${FRAME_LABELS[1]}+=1.1`);
    tl.to(
      caption2Line1,
      { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "power2.out" },
      `${FRAME_LABELS[1]}+=1.1`
    );

    // === CLI TYPING ANIMATION WITH ARGUMENT SWAP ===
    // Start after caption appears
    tl.addLabel("cliType", `${FRAME_LABELS[1]}+=1.6`);

    // Command parts for argument swapping
    const cliBase = "npx @sveltopia/regions add ";
    const cliArgs = ["page-header", "custom-sidebar", "page-footer"];
    const cursor = '<span class="cli-cursor">▌</span>';

    // Helper to render command with highlighted argument
    const renderCommand = (arg: string, highlight = false) => {
      if (highlight) {
        return `${cliBase}<span class="cli-arg-highlight">${arg}</span>${cursor}`;
      }
      return `${cliBase}${arg}${cursor}`;
    };

    // Reset to just cursor at start
    tl.call(
      () => {
        if (cliText) cliText.innerHTML = cursor;
      },
      [],
      "cliType"
    );

    // Type the base command first
    tl.to(
      {},
      {
        duration: 0.5,
        ease: "steps(" + cliBase.length + ")",
        onUpdate: function () {
          const progress = this.progress();
          const chars = Math.floor(progress * cliBase.length);
          const typed = cliBase.substring(0, chars);
          if (cliText) cliText.innerHTML = typed + cursor;
        },
        onComplete: () => {
          if (cliText) cliText.innerHTML = cliBase + cursor;
        },
      },
      "cliType"
    );

    // Type first argument (page-header)
    tl.to(
      {},
      {
        duration: 0.25,
        ease: "steps(" + cliArgs[0].length + ")",
        onUpdate: function () {
          const progress = this.progress();
          const chars = Math.floor(progress * cliArgs[0].length);
          const typed = cliArgs[0].substring(0, chars);
          if (cliText) cliText.innerHTML = cliBase + typed + cursor;
        },
        onComplete: () => {
          if (cliText) cliText.innerHTML = renderCommand(cliArgs[0]);
        },
      },
      "cliType+=0.55"
    );

    // Quick swap to custom-sidebar
    tl.addLabel("argSwap1", "cliType+=0.85");
    tl.call(
      () => {
        if (cliText) cliText.innerHTML = renderCommand(cliArgs[1], true);
      },
      [],
      "argSwap1"
    );
    // Remove highlight
    tl.call(
      () => {
        if (cliText) cliText.innerHTML = renderCommand(cliArgs[1]);
      },
      [],
      "argSwap1+=0.1"
    );

    // Quick swap to page-footer
    tl.addLabel("argSwap2", "argSwap1+=0.2");
    tl.call(
      () => {
        if (cliText) cliText.innerHTML = renderCommand(cliArgs[2], true);
      },
      [],
      "argSwap2"
    );
    // Remove highlight
    tl.call(
      () => {
        if (cliText) cliText.innerHTML = renderCommand(cliArgs[2]);
      },
      [],
      "argSwap2+=0.15"
    );

    // Hide cursor after final argument
    tl.addLabel("typingDone", "argSwap2+=0.15");
    tl.call(
      () => {
        if (cliText) cliText.innerHTML = `${cliBase}${cliArgs[2]}`;
      },
      [],
      "typingDone"
    );

    // === CLI OUTPUT (nearly instant) ===
    tl.addLabel("cliOutput", "typingDone+=0.05");

    // Show CLI output container
    tl.to(cliOutputContainer, { opacity: 1, duration: 0.1 }, "cliOutput");

    // Header appears
    tl.to(cliHeader, { opacity: 1, duration: 0.15 }, "cliOutput+=0.05");

    // Skeleton bars wipe in
    tl.to(
      cliSkeleton1,
      { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.15 },
      "cliOutput+=0.15"
    );
    tl.to(
      cliSkeleton2,
      { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.15 },
      "cliOutput+=0.25"
    );
    tl.to(
      cliSkeleton3,
      { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.15 },
      "cliOutput+=0.35"
    );

    // Generating...
    tl.to(cliGenerating, { opacity: 1, duration: 0.1 }, "cliOutput+=0.5");

    // Files created
    tl.to(cliFiles, { opacity: 1, duration: 0.1 }, "cliOutput+=0.7");

    // Done!
    tl.to(cliDone, { opacity: 1, duration: 0.1 }, "cliOutput+=0.85");

    // === LAYOUT REGIONS APPEAR AFTER CLI COMPLETES ===
    // Show wrapper and tag after "Done!"
    tl.to(
      layoutRegionsWrapper,
      { opacity: 1, duration: 0.15 },
      "cliOutput+=0.95"
    );
    tl.to(
      layoutRegionsTag,
      { opacity: 1, duration: 0.15 },
      "cliOutput+=1.0"
    );

    // === REGIONS CASCADE INTO LAYOUT PANEL ===
    tl.addLabel("regionsCascade", "cliOutput+=1.15");

    // pageHeader region appears
    tl.to(
      layoutRegionHeader,
      { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "back.out(1.3)" },
      "regionsCascade"
    );

    // customSidebar region appears
    tl.to(
      layoutRegionSidebar,
      { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "back.out(1.3)" },
      "regionsCascade+=0.2"
    );

    // pageFooter region appears
    tl.to(
      layoutRegionFooter,
      { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "back.out(1.3)" },
      "regionsCascade+=0.4"
    );

    // Brief pause before Scene 3
    tl.addLabel("scene2End", "regionsCascade+=0.4");

    // =========================================================================
    // SCENE 3: THE PAYOFF (~3-4s)
    // CLI fades, layout slides left, browser enters, all regions hydrate
    // =========================================================================
    tl.addLabel(FRAME_LABELS[2], "scene2End+=0.2");

    // Fade out caption 2
    tl.to(
      caption2,
      { opacity: 0, duration: 0.2, ease: "power2.out" },
      FRAME_LABELS[2]
    );

    // Fade out CLI frame
    tl.to(
      cliFrame,
      { opacity: 0, y: 20, duration: 0.4, ease: "power2.in" },
      FRAME_LABELS[2]
    );

    // Slide layout panel to left
    tl.to(
      layoutPanel,
      { left: POSITIONS.cliX, duration: 0.5, ease: "power2.inOut" },
      `${FRAME_LABELS[2]}+=0.2`
    );

    // Browser enters from right
    tl.set(
      browserFrame,
      { left: POSITIONS.browserRightX, y: 0, opacity: 0 },
      `${FRAME_LABELS[2]}+=0.3`
    );
    tl.to(
      browserFrame,
      {
        left: POSITIONS.layoutX,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      `${FRAME_LABELS[2]}+=0.4`
    );

    // Reset browser fills and layout for loading sequence
    tl.set(
      [fillPageHeader, fillSidebarBlock2, fillPageFooter, fillMainContent],
      { clipPath: "inset(100% 0 0 0)" },
      `${FRAME_LABELS[2]}+=0.3`
    );
    tl.set(
      pageLayout,
      { clipPath: "inset(0 0 100% 0)" },
      `${FRAME_LABELS[2]}+=0.3`
    );

    // === BROWSER RELOAD SEQUENCE ===
    // URL already visible, just reload the page (saves ~1s vs typing)
    tl.addLabel("scene3Load", `${FRAME_LABELS[2]}+=0.9`);

    // URL already set from Scene 1, ensure it's visible
    tl.call(
      () => {
        if (urlText) urlText.textContent = "regions.sveltopia.com";
      },
      [],
      "scene3Load"
    );

    // Reset spinner rotation before animating (it's at 360 from Scene 1)
    tl.set(loadingSpinner, { rotation: 0 }, "scene3Load");

    // Quick reload spinner (0.3s spin)
    tl.to(loadingSpinner, { opacity: 1, duration: 0.1 }, "scene3Load");
    tl.to(
      loadingSpinner,
      { rotation: 360, duration: 0.3, ease: "linear" },
      "scene3Load"
    );
    tl.to(loadingSpinner, { opacity: 0, duration: 0.1 }, "scene3Load+=0.3");

    // Page layout wipes down immediately after spinner
    tl.to(
      pageLayout,
      { clipPath: "inset(0 0 0% 0)", duration: 0.4, ease: "power2.out" },
      "scene3Load+=0.35"
    );

    // === HYDRATION SEQUENCE ===
    // Order: green → amber → purple → blue (to avoid visual overlap)
    // Starts as page wipes down (page wipe is at +0.35, 0.4s duration)
    tl.addLabel("scene3Hydrate", "scene3Load+=0.55");

    // 1. Green (main content) hydrates first
    tl.call(
      () => {
        createParticles(layoutRenderChildren, mainContent, "#84cc16", () => {});
      },
      [],
      "scene3Hydrate"
    );
    tl.to(
      fillMainContent,
      { clipPath: "inset(0% 0 0 0)", duration: 0.35, ease: "power2.out" },
      "scene3Hydrate+=0.3"
    );

    // 2. Amber (page footer) hydrates
    tl.call(
      () => {
        createParticles(
          layoutRegionFooter,
          pageFooter,
          "rgb(245, 158, 11)",
          () => {}
        );
      },
      [],
      "scene3Hydrate+=0.35"
    );
    tl.to(
      fillPageFooter,
      { clipPath: "inset(0% 0 0 0)", duration: 0.35, ease: "power2.out" },
      "scene3Hydrate+=0.65"
    );

    // 3. Purple (page header) hydrates
    tl.call(
      () => {
        createParticles(
          layoutRegionHeader,
          pageHeader,
          "rgb(168, 85, 247)",
          () => {}
        );
      },
      [],
      "scene3Hydrate+=0.7"
    );
    tl.to(
      fillPageHeader,
      { clipPath: "inset(0% 0 0 0)", duration: 0.35, ease: "power2.out" },
      "scene3Hydrate+=1.0"
    );

    // 4. Blue (sidebar) hydrates last
    tl.call(
      () => {
        createParticles(
          layoutRegionSidebar,
          sidebarBlock2,
          "rgb(59, 130, 246)",
          () => {}
        );
      },
      [],
      "scene3Hydrate+=1.05"
    );
    tl.to(
      fillSidebarBlock2,
      { clipPath: "inset(0% 0 0 0)", duration: 0.35, ease: "power2.out" },
      "scene3Hydrate+=1.35"
    );

    // === PUNCHLINE CAPTION (after all regions hydrate) ===
    tl.addLabel("scene3Caption", "scene3Hydrate+=1.7");

    // Show caption container
    tl.set(caption3, { opacity: 1 }, "scene3Caption");

    // Fade in "One layout,"
    tl.to(
      caption3Line1,
      { opacity: 1, duration: 0.6, ease: "power2.out" },
      "scene3Caption"
    );

    // Pause, then fade in "unlimited regions."
    tl.to(
      caption3Line2,
      { opacity: 1, duration: 0.6, ease: "power2.out" },
      "scene3Caption+=0.7"
    );

    // Hold final state
    tl.addLabel("end", "scene3Caption+=1.5");

    // === IDLE ANIMATION: CSS rotating conic gradient border ===
    // Randomly applies glowing class to one box at a time

    // Flag to track if idle animation is active
    let idleAnimationActive = false;

    // Box configurations for idle glow animation
    const glowBoxes = [
      {
        container: mainContent,
        fill: fillMainContent,
        shimmer: pulseOverlayGreen,
        name: "green",
      },
      {
        container: pageHeader,
        fill: fillPageHeader,
        shimmer: pulseOverlayPurple,
        name: "purple",
      },
      {
        container: sidebarBlock2,
        fill: fillSidebarBlock2,
        shimmer: pulseOverlayBlue,
        name: "blue",
      },
      {
        container: pageFooter,
        fill: fillPageFooter,
        shimmer: pulseOverlayAmber,
        name: "amber",
      },
    ];

    // Initialize all shimmers as hidden
    glowBoxes.forEach(({ shimmer }) => {
      gsap.set(shimmer, { opacity: 0, x: "-100%" });
    });

    // Function to shimmer a random box
    const shimmerRandomBox = () => {
      if (!idleAnimationActive) return;

      // Pick a random box, avoiding the last one
      let index;
      do {
        index = Math.floor(Math.random() * glowBoxes.length);
      } while (index === lastTracedIndex && glowBoxes.length > 1);
      lastTracedIndex = index;

      const { container, shimmer } = glowBoxes[index];

      // Calculate duration based on box width using square root scaling
      // This gives a middle ground - wider boxes are slower, but not linearly
      // Sidebar (~60px) at 0.6s is baseline, wide boxes (~240px) get ~1.2s
      const baseWidth = 60;
      const baseDuration = 0.6;
      const boxWidth = container.offsetWidth;
      const duration = baseDuration * Math.sqrt(boxWidth / baseWidth);

      // Shimmer sweep left-to-right
      gsap.fromTo(
        shimmer,
        { opacity: 1, x: "-100%" },
        { x: "100%", duration, ease: "power1.inOut" }
      );

      // After shimmer completes, reset and schedule next
      const shimmerMs = duration * 1000 + 100; // duration + small buffer
      setTimeout(() => {
        if (!idleAnimationActive) return;

        // Reset shimmer
        gsap.set(shimmer, { opacity: 0, x: "-100%" });

        // Schedule next box (random 2-3s delay)
        if (idleAnimationActive) {
          const delay = 2000 + Math.random() * 1000;
          setTimeout(shimmerRandomBox, delay);
        }
      }, shimmerMs);
    };

    // Start the idle animation loop
    const startIdleLoop = () => {
      idleAnimationActive = true;
      // Start first shimmer after 2 second delay
      setTimeout(shimmerRandomBox, 2000);
    };

    // Start idle animation and show restart button when main timeline completes
    tl.call(startIdleLoop, [], "end");
    tl.call(() => {
      showRestartButton = true;
    }, [], "end+=0.5");

    // Reset function for when animation rewinds
    const resetIdleState = () => {
      showRestartButton = false;
      idleAnimationActive = false;
      // Reset all shimmers
      glowBoxes.forEach(({ shimmer }) => {
        gsap.set(shimmer, { opacity: 0, x: "-100%" });
      });
      lastTracedIndex = -1;
    };

    // Reset text content (not managed by GSAP)
    const resetTextContent = () => {
      if (urlText) urlText.textContent = "";
      if (cliText) cliText.innerHTML = '<span class="cli-cursor">▌</span>';
      if (urlBar) urlBar.classList.remove("active");
    };

    // Track if we've reset to avoid repeated resets
    let hasResetText = false;

    // Listen for timeline seek/restart to reset states
    tl.eventCallback("onUpdate", () => {
      const progress = tl.progress();
      // If we've gone back before the idle state starts, reset
      if (progress < 0.85) {
        resetIdleState();
      }
      // Reset text content when rewinding to near the start
      if (progress < 0.05 && !hasResetText) {
        resetTextContent();
        hasResetText = true;
      }
      // Allow reset again once we've progressed past the start
      if (progress > 0.1) {
        hasResetText = false;
      }
    });

    timeline = tl;

    return () => {
      tl.kill();
    };
  });
</script>

<!--
  RegionsAnimation V2: 3-Act Visual Storytelling
  Canvas: 900 x 500px | Scales via container queries
-->
<!-- Hide entirely for reduced motion (same as mobile <600px) -->
{#if !prefersReducedMotion}
<div class="animation-container">
  <div class="animation-canvas">
    <!-- === CAPTIONS === -->
    <!-- Scene 1: "SvelteKit gives us one place to render page content in a layout." -->
    <div class="caption caption-0" bind:this={caption0}>
      <span class="caption-line" bind:this={caption0Line1}
        ><span class="highlight-indigo">SvelteKit</span> gives us one place to render
        page content in a layout.</span>
    </div>

    <!-- Scene 2: "Layout Regions give us as many as we need." -->
    <div class="caption caption-2" bind:this={caption2}>
      <span class="caption-line" bind:this={caption2Line1}
        ><span class="highlight-indigo">Layout Regions</span> give us as many as
        we need.</span>
    </div>

    <!-- Scene 3: Final payoff caption (staggered fade, same line) -->
    <div class="caption caption-3" bind:this={caption3}>
      <span class="caption-phrase" bind:this={caption3Line1}
        >One <span class="highlight-indigo">layout</span>,</span>
      <span class="caption-phrase" bind:this={caption3Line2}>
        unlimited <span class="highlight-indigo">regions</span>.</span>
    </div>

    <!-- === BROWSER WIREFRAME === -->
    <div class="browser-frame" bind:this={browserFrame}>
      <!-- Chrome: stoplight + URL bar -->
      <div class="browser-chrome">
        <div class="stoplight">
          <div class="stoplight-btn red"></div>
          <div class="stoplight-btn yellow"></div>
          <div class="stoplight-btn green"></div>
        </div>
        <div class="url-bar" bind:this={urlBar}>
          <span class="url-text" bind:this={urlText}></span>
        </div>
        <!-- Loading spinner -->
        <svg
          class="loading-spinner"
          bind:this={loadingSpinner}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none">
          <circle
            cx="8"
            cy="8"
            r="6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-dasharray="28"
            stroke-dashoffset="8" />
        </svg>
      </div>

      <!-- Content area -->
      <div class="browser-content">
        <!-- Page layout wrapper (wipes down from top) -->
        <div class="page-layout" bind:this={pageLayout}>
          <!-- Layout header (hardcoded in layout) -->
          <div class="layout-header" bind:this={layoutHeader}>
            <div class="fill-overlay fill-indigo" bind:this={fillLayoutHeader}>
            </div>
          </div>

          <!-- Body: sidebar + main -->
          <div class="layout-body">
            <!-- Sidebar -->
            <div class="layout-sidebar" bind:this={layoutSidebar}>
              <div class="sidebar-block" bind:this={sidebarBlock1}>
                <div
                  class="fill-overlay fill-indigo"
                  bind:this={fillSidebarBlock1}>
                </div>
              </div>
              <div class="sidebar-block" bind:this={sidebarBlock2}>
                <div
                  class="fill-overlay fill-blue"
                  bind:this={fillSidebarBlock2}>
                </div>
                <div class="pulse-overlay" bind:this={pulseOverlayBlue}></div>
              </div>
            </div>

            <!-- Main content area -->
            <div class="layout-main">
              <div class="page-header" bind:this={pageHeader}>
                <div
                  class="fill-overlay fill-purple"
                  bind:this={fillPageHeader}>
                </div>
                <div class="pulse-overlay" bind:this={pulseOverlayPurple}></div>
              </div>
              <div class="main-content" bind:this={mainContent}>
                <div
                  class="fill-overlay fill-green"
                  bind:this={fillMainContent}>
                </div>
                <div class="pulse-overlay" bind:this={pulseOverlayGreen}></div>
              </div>
              <div class="page-footer" bind:this={pageFooter}>
                <div class="fill-overlay fill-amber" bind:this={fillPageFooter}>
                </div>
                <div class="pulse-overlay" bind:this={pulseOverlayAmber}></div>
              </div>
            </div>
          </div>

          <!-- Layout footer (hardcoded in layout) -->
          <div class="layout-footer" bind:this={layoutFooter}>
            <div class="fill-overlay fill-indigo" bind:this={fillLayoutFooter}>
            </div>
          </div>
        </div>
      </div>

      <!-- Mouse cursor (for interaction animation) -->
      <div class="mouse-cursor" bind:this={mouseCursor}>
        <MousePointer size={20} strokeWidth={2} />
      </div>
    </div>

    <!-- === CLI FRAME (Terminal style - no tabs) === -->
    <div class="cli-frame" bind:this={cliFrame}>
      <!-- Chrome: 30px with stoplight only -->
      <div class="cli-chrome">
        <div class="stoplight">
          <div class="stoplight-btn red"></div>
          <div class="stoplight-btn yellow"></div>
          <div class="stoplight-btn green"></div>
        </div>
      </div>
      <!-- CLI content area -->
      <div class="cli-content">
        <!-- Command input line -->
        <div class="cli-command-line" bind:this={cliCommandLine}>
          <svg
            class="cli-prompt-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
          <span class="cli-typed" bind:this={cliText}></span>
        </div>

        <!-- CLI output (skeleton "magic wand" wizard) -->
        <div class="cli-output-container" bind:this={cliOutputContainer}>
          <!-- Header -->
          <div class="cli-line cli-header-line" bind:this={cliHeader}>
            <span class="cli-border">┌</span>
            Sveltopia Layout Regions
          </div>

          <!-- Skeleton bars (flash by quickly to show "activity") -->
          <div class="cli-skeleton-row" bind:this={cliSkeleton1}>
            <span class="cli-border">│</span>
            <span class="diamond">◆</span>
            <div
              class="cli-skeleton-bar"
              bind:this={cliSkeletonBar1}
              style="width: 180px;">
            </div>
          </div>
          <div class="cli-skeleton-row" bind:this={cliSkeleton2}>
            <span class="cli-border">│</span>
            <span class="diamond">◆</span>
            <div
              class="cli-skeleton-bar"
              bind:this={cliSkeletonBar2}
              style="width: 140px;">
            </div>
          </div>
          <div class="cli-skeleton-row" bind:this={cliSkeleton3}>
            <span class="cli-border">│</span>
            <span class="diamond">◆</span>
            <div
              class="cli-skeleton-bar"
              bind:this={cliSkeletonBar3}
              style="width: 120px;">
            </div>
          </div>

          <!-- Generating shimmer -->
          <div class="cli-generating" bind:this={cliGenerating}>
            <span class="cli-border">│</span>
            <span class="generating-text">Generating...</span>
          </div>

          <!-- Files created (simplified) -->
          <div class="cli-line cli-files-simple" bind:this={cliFiles}>
            <span class="cli-border">│</span>
            <span class="cli-check">✓</span>
            <span class="cli-file-count">4 files created</span>
          </div>

          <!-- Done -->
          <div class="cli-line cli-done-line" bind:this={cliDone}>
            <span class="cli-border">└</span>
            Done
          </div>
        </div>
      </div>
    </div>

    <!-- === LAYOUT PANEL (+layout.svelte) === -->
    <!-- Hybrid: CLI-style container with floating file tab -->
    <div class="layout-panel" bind:this={layoutPanel}>
      <!-- Chrome: 30px with stoplight + floating file tab -->
      <div class="layout-chrome">
        <div class="stoplight">
          <div class="stoplight-btn red"></div>
          <div class="stoplight-btn yellow"></div>
          <div class="stoplight-btn green"></div>
        </div>
        <!-- Floating file tab -->
        <div class="layout-file-tab">
          <span class="tab-name">+layout.svelte</span>
        </div>
      </div>
      <!-- Content area -->
      <div class="layout-panel-content" bind:this={layoutPanelContent}>
        <!-- LayoutRegions wrapper (appears after generation) -->
        <div class="layout-regions-wrapper" bind:this={layoutRegionsWrapper}>
          <div class="layout-regions-tag" bind:this={layoutRegionsTag}>
            &lt;LayoutRegions&gt;
          </div>

          <!-- Region slots (appear one by one) - solid colors, no borders -->
          <div
            class="layout-region layout-region-header"
            bind:this={layoutRegionHeader}>
            <span class="region-label">pageHeader</span>
            <div class="region-skeleton">
              <div class="skeleton-bar"></div>
              <div class="skeleton-bar short"></div>
            </div>
          </div>

          <div
            class="layout-region layout-region-sidebar"
            bind:this={layoutRegionSidebar}>
            <span class="region-label">customSidebar</span>
            <div class="region-skeleton">
              <div class="skeleton-bar short"></div>
              <div class="skeleton-bar"></div>
            </div>
          </div>

          <div
            class="layout-region layout-region-footer"
            bind:this={layoutRegionFooter}>
            <span class="region-label">pageFooter</span>
            <div class="region-skeleton">
              <div class="skeleton-bar medium"></div>
              <div class="skeleton-bar short"></div>
            </div>
          </div>
        </div>

        <!-- Render children (always visible, starts green) -->
        <div
          class="layout-render-children hydrated"
          bind:this={layoutRenderChildren}>
          <span class="render-children-text">{`{@render children()}`}</span>
        </div>
      </div>
    </div>

    <!-- Dev Controls -->
    <AnimationControls
      {timeline}
      frameLabels={[...FRAME_LABELS]}
      show={devMode} />

    <!-- User Restart Button (fades in at end) -->
    {#if showRestartButton && !devMode}
      <button
        class="restart-button"
        onclick={handleRestart}
        title="Replay animation">
        <RotateCcw size={32} strokeWidth={2} />
      </button>
    {/if}
  </div>
</div>
{/if}

<style>
  @reference "../../../app.css";

  /* === CONTAINER & CANVAS === */
  .animation-container {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 2rem 0;
    container-type: inline-size;
  }

  .animation-canvas {
    width: 900px;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  /* Responsive: fill container width, maintain aspect ratio */
  @container (max-width: 900px) {
    .animation-canvas {
      width: 100%;
      height: auto;
      aspect-ratio: 900 / 500;
    }
  }

  /* Hide entire animation on mobile */
  @media (max-width: 600px) {
    .animation-container {
      display: none;
    }
  }


  /* === CAPTIONS === */
  .caption {
    position: absolute;
    top: 5%; /* 25/500 */
    left: 50%;
    transform: translateX(-50%);
    width: 70%; /* wider for single line */
    text-align: center;
    font-family: ui-sans-serif, system-ui, sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.3;
    @apply text-slate-950;
  }

  /* Hide all captions on initial load (GSAP will show them) */
  .caption-0,
  .caption-2,
  .caption-3 {
    visibility: hidden;
  }

  /* Scene 1 caption: keep on one line */
  .caption-0 {
    white-space: nowrap;
    width: auto;
  }

  /* Responsive caption size at tablet breakpoint (768px) */
  @container (max-width: 768px) {
    .caption {
      font-size: 1.25rem;
    }
  }

  /* 700px: smaller caption */
  @container (max-width: 700px) {
    .caption {
      font-size: 1.1rem;
    }
  }

  /* 660px: compact caption */
  @container (max-width: 660px) {
    .caption {
      font-size: 1rem;
    }
  }

  /* 620px: minimal caption */
  @container (max-width: 620px) {
    .caption {
      font-size: 0.9rem;
    }
  }

  /* === LAYOUT PANEL RESPONSIVE BREAKPOINTS === */

  /* 900px: skeleton bars 7px */
  @container (max-width: 900px) {
    .layout-region .skeleton-bar {
      height: 7px;
    }
  }

  /* 868px: skeleton bars 6px */
  @container (max-width: 868px) {
    .layout-region .skeleton-bar {
      height: 6px;
    }
  }

  /* 824px: skeleton bars 5px */
  @container (max-width: 824px) {
    .layout-region .skeleton-bar {
      height: 5px;
    }
  }

  /* 800px: skeleton bars 7px, hide second bar */
  @container (max-width: 800px) {
    .layout-region .skeleton-bar {
      height: 7px;
    }
    .layout-region .skeleton-bar.short {
      display: none;
    }
  }

  /* 760px: skeleton bars 6px, tab-name smaller */
  @container (max-width: 760px) {
    .layout-region .skeleton-bar {
      height: 6px;
    }
    .tab-name {
      font-size: 9.5px;
    }
  }

  /* 746px: hide skeleton entirely, label centers via flexbox */
  @container (max-width: 746px) {
    .layout-region .region-skeleton {
      display: none;
    }
    .layout-region .region-label {
      margin-bottom: 0;
    }
  }

  /* === CLI FRAME RESPONSIVE BREAKPOINTS === */

  /* 768px: reduce CLI content padding, tab-name font */
  @container (max-width: 768px) {
    .cli-content {
      padding: 16px 10px;
    }
    .layout-file-tab .tab-name {
      font-size: 10px;
    }
  }

  /* 710px: further reduce CLI padding and fonts */
  @container (max-width: 710px) {
    .cli-content {
      padding: 12px 8px;
    }
    .cli-content .cli-typed {
      font-size: 11px;
    }
    .cli-line {
      font-size: 10px;
    }
  }

  /* 670px: reduce typed text */
  @container (max-width: 670px) {
    .cli-content .cli-typed {
      font-size: 10px;
    }
  }

  /* 630px: minimal typed text */
  @container (max-width: 630px) {
    .cli-content .cli-typed {
      font-size: 9px;
    }
  }

  /* 620px: hide CLI skeleton bars, keep text output only */
  @container (max-width: 620px) {
    .cli-skeleton-row {
      display: none;
    }
    .cli-header-line {
      padding-bottom: 4px;
    }
  }

  /* === BROWSER/CHROME RESPONSIVE BREAKPOINTS === */

  /* 800px: reduce browser chrome */
  @container (max-width: 800px) {
    .browser-chrome {
      height: 36px;
    }
    .browser-chrome .stoplight {
      top: 10px;
    }
    .url-bar {
      top: 6px;
      height: 22px;
    }
    .url-text {
      font-size: 9px;
    }
    .browser-content {
      padding: 10px;
      gap: 8px;
    }
  }

  /* 700px: compact browser chrome */
  @container (max-width: 700px) {
    .browser-chrome {
      height: 32px;
    }
    .browser-chrome .stoplight {
      top: 9px;
    }
    .stoplight-btn {
      width: 4px;
      height: 4px;
    }
    .url-bar {
      top: 5px;
      height: 20px;
    }
    .url-text {
      font-size: 8px;
    }
    .loading-spinner {
      top: 8px;
      width: 14px;
      height: 14px;
    }
    .browser-content {
      padding: 8px;
      gap: 6px;
    }
    .page-layout {
      gap: 6px;
    }
  }

  /* 660px: minimal browser styling */
  @container (max-width: 660px) {
    .browser-chrome {
      height: 28px;
    }
    .browser-chrome .stoplight {
      top: 8px;
      left: 8px;
    }
    .url-bar {
      top: 4px;
      height: 18px;
      width: 55%;
    }
    .url-text {
      font-size: 7px;
    }
    .loading-spinner {
      top: 6px;
      right: 8px;
      width: 12px;
      height: 12px;
    }
    .browser-content {
      padding: 6px;
      gap: 5px;
    }
    .page-layout {
      gap: 5px;
    }
    .layout-body {
      gap: 5px;
    }
    .layout-sidebar {
      width: 60px;
      padding: 6px;
      gap: 5px;
    }
    .layout-main {
      padding: 6px;
      gap: 5px;
    }
  }

  /* 620px: very compact browser */
  @container (max-width: 620px) {
    .layout-sidebar {
      width: 50px;
      padding: 5px;
    }
    .layout-main {
      padding: 5px;
    }
    .layout-header,
    .layout-footer {
      height: 24px;
    }
    .page-header {
      height: 18px;
    }
    .page-footer {
      height: 25px;
    }
    .sidebar-block:first-child {
      height: 100px;
    }
    .sidebar-block:last-child {
      height: 40px;
    }
  }

  /* Also reduce layout panel chrome at smaller widths */
  @container (max-width: 700px) {
    .layout-chrome {
      height: 26px;
    }
    .layout-chrome .stoplight {
      top: 8px;
    }
    .layout-file-tab {
      height: 26px;
      padding: 0 12px;
      left: 40px;
    }
  }

  @container (max-width: 660px) {
    .layout-chrome {
      height: 24px;
    }
    .layout-chrome .stoplight {
      top: 7px;
      left: 8px;
    }
    .layout-file-tab {
      height: 24px;
      padding: 0 10px;
      left: 35px;
    }
    .layout-file-tab .tab-name {
      font-size: 8px;
    }
    .layout-panel-content {
      padding: 10px;
      gap: 10px;
    }
    .layout-regions-tag {
      font-size: 10px;
    }
    .region-label {
      font-size: 9px;
      margin-bottom: 4px;
    }
    .layout-region {
      padding: 8px 10px;
    }
    .layout-render-children {
      padding: 6px 10px;
    }
    .render-children-text {
      font-size: 10px;
    }
  }

  /* Also reduce CLI chrome at smaller widths */
  @container (max-width: 700px) {
    .cli-chrome {
      height: 26px;
    }
    .cli-chrome .stoplight {
      top: 8px;
    }
  }

  @container (max-width: 660px) {
    .cli-chrome {
      height: 24px;
    }
    .cli-chrome .stoplight {
      top: 7px;
      left: 8px;
    }
  }

  :global(.dark) .caption {
    @apply text-slate-50;
  }

  .caption-line {
    display: block; /* Each line on its own row */
  }

  .caption-phrase {
    display: inline; /* Stay on same line */
  }

  .caption .highlight-indigo {
    @apply text-indigo-600;
    display: inline-block; /* Required for transform */
  }

  :global(.dark) .caption .highlight-indigo {
    @apply text-indigo-400;
  }

  /* === BROWSER FRAME === */
  .browser-frame {
    position: absolute;
    top: 20%; /* 100/500 */
    left: 27.08%; /* 243.75/900 (centered) */
    width: 45.83%; /* 412.5/900 */
    height: 74%; /* 370/500 */
    @apply bg-white dark:bg-slate-900 border-[5px] border-indigo-200 dark:border-indigo-800;
    border-radius: 10px;
    box-shadow:
      0 8px 16px rgba(0, 0, 0, 0.15),
      0 13px 27px rgba(50, 50, 93, 0.2);
    overflow: hidden;
    visibility: hidden; /* Hidden until GSAP animates it in */
  }

  :global(.dark) .browser-frame {
    box-shadow:
      0 8px 16px rgba(0, 0, 0, 0.4),
      0 13px 27px rgba(50, 50, 93, 0.3);
  }

  /* === CLI FRAME (Terminal style - matches browser) === */
  .cli-frame {
    position: absolute;
    top: 20%; /* 100/500 - same as browser */
    left: 2.78%; /* 25/900 */
    width: 45.83%; /* 412.5/900 */
    height: 74%; /* 370/500 - same as browser */
    @apply bg-slate-50 dark:bg-slate-900 border-[5px] border-indigo-200 dark:border-indigo-800;
    border-radius: 10px;
    box-shadow:
      0 8px 16px rgba(0, 0, 0, 0.15),
      0 13px 27px rgba(50, 50, 93, 0.2);
    overflow: hidden;
    visibility: hidden; /* Hidden until GSAP animates it in */
  }

  :global(.dark) .cli-frame {
    box-shadow:
      0 8px 16px rgba(0, 0, 0, 0.4),
      0 13px 27px rgba(50, 50, 93, 0.3);
  }

  /* CLI chrome - 30px tall with stoplight */
  .cli-chrome {
    position: relative;
    height: 30px;
    @apply bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700;
  }

  .cli-chrome .stoplight {
    position: absolute;
    top: 10px;
    left: 12px;
  }

  /* CLI content area */
  .cli-content {
    padding: 16px;
    height: calc(370px - 30px);
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      monospace;
    font-size: 12px;
  }

  .cli-command-line {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .cli-prompt-icon {
    @apply text-indigo-600 dark:text-indigo-400;
    flex-shrink: 0;
  }

  .cli-typed {
    @apply text-slate-800 dark:text-slate-200;
    font-size: 11.5px;
    white-space: nowrap;
  }

  .cli-cursor {
    @apply text-indigo-600 dark:text-indigo-400;
  }

  /* Highlight for argument swap animation */
  .cli-arg-highlight {
    @apply bg-indigo-600/30 dark:bg-indigo-400/30;
    border-radius: 2px;
    padding: 0 2px;
  }

  /* === CLI OUTPUT (Wizard Flow) === */
  .cli-output-container {
    margin-top: 12px;
    height: 280px;
    overflow: hidden;
    position: relative;
    opacity: 0; /* Hidden until GSAP reveals */
  }

  .cli-line {
    font-size: 12px;
    line-height: 1.4;
    white-space: nowrap;
    opacity: 0; /* Hidden initially, GSAP reveals */
    @apply text-slate-700 dark:text-slate-300;
  }

  .cli-border {
    @apply text-slate-400 dark:text-slate-600;
  }

  .cli-header-line {
    font-weight: 600;
    padding-bottom: 8px;
    opacity: 0; /* Hidden until GSAP reveals */
  }

  /* Diamond indicator */
  .diamond {
    margin-right: 4px;
    @apply text-indigo-500 dark:text-indigo-400;
  }

  .cli-check {
    @apply text-green-600 dark:text-green-400;
    margin-right: 4px;
  }

  .cli-done-line {
    font-weight: 600;
    @apply text-green-600 dark:text-green-400;
  }

  /* === Skeleton CLI Elements === */
  .cli-skeleton-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
    opacity: 0;
    font-size: 12px;
  }

  .cli-skeleton-bar {
    height: 10px;
    border-radius: 4px;
    @apply bg-slate-300 dark:bg-slate-600;
    position: relative;
    overflow: hidden;
  }

  /* Shimmer effect - only when .shimmering class is present (added via JavaScript) */
  :global(.cli-skeleton-bar.shimmering)::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(99, 102, 241, 0.5) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: skeleton-shimmer 0.8s ease-in-out infinite;
  }

  @keyframes skeleton-shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .cli-generating {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
    opacity: 0;
    font-size: 12px;
  }

  .generating-text {
    @apply text-indigo-600 dark:text-indigo-400;
    font-weight: 500;
    background: linear-gradient(
      90deg,
      currentColor 0%,
      rgba(99, 102, 241, 0.5) 50%,
      currentColor 100%
    );
    background-size: 200% 100%;
    background-position: 0% 0;
    -webkit-background-clip: text;
    background-clip: text;
  }

  .cli-files-simple {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 0;
  }

  .cli-file-count {
    @apply text-slate-600 dark:text-slate-300;
    font-size: 12px;
  }

  /* Browser chrome */
  .browser-chrome {
    position: relative;
    height: 40px;
    @apply bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700;
  }

  /* Stoplight buttons - small like Phase 1 */
  .stoplight {
    position: absolute;
    top: 12px;
    left: 12px;
    display: flex;
    gap: 3px;
  }

  .stoplight-btn {
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }

  .stoplight-btn.red {
    @apply bg-red-500;
  }
  .stoplight-btn.yellow {
    @apply bg-amber-500;
  }
  .stoplight-btn.green {
    @apply bg-green-500;
  }

  /* URL bar - subtle background */
  .url-bar {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 24px;
    @apply bg-slate-100 dark:bg-slate-700;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .url-text {
    font-size: 10px;
    @apply text-slate-500 dark:text-slate-400 font-mono;
  }

  /* URL bar active/focus state */
  .url-bar.active {
    @apply bg-white dark:bg-slate-600;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.4);
  }

  /* Loading spinner in chrome */
  .loading-spinner {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 16px;
    height: 16px;
    @apply text-indigo-500 dark:text-indigo-400;
    opacity: 0; /* Hidden until GSAP reveals */
  }

  /* Mouse cursor for interaction animation */
  .mouse-cursor {
    position: absolute;
    z-index: 50;
    pointer-events: none;
    @apply text-slate-700 dark:text-slate-300;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    opacity: 0; /* Hidden until GSAP reveals */
  }

  /* Browser content */
  .browser-content {
    padding: 12px;
    height: calc(100% - 40px);
    display: flex;
    flex-direction: column;
    gap: 10px;
    @apply bg-slate-50 dark:bg-slate-800/50;
    overflow: hidden;
  }

  /* Page layout wrapper - wipes down from top */
  .page-layout {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    /* clip-path controlled by GSAP for wipe effect */
  }

  /* Layout header (hardcoded in layout) */
  .layout-header {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 30px;
    border-radius: 6px;
    @apply bg-slate-200 dark:bg-slate-700;
  }

  /* Body: sidebar + main */
  .layout-body {
    display: flex;
    gap: 10px;
    flex: 1;
  }

  /* Sidebar */
  .layout-sidebar {
    width: 80px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    border-radius: 6px;
    @apply bg-slate-200 dark:bg-slate-700;
  }

  .sidebar-block {
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    @apply bg-slate-300 dark:bg-slate-600;
  }

  .sidebar-block:first-child {
    height: 125px;
  }

  .sidebar-block:last-child {
    height: 55px;
  }

  /* Main content area */
  .layout-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    border-radius: 6px;
    @apply bg-slate-200 dark:bg-slate-700;
  }

  .page-header {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 25px;
    border-radius: 4px;
    @apply bg-slate-300 dark:bg-slate-600;
  }

  .main-content {
    position: relative;
    overflow: hidden;
    flex: 1;
    border-radius: 4px;
    @apply bg-slate-300 dark:bg-slate-600;
  }

  .page-footer {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 35px;
    border-radius: 4px;
    @apply bg-slate-300 dark:bg-slate-600;
  }

  /* Layout footer (hardcoded in layout) */
  .layout-footer {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 34px;
    border-radius: 6px;
    @apply bg-slate-200 dark:bg-slate-700;
  }

  /* === FILL OVERLAYS (for bottom-to-top bucket fill animation) === */
  .fill-overlay {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    /* clip-path controlled by GSAP - starts at inset(100% 0 0 0) hidden from top */
    /* reveals to inset(0% 0 0 0) from bottom up like a bucket filling */
  }

  .fill-indigo {
    @apply bg-indigo-500;
  }

  .fill-purple {
    @apply bg-purple-400;
  }

  .fill-blue {
    @apply bg-blue-400;
  }

  .fill-amber {
    @apply bg-amber-500;
  }

  .fill-green {
    @apply bg-lime-600;
  }

  /* === LAYOUT PANEL (CLI-style container with floating file tab) === */
  .layout-panel {
    position: absolute;
    top: 20%; /* 100/500 - same as browser */
    left: 51.39%; /* 462.5/900 */
    width: 45.83%; /* 412.5/900 */
    height: 74%; /* 370/500 - same as browser */
    @apply bg-slate-50 dark:bg-slate-900 border-[5px] border-indigo-200 dark:border-indigo-800;
    border-radius: 10px;
    box-shadow:
      0 8px 16px rgba(0, 0, 0, 0.15),
      0 13px 27px rgba(50, 50, 93, 0.2);
    overflow: hidden;
    visibility: hidden;
    opacity: 0;
    display: flex;
    flex-direction: column;
  }

  :global(.dark) .layout-panel {
    box-shadow:
      0 8px 16px rgba(0, 0, 0, 0.4),
      0 13px 27px rgba(50, 50, 93, 0.3);
  }

  /* Layout chrome - 30px tall with stoplight + floating tab */
  .layout-chrome {
    position: relative;
    height: 30px;
    @apply bg-slate-100 dark:bg-slate-800;
  }

  .layout-chrome .stoplight {
    position: absolute;
    top: 10px;
    left: 12px;
  }

  /* Floating file tab inside chrome - matches Phase 1 FileFrame styling */
  .layout-file-tab {
    position: absolute;
    left: 50px;
    bottom: 0;
    height: 30px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    @apply bg-slate-50 dark:bg-slate-900;
    @apply border-l border-r border-slate-200 dark:border-slate-700;
  }

  /* Orange accent bar at top - using pseudoelement for clean squared edges */
  .layout-file-tab::after {
    content: "";
    position: absolute;
    top: 0;
    left: -1px;
    right: -1px;
    height: 3px;
    @apply bg-orange-600;
  }

  /* Pseudoelement to cover bottom and connect to content */
  .layout-file-tab::before {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 4px;
    @apply bg-slate-50;
  }

  :global(.dark) .layout-file-tab::before {
    @apply bg-slate-900;
  }

  .layout-file-tab .tab-name {
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      monospace;
    font-size: 11px;
    font-weight: 500;
    @apply text-slate-700 dark:text-slate-300;
    white-space: nowrap;
    padding-top: 3px; /* Offset for 3px top border to visually center */
  }

  .layout-panel-content {
    padding: 16px;
    flex: 1;
    min-height: 0; /* Allow flex shrinking */
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 15px;
    @apply border-t border-slate-200 dark:border-slate-700;
  }

  .layout-regions-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-height: 0; /* Allow shrinking */
    /* Visible from start - regions will fade in individually */
  }

  .layout-regions-tag {
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      monospace;
    font-size: 13px;
    font-weight: 500;
    @apply text-blue-600 dark:text-blue-400;
  }

  .layout-region {
    border-radius: 6px;
    padding: 10px 12px;
    opacity: 0;
    transform: translateY(8px);
    flex: 1;
    min-height: 0; /* Allow shrinking */
    overflow: hidden; /* Clip skeleton bars if needed */
    display: flex;
    flex-direction: column;
    justify-content: center; /* Centers content when skeleton is hidden */
  }

  /* Solid colors, no borders */
  .layout-region-header {
    @apply bg-purple-300 dark:bg-purple-400;
  }

  .layout-region-sidebar {
    @apply bg-blue-300 dark:bg-blue-400;
  }

  .layout-region-footer {
    @apply bg-amber-400 dark:bg-amber-500;
  }

  .region-label {
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      monospace;
    font-size: 11px;
    font-weight: 600;
    @apply text-white;
    display: block;
    margin-bottom: 6px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .region-skeleton {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .layout-region .skeleton-bar {
    height: 10px;
    border-radius: 3px;
    width: 70%;
    opacity: 0.7;
  }

  .layout-region .skeleton-bar.short {
    width: 50%;
  }

  .layout-region .skeleton-bar.medium {
    width: 60%;
  }

  /* Darker skeleton bars for contrast */
  .layout-region-header .skeleton-bar {
    @apply bg-purple-500 dark:bg-purple-600;
  }

  .layout-region-sidebar .skeleton-bar {
    @apply bg-blue-500 dark:bg-blue-600;
  }

  .layout-region-footer .skeleton-bar {
    @apply bg-amber-600 dark:bg-amber-700;
  }

  .layout-render-children {
    border-radius: 6px;
    padding: 8px 12px;
    text-align: center;
    @apply bg-slate-200 dark:bg-slate-700;
    transition: background-color 0.3s ease;
    flex-shrink: 0; /* Don't shrink, stay at natural height */
  }

  .layout-render-children.hydrated {
    @apply bg-lime-600 dark:bg-lime-600;
  }

  .layout-render-children.hydrated .render-children-text {
    @apply text-white;
  }

  .render-children-text {
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      monospace;
    font-size: 13px;
    font-weight: 600;
    @apply text-slate-500 dark:text-slate-400;
  }

  /* === IDLE STATE: Shimmer sweep effect ===
     Simple left-to-right shimmer on random boxes every 3-5 seconds */

  /* Shimmer overlay - sweeps left to right */
  .pulse-overlay {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    z-index: 5;
    opacity: 0;
    /* Wide, subtle shimmer band */
    background: linear-gradient(
      100deg,
      transparent 0%,
      transparent 20%,
      rgba(255, 255, 255, 0.08) 35%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.08) 65%,
      transparent 80%,
      transparent 100%
    );
  }

  /* === RESTART BUTTON (YouTube-style centered overlay) === */
  .restart-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
    @apply bg-slate-900/80 text-white;
    backdrop-filter: blur(4px);
    animation: fadeInRestart 0.4s ease-out;
  }

  .restart-button:hover {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.05);
  }

  .restart-button:active {
    transform: translate(-50%, -50%) scale(0.95);
  }

  :global(.dark) .restart-button {
    @apply bg-slate-100/80 text-slate-900;
  }

  @keyframes fadeInRestart {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    to {
      opacity: 0.6;
      transform: translate(-50%, -50%) scale(1);
    }
  }
</style>
