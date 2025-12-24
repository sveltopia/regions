<script lang="ts">
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Copy, Check } from "@lucide/svelte";
  import { codeToHtml } from "shiki";
  import sveltopiaPastel from "$lib/themes/sveltopia-pastel.json";

  interface Props {
    code: string;
    language?: string;
    filename?: string;
    showLineNumbers?: boolean;
  }

  let {
    code,
    language = "typescript",
    filename,
    showLineNumbers = false,
  }: Props = $props();

  let highlightedCode = $state("");
  let copied = $state(false);

  onMount(async () => {
    // Highlight code with our custom Sveltopia Pastel theme
    highlightedCode = await codeToHtml(code, {
      lang: language,
      theme: sveltopiaPastel as any,
      transformers: showLineNumbers
        ? [
            {
              line(node, line) {
                node.properties.class = `line line-${line}`;
              },
            },
          ]
        : [],
    });
  });

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2000);
  }
</script>

<div
  class="code-viewer not-prose overflow-hidden rounded-lg border border-slate-700 bg-slate-900">
  <!-- Header with filename and copy button -->
  <div
    class="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-3 py-2 md:px-4">
    <div class="flex items-center gap-2">
      {#if filename}
        <span class="font-mono text-xs text-slate-400 md:text-sm truncate">{filename}</span>
      {:else}
        <span class="font-mono text-xs text-slate-400 md:text-sm">{language}</span>
      {/if}
    </div>
    <Button
      variant="ghost"
      size="sm"
      onclick={copyCode}
      class="h-8 px-2 text-slate-300 hover:text-slate-100 hover:bg-slate-700 cursor-pointer shrink-0">
      {#if copied}
        <Check class="h-4 w-4" />
        <span class="ml-1 hidden text-xs sm:inline">Copied!</span>
      {:else}
        <Copy class="h-4 w-4" />
        <span class="ml-1 hidden text-xs sm:inline">Copy</span>
      {/if}
    </Button>
  </div>

  <!-- Code content -->
  <div class="overflow-x-auto">
    {#if highlightedCode}
      <div class="shiki-wrapper">
        {@html highlightedCode}
      </div>
    {:else}
      <div class="flex items-center justify-center p-8">
        <span class="text-sm text-muted-foreground">Loading...</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .shiki-wrapper :global(pre) {
    margin: 0;
    padding: 1rem 0.75rem;
    background: transparent !important;
    overflow-x: auto;
    line-height: 1.5;
  }

  @media (min-width: 768px) {
    .shiki-wrapper :global(pre) {
      padding: 2rem 1rem;
    }
  }

  .shiki-wrapper :global(code) {
    font-family: "Menlo", "Monaco", "Courier New", monospace;
    font-size: 0.75rem;
    display: block;
  }

  @media (min-width: 768px) {
    .shiki-wrapper :global(code) {
      font-size: 0.875rem;
    }
  }

  .shiki-wrapper :global(.line)::before {
    content: attr(data-line);
    display: inline-block;
    width: 1.5rem;
    margin-right: 0.75rem;
    text-align: right;
    color: var(--shiki-token-comment);
    user-select: none;
  }

  @media (min-width: 768px) {
    .shiki-wrapper :global(.line)::before {
      width: 2rem;
      margin-right: 1rem;
    }
  }
</style>
