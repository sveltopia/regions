<script lang="ts">
  import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-svelte';
  import type { GSAPTimeline } from './types';

  interface Props {
    timeline: GSAPTimeline | null;
    frameLabels?: string[];
    show?: boolean;
    onRestart?: () => void;
  }

  let { timeline, frameLabels = [], show = true, onRestart }: Props = $props();

  let isPlaying = $state(false);
  let progress = $state(0);
  let currentFrame = $state(0);

  // Update progress from timeline
  $effect(() => {
    if (!timeline) return;

    const updateProgress = () => {
      progress = timeline.progress() * 100;

      // Sync isPlaying state with timeline's actual state
      isPlaying = timeline.isActive();

      // Determine current frame based on timeline labels
      if (frameLabels.length > 0) {
        const labels = timeline.labels;
        let frame = 0;
        for (let i = 0; i < frameLabels.length; i++) {
          const labelTime = labels[frameLabels[i]];
          if (timeline.time() >= labelTime) {
            frame = i;
          }
        }
        currentFrame = frame;
      }
    };

    // Poll for updates while playing
    const interval = setInterval(updateProgress, 50);
    return () => clearInterval(interval);
  });

  function handlePlay() {
    if (!timeline) return;
    if (isPlaying) {
      timeline.pause();
    } else {
      timeline.play();
    }
    // isPlaying synced from timeline.isActive() in effect
  }

  function handleRestart() {
    if (!timeline) return;
    onRestart?.();
    timeline.restart();
    // isPlaying synced from timeline.isActive() in effect
  }

  function handleScrub(e: Event) {
    if (!timeline) return;
    const target = e.target as HTMLInputElement;
    const value = parseFloat(target.value) / 100;
    timeline.progress(value);
    timeline.pause();
    // isPlaying synced from timeline.isActive() in effect
  }

  function jumpToFrame(frameIndex: number) {
    if (!timeline || !frameLabels[frameIndex]) return;
    timeline.seek(frameLabels[frameIndex]);
    timeline.pause();
    currentFrame = frameIndex;
    // isPlaying synced from timeline.isActive() in effect
  }

  function prevFrame() {
    if (currentFrame > 0) {
      jumpToFrame(currentFrame - 1);
    }
  }

  function nextFrame() {
    if (currentFrame < frameLabels.length - 1) {
      jumpToFrame(currentFrame + 1);
    }
  }
</script>

{#if show}
  <div class="controls">
    <div class="controls-row">
      <!-- Playback buttons -->
      <div class="button-group">
        <button onclick={handleRestart} title="Restart" class="control-btn">
          <RotateCcw size={16} />
        </button>
        <button
          onclick={handlePlay}
          title={isPlaying ? 'Pause' : 'Play'}
          class="control-btn primary"
        >
          {#if isPlaying}
            <Pause size={16} />
          {:else}
            <Play size={16} />
          {/if}
        </button>
      </div>

      <!-- Frame navigation -->
      <div class="frame-nav">
        <button onclick={prevFrame} disabled={currentFrame === 0} class="control-btn small">
          <ChevronLeft size={14} />
        </button>
        <span class="frame-indicator">Scene {currentFrame + 1}</span>
        <button
          onclick={nextFrame}
          disabled={currentFrame >= frameLabels.length - 1}
          class="control-btn small"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <!-- Progress indicator -->
      <span class="progress-text">{Math.round(progress)}%</span>
    </div>

    <!-- Scrubber -->
    <div class="scrubber-row">
      <input
        type="range"
        min="0"
        max="100"
        step="0.1"
        value={progress}
        oninput={handleScrub}
        class="scrubber"
      />
    </div>

    <!-- Scene labels (1-indexed for user display) -->
    {#if frameLabels.length > 0}
      <div class="frame-labels">
        {#each frameLabels as label, i (label)}
          <button
            onclick={() => jumpToFrame(i)}
            class="frame-label"
            class:active={currentFrame === i}
            title={label}
          >
            {i + 1}
          </button>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style>
  @reference "../../../app.css";

  .controls {
    position: absolute;
    bottom: -70px;
    left: 50%;
    transform: translateX(-50%);
    @apply rounded-t-lg bg-slate-800/95 px-4 py-3 backdrop-blur-sm;
    @apply border border-b-0 border-slate-700;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 320px;
  }

  .controls-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .button-group {
    display: flex;
    gap: 4px;
  }

  .control-btn {
    @apply bg-slate-700 text-slate-200 hover:bg-slate-600;
    @apply rounded-md p-2 transition-colors;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;

    &:disabled {
      @apply cursor-not-allowed opacity-40;
    }

    &.primary {
      @apply bg-indigo-600 hover:bg-indigo-500;
    }

    &.small {
      @apply p-1;
    }
  }

  .frame-nav {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .frame-indicator {
    @apply font-mono text-xs text-slate-300;
    min-width: 60px;
    text-align: center;
  }

  .progress-text {
    @apply font-mono text-xs text-slate-400;
    margin-left: auto;
  }

  .scrubber-row {
    width: 100%;
  }

  .scrubber {
    width: 100%;
    height: 6px;
    @apply rounded-full bg-slate-700;
    appearance: none;
    cursor: pointer;

    &::-webkit-slider-thumb {
      appearance: none;
      width: 14px;
      height: 14px;
      @apply rounded-full bg-indigo-500;
      cursor: grab;

      &:active {
        cursor: grabbing;
        @apply bg-indigo-400;
      }
    }

    &::-moz-range-thumb {
      width: 14px;
      height: 14px;
      @apply rounded-full bg-indigo-500;
      border: none;
      cursor: grab;
    }
  }

  .frame-labels {
    display: flex;
    justify-content: space-between;
    gap: 4px;
  }

  .frame-label {
    @apply font-mono text-xs text-slate-400;
    @apply rounded bg-slate-700/50 px-2 py-1 hover:bg-slate-600;
    border: none;
    cursor: pointer;
    flex: 1;
    text-align: center;

    &.active {
      @apply bg-indigo-600 text-white;
    }
  }
</style>
