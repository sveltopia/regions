<script lang="ts">
  import { ChevronLeft, ChevronRight } from "lucide-svelte";

  interface Props {
    prev?: {
      label: string;
      href: string;
    };
    next?: {
      label: string;
      href: string;
    };
  }

  let { prev, next }: Props = $props();
</script>

<nav class="not-prose">
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {#if prev}
      <a
        href={prev.href}
        class="group flex flex-col gap-3 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 transition-all hover:from-indigo-500/15 hover:to-purple-500/15">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
          <ChevronLeft class="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <div class="text-xs font-medium text-muted-foreground mb-1">Previous</div>
          <div class="text-base font-semibold text-foreground">{prev.label}</div>
        </div>
      </a>
    {:else}
      <div></div>
    {/if}

    {#if next}
      <a
        href={next.href}
        class="group flex flex-col gap-3 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 transition-all hover:from-indigo-500/15 hover:to-purple-500/15">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
          <ChevronRight class="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <div class="text-xs font-medium text-muted-foreground mb-1">Next</div>
          <div class="text-base font-semibold text-foreground">{next.label}</div>
        </div>
      </a>
    {/if}
  </div>
</nav>
