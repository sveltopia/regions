<script lang="ts">
  import SvelteHead from '$lib/components/SvelteHead.svelte';
</script>

<SvelteHead
  title="Component Wrapper Examples - @sveltopia/regions"
  description="Client-side wrapper components with props. Examples with Valibot, Zod, and TypeScript-only validation."
/>

<div class="prose max-w-none dark:prose-invert">
  <p>
    Client-side wrapper components with props. Learn more in the
    <a href="/docs/strategy-comparison">Strategy Comparison docs</a>.
  </p>

  <h2>Validator Options</h2>
  <p>
    Each example below shows the component wrapper strategy with a different validator. See the <a
      href="/examples#validator-comparison">validator comparison table</a
    > for details.
  </p>

  <div class="not-prose mt-6 grid gap-4 md:grid-cols-3">
    <a
      href="/examples/component-wrapper/valibot"
      class="block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10"
    >
      <h3 class="mb-2 text-lg font-semibold">Valibot</h3>
      <p class="mb-4 text-sm text-muted-foreground">
        Smallest validator library (~1kb). Recommended for most projects.
      </p>
      <div class="text-xs font-medium text-primary">View Example →</div>
    </a>

    <a
      href="/examples/component-wrapper/zod"
      class="block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10"
    >
      <h3 class="mb-2 text-lg font-semibold">Zod</h3>
      <p class="mb-4 text-sm text-muted-foreground">
        Popular, feature-rich validator. Great if you're already using Zod.
      </p>
      <div class="text-xs font-medium text-primary">View Example →</div>
    </a>

    <a
      href="/examples/component-wrapper/typescript-only"
      class="block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10"
    >
      <h3 class="mb-2 text-lg font-semibold">TypeScript Only</h3>
      <p class="mb-4 text-sm text-muted-foreground">
        No runtime validation. Smallest bundle, best performance.
      </p>
      <div class="text-xs font-medium text-primary">View Example →</div>
    </a>
  </div>
</div>
