<script lang="ts">
  import { Check, X, ArrowRight, Terminal, TrendingUp, LayoutGrid } from 'lucide-svelte';
  import SvelteHead from '$lib/components/SvelteHead.svelte';
</script>

<SvelteHead
  title="Native vs Regions - @sveltopia/regions"
  description="Compare SvelteKit's native page.data approach with @sveltopia/regions. See when to use each and what regions adds: validation, fallbacks, and snippet support."
/>

<div class="space-y-8">
  <!-- Header -->
  <div class="space-y-4">
    <h1 class="text-4xl font-bold tracking-tight">Native vs Regions</h1>
    <p class="text-xl text-muted-foreground">
      SvelteKit has a built-in way to pass data from pages to layouts. @sveltopia/regions builds on
      top of this pattern, adding validation, fallback handling, and the ability to pass snippets
      (which SvelteKit can't do).
    </p>
  </div>

  <div class="prose max-w-none dark:prose-invert">
    <h2>Comparison</h2>
  </div>

  <!-- Comparison Table -->
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead>
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
          >
            Feature
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
          >
            Native SvelteKit
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
          >
            @sveltopia/regions
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr>
          <td class="px-6 py-4 text-sm whitespace-nowrap">Pass simple data</td>
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><Check class="inline h-4 w-4 text-green-600 dark:text-green-400" />
            <code>page.data</code></td
          >
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><Check class="inline h-4 w-4 text-green-600 dark:text-green-400" />
            Load function strategy</td
          >
        </tr>
        <tr>
          <td class="px-6 py-4 text-sm whitespace-nowrap">Server-side rendering</td>
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><Check class="inline h-4 w-4 text-green-600 dark:text-green-400" />
            Yes</td
          >
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><Check class="inline h-4 w-4 text-green-600 dark:text-green-400" />
            Yes (load function)</td
          >
        </tr>
        <tr>
          <td class="px-6 py-4 text-sm whitespace-nowrap">Pass Svelte snippets</td>
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><X class="inline h-4 w-4 text-red-600 dark:text-red-400" /> Not possible</td
          >
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><Check class="inline h-4 w-4 text-green-600 dark:text-green-400" />
            Snippet strategy</td
          >
        </tr>
        <tr>
          <td class="px-6 py-4 text-sm whitespace-nowrap">Pass reactive components</td>
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><X class="inline h-4 w-4 text-red-600 dark:text-red-400" /> Not possible</td
          >
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><Check class="inline h-4 w-4 text-green-600 dark:text-green-400" />
            Snippet + component strategies</td
          >
        </tr>
        <tr>
          <td class="px-6 py-4 text-sm whitespace-nowrap">Runtime validation</td>
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><X class="inline h-4 w-4 text-red-600 dark:text-red-400" /> Manual</td
          >
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><Check class="inline h-4 w-4 text-green-600 dark:text-green-400" />
            Built-in with Valibot/Zod</td
          >
        </tr>
        <tr>
          <td class="px-6 py-4 text-sm whitespace-nowrap">Type inference from schemas</td>
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><X class="inline h-4 w-4 text-red-600 dark:text-red-400" /> Manual</td
          >
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><Check class="inline h-4 w-4 text-green-600 dark:text-green-400" />
            Automatic</td
          >
        </tr>
        <tr>
          <td class="px-6 py-4 text-sm whitespace-nowrap">Declarative fallbacks</td>
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><X class="inline h-4 w-4 text-red-600 dark:text-red-400" /> Manual if/else</td
          >
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><Check class="inline h-4 w-4 text-green-600 dark:text-green-400" />
            Built-in</td
          >
        </tr>
        <tr>
          <td class="px-6 py-4 text-sm whitespace-nowrap">Three-state logic</td>
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><X class="inline h-4 w-4 text-red-600 dark:text-red-400" /> Complex conditionals</td
          >
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><Check class="inline h-4 w-4 text-green-600 dark:text-green-400" />
            Automatic</td
          >
        </tr>
        <tr>
          <td class="px-6 py-4 text-sm whitespace-nowrap">CLI scaffolding</td>
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><X class="inline h-4 w-4 text-red-600 dark:text-red-400" /> None</td
          >
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><Check class="inline h-4 w-4 text-green-600 dark:text-green-400" />
            Interactive CLI</td
          >
        </tr>
        <tr>
          <td class="px-6 py-4 text-sm whitespace-nowrap">Team consistency</td>
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><X class="inline h-4 w-4 text-amber-600 dark:text-amber-400" /> Convention-based</td
          >
          <td class="px-6 py-4 text-sm whitespace-nowrap"
            ><Check class="inline h-4 w-4 text-green-600 dark:text-green-400" />
            Enforced by library</td
          >
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Next Steps -->
  <div class="prose mt-12 max-w-none dark:prose-invert">
    <h2>Next Steps</h2>
  </div>

  <div class="not-prose mt-6 grid gap-4 md:grid-cols-3">
    <a
      href="/docs/quick-start"
      class="group block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10"
    >
      <div class="mb-3 flex items-start justify-between">
        <div class="rounded-lg bg-indigo-500/10 p-2">
          <Terminal class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <ArrowRight
          class="h-5 w-5 -translate-x-2 text-indigo-600 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 dark:text-indigo-400"
        />
      </div>
      <h3 class="mb-2 text-lg font-semibold">Quick Start</h3>
      <p class="text-sm text-muted-foreground">
        Generate your first region with the CLI in 30 seconds
      </p>
    </a>

    <a
      href="/docs/strategy-comparison"
      class="group block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10"
    >
      <div class="mb-3 flex items-start justify-between">
        <div class="rounded-lg bg-indigo-500/10 p-2">
          <TrendingUp class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <ArrowRight
          class="h-5 w-5 -translate-x-2 text-indigo-600 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 dark:text-indigo-400"
        />
      </div>
      <h3 class="mb-2 text-lg font-semibold">Strategy Comparison</h3>
      <p class="text-sm text-muted-foreground">
        Compare all three strategies and choose the right one
      </p>
    </a>

    <a
      href="/examples"
      class="group block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10"
    >
      <div class="mb-3 flex items-start justify-between">
        <div class="rounded-lg bg-indigo-500/10 p-2">
          <LayoutGrid class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <ArrowRight
          class="h-5 w-5 -translate-x-2 text-indigo-600 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 dark:text-indigo-400"
        />
      </div>
      <h3 class="mb-2 text-lg font-semibold">See Examples</h3>
      <p class="text-sm text-muted-foreground">
        Explore live demos with complete code for all patterns
      </p>
    </a>
  </div>
</div>
