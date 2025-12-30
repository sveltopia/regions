<script lang="ts">
  /**
   * MobileAnimation.svelte
   *
   * Simplified mobile version of the regions animation.
   * Shows one frame at a time with card shuffle transitions.
   *
   * Scene 1: Browser (problem - single slot)
   * Scene 2: CLI → Layout Panel (solution - region generation)
   * Scene 3: Browser (payoff - all regions filled)
   */
  import { browser, dev } from '$app/environment';
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { RotateCcw } from 'lucide-svelte';
  import AnimationControls from './AnimationControls.svelte';
  import type { GSAPTimeline } from './types';

  // Props
  interface Props {
    devMode?: boolean;
    autoPlay?: boolean;
  }
  let { devMode = dev, autoPlay = true }: Props = $props();

  // Timeline
  let timeline: GSAPTimeline | null = $state(null);

  // State
  let showRestartButton = $state(false);
  let prefersReducedMotion = $state(false);
  let animationSeen = $state(false);

  // Storage key (shared with desktop)
  const STORAGE_KEY = 'regions-animation-viewed';

  // Frame labels for timeline
  const FRAME_LABELS = ['scene1', 'scene2-cli', 'scene2-layout', 'scene3'] as const;

  // === DOM REFS ===

  // Caption refs (three separate captions with wipe animation)
  let captionRefs = $state({
    caption1: null as HTMLDivElement | null,
    caption1Line: null as HTMLSpanElement | null,
    caption2: null as HTMLDivElement | null,
    caption2Line: null as HTMLSpanElement | null,
    caption3: null as HTMLDivElement | null,
    caption3Line: null as HTMLSpanElement | null
  });

  // Browser frame refs
  let browserRefs = $state({
    frame: null as HTMLDivElement | null,
    urlBar: null as HTMLDivElement | null,
    urlText: null as HTMLSpanElement | null,
    pageLayout: null as HTMLDivElement | null
  });

  // Browser content refs (for fill animations)
  let layoutRefs = $state({
    header: null as HTMLDivElement | null,
    sidebar: null as HTMLDivElement | null,
    footer: null as HTMLDivElement | null
  });

  let contentRefs = $state({
    pageHeader: null as HTMLDivElement | null,
    mainContent: null as HTMLDivElement | null,
    pageFooter: null as HTMLDivElement | null,
    sidebarBlock1: null as HTMLDivElement | null,
    sidebarBlock2: null as HTMLDivElement | null
  });

  let fillRefs = $state({
    layoutHeader: null as HTMLDivElement | null,
    sidebarBlock1: null as HTMLDivElement | null,
    layoutFooter: null as HTMLDivElement | null,
    pageHeader: null as HTMLDivElement | null,
    mainContent: null as HTMLDivElement | null,
    pageFooter: null as HTMLDivElement | null,
    sidebarBlock2: null as HTMLDivElement | null
  });

  // CLI frame refs
  let cliRefs = $state({
    frame: null as HTMLDivElement | null,
    text: null as HTMLSpanElement | null,
    outputContainer: null as HTMLDivElement | null,
    header: null as HTMLDivElement | null,
    skeleton1: null as HTMLDivElement | null,
    skeleton2: null as HTMLDivElement | null,
    skeleton3: null as HTMLDivElement | null,
    generating: null as HTMLDivElement | null,
    files: null as HTMLDivElement | null,
    done: null as HTMLDivElement | null
  });

  // Layout panel refs
  let layoutPanelRefs = $state({
    panel: null as HTMLDivElement | null,
    content: null as HTMLDivElement | null,
    regionsWrapper: null as HTMLDivElement | null,
    regionsTag: null as HTMLDivElement | null,
    regionHeader: null as HTMLDivElement | null,
    regionSidebar: null as HTMLDivElement | null,
    regionFooter: null as HTMLDivElement | null,
    renderChildren: null as HTMLDivElement | null
  });

  // Pulse/shimmer overlay refs
  let pulseRefs = $state({
    green: null as HTMLDivElement | null,
    purple: null as HTMLDivElement | null,
    blue: null as HTMLDivElement | null,
    amber: null as HTMLDivElement | null
  });

  // === CAPTIONS ===
  // Caption text is in the HTML - animated with clip-path wipe

  // === LIFECYCLE ===
  onMount(() => {
    if (!browser) return;

    // Check reduced motion preference
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Check if animation was previously viewed
    animationSeen = localStorage.getItem(STORAGE_KEY) === 'true';

    if (animationSeen) {
      setFinalState();
    } else {
      setInitialStates();
    }

    // Create timeline
    const tl = gsap.timeline({
      paused: true,
      onComplete: onAnimationComplete
    });

    buildTimeline(tl);
    timeline = tl;

    // Auto-play for first-time visitors
    if (autoPlay && !animationSeen) {
      gsap.delayedCall(0.5, () => {
        tl.play();
      });
    }

    return () => {
      tl.kill();
    };
  });

  // === STATE FUNCTIONS ===

  function setInitialStates() {
    // Captions: first visible but text hidden (for fade), others hidden
    gsap.set(captionRefs.caption1, { opacity: 1, visibility: 'visible' });
    gsap.set(captionRefs.caption1Line, { opacity: 0 });
    gsap.set([captionRefs.caption2, captionRefs.caption3], { opacity: 0, visibility: 'visible' });
    gsap.set([captionRefs.caption2Line, captionRefs.caption3Line], { opacity: 0 });

    // All frames hidden initially
    gsap.set([browserRefs.frame, cliRefs.frame, layoutPanelRefs.panel], {
      opacity: 0,
      y: 50,
      visibility: 'visible'
    });

    // Browser page layout hidden
    gsap.set(browserRefs.pageLayout, { clipPath: 'inset(0 0 100% 0)' });

    // All fills hidden
    gsap.set(
      [
        fillRefs.layoutHeader,
        fillRefs.sidebarBlock1,
        fillRefs.layoutFooter,
        fillRefs.pageHeader,
        fillRefs.mainContent,
        fillRefs.pageFooter,
        fillRefs.sidebarBlock2
      ],
      { clipPath: 'inset(100% 0 0 0)' }
    );

    // CLI elements hidden
    gsap.set(cliRefs.outputContainer, { opacity: 0 });
    gsap.set([cliRefs.header, cliRefs.generating, cliRefs.files, cliRefs.done], { opacity: 0 });
    gsap.set([cliRefs.skeleton1, cliRefs.skeleton2, cliRefs.skeleton3], {
      opacity: 0,
      clipPath: 'inset(0 100% 0 0)'
    });
    if (cliRefs.text) cliRefs.text.innerHTML = '<span class="cli-cursor">▌</span>';

    // Layout panel regions hidden
    gsap.set(layoutPanelRefs.regionsWrapper, { opacity: 0 });
    gsap.set(layoutPanelRefs.regionsTag, { opacity: 0 });
    gsap.set(
      [layoutPanelRefs.regionHeader, layoutPanelRefs.regionSidebar, layoutPanelRefs.regionFooter],
      { opacity: 0, y: 10, scale: 0.95 }
    );
  }

  function setFinalState() {
    // Show final caption (caption 3), hide others
    gsap.set([captionRefs.caption1, captionRefs.caption2], { opacity: 0 });
    gsap.set(captionRefs.caption3, { opacity: 1, visibility: 'visible' });
    gsap.set(captionRefs.caption3Line, { opacity: 1 });

    // Show browser frame at final state
    gsap.set(browserRefs.frame, { opacity: 1, y: 0, visibility: 'visible' });
    gsap.set([cliRefs.frame, layoutPanelRefs.panel], { opacity: 0, visibility: 'hidden' });

    // Browser with URL and page visible
    if (browserRefs.urlText) browserRefs.urlText.textContent = 'regions.sveltopia.dev';
    gsap.set(browserRefs.pageLayout, { clipPath: 'inset(0 0 0% 0)' });

    // All region fills visible
    gsap.set(
      [fillRefs.mainContent, fillRefs.pageHeader, fillRefs.pageFooter, fillRefs.sidebarBlock2],
      { clipPath: 'inset(0% 0 0 0)' }
    );

    // Layout structure stays grey
    gsap.set([fillRefs.layoutHeader, fillRefs.sidebarBlock1, fillRefs.layoutFooter], {
      clipPath: 'inset(100% 0 0 0)'
    });

    showRestartButton = true;
    startIdleShimmer();
  }

  // === TIMELINE BUILDER ===

  function buildTimeline(tl: gsap.core.Timeline) {
    // Scene 1: Browser (the problem)
    tl.addLabel('scene1');

    // Caption 1 fades in
    tl.to(captionRefs.caption1Line, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    });

    // Browser bounces in with page already rendered
    tl.to(
      browserRefs.frame,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.4)'
      },
      '-=0.3'
    );

    // Show page layout
    tl.set(browserRefs.pageLayout, { clipPath: 'inset(0 0 0% 0)' }, '<');
    tl.set(browserRefs.urlText, { textContent: 'regions.sveltopia.dev' }, '<');

    // Green fill (render children)
    tl.to(
      fillRefs.mainContent,
      {
        clipPath: 'inset(0% 0 0 0)',
        duration: 0.4,
        ease: 'power2.out'
      },
      '+=0.15'
    );

    // Hold
    tl.to({}, { duration: 0.8 });

    // Scene 2a: CLI (transition from browser)
    tl.addLabel('scene2-cli');

    // Transition captions: fade out caption 1, fade in caption 2
    tl.to(captionRefs.caption1, { opacity: 0, duration: 0.2 });
    tl.set(captionRefs.caption2, { opacity: 1 });
    tl.to(captionRefs.caption2Line, { opacity: 1, duration: 0.3, ease: 'power2.out' });

    // Browser exits (card shuffle out)
    tl.to(browserRefs.frame, {
      opacity: 0,
      y: 30,
      rotate: -2,
      duration: 0.4,
      ease: 'power2.in'
    });

    // CLI bounces in
    tl.to(
      cliRefs.frame,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'back.out(1.4)'
      },
      '-=0.1'
    );

    // CLI typing animation
    tl.call(() => typeCliCommand(), [], '+=0.2');

    // Show output container
    tl.to(cliRefs.outputContainer, { opacity: 1, duration: 0.2 }, '+=0.8');

    // Header appears
    tl.to(cliRefs.header, { opacity: 1, duration: 0.15 });

    // Skeleton bars wipe in quickly
    tl.to([cliRefs.skeleton1, cliRefs.skeleton2, cliRefs.skeleton3], {
      opacity: 1,
      clipPath: 'inset(0 0% 0 0)',
      duration: 0.2,
      stagger: 0.05
    });

    // Generating text
    tl.to(cliRefs.generating, { opacity: 1, duration: 0.15 }, '+=0.1');
    tl.to(cliRefs.generating, { opacity: 0, duration: 0.15 }, '+=0.3');

    // Files created + done
    tl.to(cliRefs.files, { opacity: 1, duration: 0.15 });
    tl.to(cliRefs.done, { opacity: 1, duration: 0.15 }, '+=0.1');

    // Hold
    tl.to({}, { duration: 0.5 });

    // Scene 2b: Layout panel (card shuffle from CLI)
    tl.addLabel('scene2-layout');

    // CLI exits
    tl.to(cliRefs.frame, {
      opacity: 0,
      y: 30,
      rotate: 2,
      duration: 0.4,
      ease: 'power2.in'
    });

    // Layout panel bounces in
    tl.to(
      layoutPanelRefs.panel,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'back.out(1.4)'
      },
      '-=0.1'
    );

    // Show regions wrapper and tag
    tl.to(layoutPanelRefs.regionsWrapper, { opacity: 1, duration: 0.2 }, '+=0.2');
    tl.to(layoutPanelRefs.regionsTag, { opacity: 1, duration: 0.2 });

    // Regions cascade in
    tl.to(layoutPanelRefs.regionHeader, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: 'back.out(1.3)'
    });
    tl.to(
      layoutPanelRefs.regionSidebar,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.3)'
      },
      '-=0.15'
    );
    tl.to(
      layoutPanelRefs.regionFooter,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.3)'
      },
      '-=0.15'
    );

    // Hold (longer to let regions cascade settle)
    tl.to({}, { duration: 1.2 });

    // Scene 3: Browser with all regions
    tl.addLabel('scene3');

    // Transition captions: fade out caption 2, fade in caption 3
    // Start caption transition at same time as layout exit
    tl.to(captionRefs.caption2, { opacity: 0, duration: 0.3 });
    tl.set(captionRefs.caption3, { opacity: 1 }, '-=0.1');
    tl.to(captionRefs.caption3Line, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.1');

    // Layout panel exits (starts during caption transition)
    tl.to(
      layoutPanelRefs.panel,
      {
        opacity: 0,
        y: 30,
        rotate: -2,
        duration: 0.4,
        ease: 'power2.in'
      },
      '-=0.2'
    );

    // Reset browser rotation and bring it back
    tl.set(browserRefs.frame, { rotate: 0 });
    tl.to(
      browserRefs.frame,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'back.out(1.4)'
      },
      '-=0.1'
    );

    // All regions fill (no particles, just clip-path fills)
    tl.to(
      fillRefs.pageHeader,
      {
        clipPath: 'inset(0% 0 0 0)',
        duration: 0.3,
        ease: 'power2.out'
      },
      '+=0.2'
    );
    tl.to(
      fillRefs.sidebarBlock2,
      {
        clipPath: 'inset(0% 0 0 0)',
        duration: 0.3,
        ease: 'power2.out'
      },
      '-=0.15'
    );
    tl.to(
      fillRefs.pageFooter,
      {
        clipPath: 'inset(0% 0 0 0)',
        duration: 0.3,
        ease: 'power2.out'
      },
      '-=0.15'
    );

    // Hold at end
    tl.to({}, { duration: 0.5 });
  }

  // === CLI TYPING ===

  function typeCliCommand() {
    const command = 'npx @sveltopia/regions add';
    const arg = 'page-header';
    let charIndex = 0;
    let showingArg = false;

    const typeInterval = setInterval(() => {
      if (!cliRefs.text) {
        clearInterval(typeInterval);
        return;
      }

      if (charIndex < command.length) {
        cliRefs.text.innerHTML =
          command.slice(0, charIndex + 1) + '<span class="cli-cursor">▌</span>';
        charIndex++;
      } else if (!showingArg) {
        // Show the argument
        cliRefs.text.innerHTML =
          command + ' <span class="cli-arg">' + arg + '</span><span class="cli-cursor">▌</span>';
        showingArg = true;
        clearInterval(typeInterval);
      }
    }, 30);
  }

  // === IDLE SHIMMER ===

  let idleAnimationActive = false;
  let lastShimmerIndex = -1;

  function startIdleShimmer() {
    if (idleAnimationActive) return;
    idleAnimationActive = true;
    scheduleNextShimmer();
  }

  function stopIdleShimmer() {
    idleAnimationActive = false;
    lastShimmerIndex = -1;
  }

  function scheduleNextShimmer() {
    if (!idleAnimationActive) return;
    const delay = 2000 + Math.random() * 1000;
    setTimeout(() => {
      if (idleAnimationActive) {
        runShimmer();
        scheduleNextShimmer();
      }
    }, delay);
  }

  function runShimmer() {
    const boxes = [
      fillRefs.mainContent,
      fillRefs.pageHeader,
      fillRefs.pageFooter,
      fillRefs.sidebarBlock2
    ].filter(Boolean);

    if (boxes.length === 0) return;

    // Pick a random box, but never the same one twice in a row
    let index;
    do {
      index = Math.floor(Math.random() * boxes.length);
    } while (index === lastShimmerIndex && boxes.length > 1);
    lastShimmerIndex = index;

    const randomBox = boxes[index];
    if (!randomBox) return;

    const shimmer = randomBox.querySelector('.shimmer-overlay') as HTMLElement;
    if (!shimmer) return;

    gsap.fromTo(
      shimmer,
      { opacity: 1, x: '-100%' },
      { x: '100%', duration: 0.8, ease: 'power1.inOut' }
    );
  }

  // === COMPLETION & RESTART ===

  function onAnimationComplete() {
    localStorage.setItem(STORAGE_KEY, 'true');
    showRestartButton = true;
    startIdleShimmer();
  }

  function prepareRestart() {
    stopIdleShimmer();
    setInitialStates();
  }

  function handleRestart() {
    if (!timeline) return;
    showRestartButton = false;
    prepareRestart();
    timeline.restart();
  }
</script>

<!-- Hide for reduced motion -->
{#if !prefersReducedMotion}
  <div class="mobile-animation-container">
    <div class="mobile-animation-canvas">
      <!-- Captions (absolutely positioned, only one visible at a time) -->
      <div class="caption caption-1" bind:this={captionRefs.caption1}>
        <span class="caption-line" bind:this={captionRefs.caption1Line}
          ><span class="highlight-indigo">SvelteKit</span> gives us one place to render page content in
          a layout.</span
        >
      </div>
      <div class="caption caption-2" bind:this={captionRefs.caption2}>
        <span class="caption-line" bind:this={captionRefs.caption2Line}
          ><span class="highlight-indigo">Layout Regions</span> gives us as many as we need.</span
        >
      </div>
      <div class="caption caption-3" bind:this={captionRefs.caption3}>
        <span class="caption-line" bind:this={captionRefs.caption3Line}
          >One <span class="highlight-indigo">layout</span>, unlimited
          <span class="highlight-indigo">regions</span>.</span
        >
      </div>

      <!-- Frame stage (one frame visible at a time) -->
      <div class="frame-stage">
        <!-- === BROWSER FRAME === -->
        <div class="browser-frame" bind:this={browserRefs.frame}>
          <div class="browser-chrome">
            <div class="stoplight">
              <div class="stoplight-btn red"></div>
              <div class="stoplight-btn yellow"></div>
              <div class="stoplight-btn green"></div>
            </div>
            <div class="url-bar" bind:this={browserRefs.urlBar}>
              <span class="url-text" bind:this={browserRefs.urlText}></span>
            </div>
          </div>
          <div class="browser-content">
            <div class="page-layout" bind:this={browserRefs.pageLayout}>
              <div class="layout-header" bind:this={layoutRefs.header}>
                <div class="fill-overlay fill-indigo" bind:this={fillRefs.layoutHeader}></div>
              </div>
              <div class="layout-body">
                <div class="layout-sidebar" bind:this={layoutRefs.sidebar}>
                  <div class="sidebar-block" bind:this={contentRefs.sidebarBlock1}>
                    <div class="fill-overlay fill-indigo" bind:this={fillRefs.sidebarBlock1}></div>
                  </div>
                  <div class="sidebar-block" bind:this={contentRefs.sidebarBlock2}>
                    <div class="fill-overlay fill-blue" bind:this={fillRefs.sidebarBlock2}>
                      <div class="shimmer-overlay"></div>
                    </div>
                    <div class="pulse-overlay" bind:this={pulseRefs.blue}></div>
                  </div>
                </div>
                <div class="layout-main">
                  <div class="page-header-box" bind:this={contentRefs.pageHeader}>
                    <div class="fill-overlay fill-purple" bind:this={fillRefs.pageHeader}>
                      <div class="shimmer-overlay"></div>
                    </div>
                    <div class="pulse-overlay" bind:this={pulseRefs.purple}></div>
                  </div>
                  <div class="main-content" bind:this={contentRefs.mainContent}>
                    <div class="fill-overlay fill-green" bind:this={fillRefs.mainContent}>
                      <div class="shimmer-overlay"></div>
                    </div>
                    <div class="pulse-overlay" bind:this={pulseRefs.green}></div>
                  </div>
                  <div class="page-footer-box" bind:this={contentRefs.pageFooter}>
                    <div class="fill-overlay fill-amber" bind:this={fillRefs.pageFooter}>
                      <div class="shimmer-overlay"></div>
                    </div>
                    <div class="pulse-overlay" bind:this={pulseRefs.amber}></div>
                  </div>
                </div>
              </div>
              <div class="layout-footer" bind:this={layoutRefs.footer}>
                <div class="fill-overlay fill-indigo" bind:this={fillRefs.layoutFooter}></div>
              </div>
            </div>
          </div>
        </div>

        <!-- === CLI FRAME === -->
        <div class="cli-frame" bind:this={cliRefs.frame}>
          <div class="cli-chrome">
            <div class="stoplight">
              <div class="stoplight-btn red"></div>
              <div class="stoplight-btn yellow"></div>
              <div class="stoplight-btn green"></div>
            </div>
          </div>
          <div class="cli-content">
            <div class="cli-command-line">
              <svg
                class="cli-prompt-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
              <span class="cli-typed" bind:this={cliRefs.text}></span>
            </div>
            <div class="cli-output-container" bind:this={cliRefs.outputContainer}>
              <div class="cli-line cli-header-line" bind:this={cliRefs.header}>
                <span class="cli-border">┌</span>
                Sveltopia Regions
              </div>
              <div class="cli-skeleton-row" bind:this={cliRefs.skeleton1}>
                <span class="cli-border">│</span>
                <span class="diamond">◆</span>
                <div class="cli-skeleton-bar" style="width: 120px;"></div>
              </div>
              <div class="cli-skeleton-row" bind:this={cliRefs.skeleton2}>
                <span class="cli-border">│</span>
                <span class="diamond">◆</span>
                <div class="cli-skeleton-bar" style="width: 90px;"></div>
              </div>
              <div class="cli-skeleton-row" bind:this={cliRefs.skeleton3}>
                <span class="cli-border">│</span>
                <span class="diamond">◆</span>
                <div class="cli-skeleton-bar" style="width: 80px;"></div>
              </div>
              <div class="cli-generating" bind:this={cliRefs.generating}>
                <span class="cli-border">│</span>
                <span class="generating-text">Generating...</span>
              </div>
              <div class="cli-line cli-files-simple" bind:this={cliRefs.files}>
                <span class="cli-border">│</span>
                <span class="cli-check">-</span>
                <span class="cli-file-count">4 files created</span>
              </div>
              <div class="cli-line cli-done-line" bind:this={cliRefs.done}>
                <span class="cli-border">└</span>
                Done
              </div>
            </div>
          </div>
        </div>

        <!-- === LAYOUT PANEL === -->
        <div class="layout-panel" bind:this={layoutPanelRefs.panel}>
          <div class="layout-chrome">
            <div class="stoplight">
              <div class="stoplight-btn red"></div>
              <div class="stoplight-btn yellow"></div>
              <div class="stoplight-btn green"></div>
            </div>
            <div class="layout-file-tab">
              <span class="tab-name">+layout.svelte</span>
            </div>
          </div>
          <div class="layout-panel-content" bind:this={layoutPanelRefs.content}>
            <div class="layout-regions-wrapper" bind:this={layoutPanelRefs.regionsWrapper}>
              <div class="layout-regions-tag" bind:this={layoutPanelRefs.regionsTag}>
                &lt;LayoutRegions&gt;
              </div>
              <div
                class="layout-region layout-region-header"
                bind:this={layoutPanelRefs.regionHeader}
              >
                <span class="region-label">pageHeader</span>
              </div>
              <div
                class="layout-region layout-region-sidebar"
                bind:this={layoutPanelRefs.regionSidebar}
              >
                <span class="region-label">customSidebar</span>
              </div>
              <div
                class="layout-region layout-region-footer"
                bind:this={layoutPanelRefs.regionFooter}
              >
                <span class="region-label">pageFooter</span>
              </div>
            </div>
            <div class="layout-render-children hydrated" bind:this={layoutPanelRefs.renderChildren}>
              <span class="render-children-text">{`{@render children()}`}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Dev Controls -->
      <AnimationControls
        {timeline}
        frameLabels={[...FRAME_LABELS]}
        show={devMode}
        onRestart={prepareRestart}
      />

      <!-- Restart Button -->
      {#if showRestartButton && !devMode}
        <button class="restart-button" onclick={handleRestart} title="Replay animation">
          <RotateCcw size={24} strokeWidth={2} />
        </button>
      {/if}
    </div>
  </div>
{/if}

<style>
  @reference "../../../app.css";

  /* === CONTAINER === */
  .mobile-animation-container {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0 1rem 1rem;
  }

  .mobile-animation-canvas {
    width: 100%;
    max-width: 343px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  /* === CAPTIONS === */
  .caption {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    text-align: center;
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.4;
    @apply text-slate-700 dark:text-slate-200;
    visibility: visible;
  }

  /* Hide all captions initially (GSAP will show them) */
  .caption-1,
  .caption-2,
  .caption-3 {
    visibility: hidden;
  }

  /* Scene 4 caption closer to frame */
  .caption-3 {
    top: 20px;
  }

  .caption-line {
    display: block;
    opacity: 0;
  }

  .highlight-indigo {
    @apply text-indigo-600 dark:text-indigo-400;
  }

  /* === FRAME STAGE === */
  .frame-stage {
    width: 100%;
    height: 280px;
    position: relative;
    margin-top: 75px; /* Leave room for captions above */
  }

  /* === SHARED FRAME STYLES === */
  .browser-frame,
  .cli-frame,
  .layout-panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    @apply bg-white dark:bg-slate-800;
    @apply border-[5px] border-indigo-200 dark:border-indigo-800;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    visibility: hidden;
  }

  /* === BROWSER FRAME === */
  .browser-chrome {
    height: 32px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 10px;
    @apply bg-slate-100 dark:bg-slate-700;
  }

  .stoplight {
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

  .url-bar {
    flex: 1;
    height: 20px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    @apply bg-white dark:bg-slate-600;
  }

  .url-text {
    font-size: 10px;
    @apply font-mono text-slate-500 dark:text-slate-300;
  }

  .browser-content {
    height: calc(100% - 32px);
    padding: 10px;
    @apply bg-slate-50 dark:bg-slate-900;
  }

  /* === PAGE LAYOUT (inside browser) === */
  .page-layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
    border-radius: 6px;
    overflow: hidden;
  }

  .layout-header,
  .layout-footer {
    height: 20px;
    border-radius: 4px;
    position: relative;
    @apply bg-slate-200 dark:bg-slate-700;
  }

  .layout-body {
    flex: 1;
    display: flex;
    gap: 6px;
    min-height: 0;
  }

  .layout-sidebar {
    width: 50px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .sidebar-block {
    flex: 1;
    border-radius: 4px;
    position: relative;
    @apply bg-slate-200 dark:bg-slate-700;
  }

  .layout-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .page-header-box,
  .page-footer-box {
    height: 28px;
    border-radius: 4px;
    position: relative;
    @apply bg-slate-200 dark:bg-slate-700;
  }

  .main-content {
    flex: 1;
    border-radius: 4px;
    position: relative;
    @apply bg-slate-200 dark:bg-slate-700;
  }

  /* === FILL OVERLAYS === */
  .fill-overlay {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    clip-path: inset(100% 0 0 0);
  }

  .fill-green {
    @apply bg-green-500;
  }
  .fill-purple {
    @apply bg-purple-500;
  }
  .fill-blue {
    @apply bg-blue-500;
  }
  .fill-amber {
    @apply bg-amber-500;
  }
  .fill-indigo {
    @apply bg-indigo-500/30;
  }

  /* === SHIMMER === */
  .shimmer-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%
    );
    opacity: 0;
    transform: translateX(-100%);
  }

  /* === CLI FRAME === */
  .cli-chrome {
    height: 28px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    @apply bg-slate-800 dark:bg-slate-900;
  }

  .cli-content {
    height: calc(100% - 28px);
    padding: 10px;
    font-family: ui-monospace, monospace;
    font-size: 11px;
    @apply bg-slate-900 text-slate-200;
  }

  .cli-command-line {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
  }

  .cli-prompt-icon {
    @apply text-green-400;
    flex-shrink: 0;
  }

  .cli-typed {
    @apply text-slate-200;
  }

  :global(.cli-cursor) {
    @apply text-green-400;
    animation: blink 1s step-end infinite;
  }

  :global(.cli-arg) {
    @apply text-cyan-400;
  }

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }

  .cli-output-container {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .cli-line {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .cli-border {
    @apply text-slate-600;
  }

  .cli-header-line {
    @apply text-indigo-400;
    font-weight: 600;
  }

  .cli-skeleton-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .diamond {
    @apply text-cyan-400;
    font-size: 10px;
  }

  .cli-skeleton-bar {
    height: 8px;
    border-radius: 4px;
    @apply bg-slate-700;
  }

  .cli-generating {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .generating-text {
    @apply text-yellow-400;
  }

  .cli-check {
    @apply text-green-400;
  }

  .cli-file-count {
    @apply text-slate-400;
  }

  .cli-done-line {
    @apply text-green-400;
    font-weight: 600;
  }

  /* === LAYOUT PANEL === */
  .layout-chrome {
    height: 28px;
    position: relative;
    @apply bg-slate-100 dark:bg-slate-700;
    @apply border-b border-slate-200 dark:border-slate-600;
  }

  .layout-chrome .stoplight {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .layout-file-tab {
    position: absolute;
    left: 35px;
    bottom: 0;
    height: 24px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    @apply bg-slate-50 dark:bg-slate-800;
    @apply border-r border-l border-slate-200 dark:border-slate-600;
  }

  /* Orange accent bar at top of tab */
  .layout-file-tab::after {
    content: '';
    position: absolute;
    top: 0;
    left: -1px;
    right: -1px;
    height: 2px;
    @apply bg-orange-500;
  }

  /* Cover bottom border to connect with content */
  .layout-file-tab::before {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    @apply bg-slate-50;
  }

  :global(.dark) .layout-file-tab::before {
    @apply bg-slate-800;
  }

  .tab-name {
    font-size: 9px;
    @apply font-mono text-slate-600 dark:text-slate-300;
  }

  .layout-panel-content {
    height: calc(100% - 28px);
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    @apply bg-slate-50 dark:bg-slate-800;
  }

  .layout-regions-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .layout-regions-tag {
    font-size: 10px;
    @apply font-mono text-indigo-600 dark:text-indigo-400;
  }

  .layout-region {
    flex: 1;
    padding: 8px 10px;
    border-radius: 6px;
    display: flex;
    align-items: center;
  }

  .layout-region-header {
    @apply bg-purple-500;
  }
  .layout-region-sidebar {
    @apply bg-blue-500;
  }
  .layout-region-footer {
    @apply bg-amber-500;
  }

  .region-label {
    font-size: 10px;
    font-weight: 600;
    @apply text-white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .layout-render-children {
    padding: 6px 10px;
    border-radius: 6px;
    text-align: center;
    flex-shrink: 0;
    @apply bg-green-500;
  }

  .layout-render-children.hydrated {
    @apply bg-green-500;
  }

  .render-children-text {
    font-size: 10px;
    @apply font-mono text-white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  /* === RESTART BUTTON === */
  .restart-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    @apply bg-slate-800/90 text-white;
  }

  .restart-button:hover {
    @apply bg-slate-700;
    transform: translate(-50%, -50%) scale(1.05);
  }

  :global(.dark) .restart-button {
    @apply bg-slate-200/90 text-slate-800;
  }

  :global(.dark) .restart-button:hover {
    @apply bg-slate-100;
  }
</style>
