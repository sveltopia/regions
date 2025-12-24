<script lang="ts">
  /**
   * CliTerminal: Animated terminal component for CLI visualization
   *
   * Features:
   * - Typewriter text effect for commands
   * - Prompt/response display
   * - File output list with checkmarks
   * - GSAP-compatible refs for animation control
   */

  interface Props {
    /** Width of the terminal */
    width?: number;
    /** Height of the terminal */
    height?: number;
  }

  let { width = 460, height = 340 }: Props = $props();

  // Element refs for GSAP animation
  let terminalFrame: HTMLDivElement;
  let promptLine: HTMLDivElement;
  let commandText: HTMLSpanElement;
  let promptResponses: HTMLDivElement;
  let fileOutputs: HTMLDivElement;

  // Expose refs for parent component
  export function getRefs() {
    return {
      terminalFrame,
      promptLine,
      commandText,
      promptResponses,
      fileOutputs,
    };
  }
</script>

<div
  class="terminal-frame"
  bind:this={terminalFrame}
  style:width="{width}px"
  style:height="{height}px">
  <!-- Terminal header with stoplight buttons -->
  <div class="terminal-header">
    <div class="stoplight">
      <div class="stoplight-btn red"></div>
      <div class="stoplight-btn yellow"></div>
      <div class="stoplight-btn green"></div>
    </div>
    <span class="terminal-title">Terminal</span>
  </div>

  <!-- Terminal content area -->
  <div class="terminal-content">
    <!-- Command prompt line -->
    <div class="prompt-line" bind:this={promptLine}>
      <span class="prompt-symbol">$</span>
      <span class="command-text" bind:this={commandText}></span>
      <span class="cursor">|</span>
    </div>

    <!-- Interactive prompts and responses -->
    <div class="prompt-responses" bind:this={promptResponses}>
      <!-- Populated dynamically by GSAP -->
    </div>

    <!-- File output list -->
    <div class="file-outputs" bind:this={fileOutputs}>
      <!-- Populated dynamically by GSAP -->
    </div>
  </div>
</div>

<style>
  @reference "../../../app.css";

  .terminal-frame {
    @apply bg-slate-900 rounded-lg;
    border: 1px solid rgba(100, 116, 139, 0.3);
    box-shadow:
      0 8px 16px rgba(0, 0, 0, 0.4),
      0 13px 27px rgba(50, 50, 93, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    opacity: 0; /* Hidden initially, GSAP animates in */
  }

  .terminal-header {
    height: 32px;
    @apply bg-slate-800/80;
    border-bottom: 1px solid rgba(100, 116, 139, 0.2);
    display: flex;
    align-items: center;
    padding: 0 12px;
    gap: 8px;
  }

  .stoplight {
    display: flex;
    gap: 6px;
  }

  .stoplight-btn {
    width: 12px;
    height: 12px;
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

  .terminal-title {
    @apply text-slate-400 text-xs font-medium;
    margin-left: auto;
    margin-right: auto;
  }

  .terminal-content {
    flex: 1;
    padding: 16px;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
    font-size: 13px;
    line-height: 1.6;
    @apply text-slate-300;
    overflow-y: auto;
  }

  .prompt-line {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .prompt-symbol {
    @apply text-green-400 font-bold;
  }

  .command-text {
    @apply text-slate-100;
  }

  .cursor {
    @apply text-green-400;
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  .prompt-responses {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
    opacity: 0; /* Hidden initially */
  }

  .file-outputs {
    display: flex;
    flex-direction: column;
    gap: 4px;
    opacity: 0; /* Hidden initially */
  }

  /* Child element styles (for dynamically added content) */
  :global(.terminal-content .prompt-item) {
    display: flex;
    gap: 8px;
  }

  :global(.terminal-content .prompt-label) {
    @apply text-indigo-400;
  }

  :global(.terminal-content .prompt-value) {
    @apply text-slate-100;
  }

  :global(.terminal-content .file-item) {
    display: flex;
    align-items: center;
    gap: 8px;
    @apply text-slate-400;
  }

  :global(.terminal-content .file-check) {
    @apply text-green-400;
  }

  :global(.terminal-content .file-path) {
    @apply text-slate-300;
  }

  :global(.terminal-content .file-success) {
    margin-top: 8px;
    @apply text-green-400 font-medium;
  }
</style>
