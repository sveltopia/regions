<script lang="ts">
  import { Check, X, ArrowRight, Terminal, TrendingUp, LayoutGrid } from "lucide-svelte";
</script>

<div class="space-y-8">
  <!-- Header -->
  <div class="space-y-4">
    <h1 class="text-4xl font-bold tracking-tight">
      Native vs Regions
    </h1>
    <p class="text-xl text-muted-foreground">
      SvelteKit has a built-in way to pass data from pages to layouts. @sveltopia/regions builds on top of this pattern, adding validation, fallback handling, and the ability to pass snippets (which SvelteKit can't do).
    </p>
  </div>

  <div class="prose dark:prose-invert max-w-none">
    <h2>Comparison</h2>
  </div>

  <!-- Comparison Table -->
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead>
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Feature
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Native SvelteKit
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            @sveltopia/regions
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm">Pass simple data</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><Check class="h-4 w-4 text-green-600 dark:text-green-400 inline" />
            <code>page.data</code></td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><Check class="h-4 w-4 text-green-600 dark:text-green-400 inline" />
            Load function strategy</td>
        </tr>
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            >Server-side rendering</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><Check class="h-4 w-4 text-green-600 dark:text-green-400 inline" />
            Yes</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><Check class="h-4 w-4 text-green-600 dark:text-green-400 inline" />
            Yes (load function)</td>
        </tr>
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            >Pass Svelte snippets</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><X class="h-4 w-4 text-red-600 dark:text-red-400 inline" /> Not possible</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><Check class="h-4 w-4 text-green-600 dark:text-green-400 inline" />
            Snippet strategy</td>
        </tr>
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            >Pass reactive components</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><X class="h-4 w-4 text-red-600 dark:text-red-400 inline" /> Not possible</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><Check class="h-4 w-4 text-green-600 dark:text-green-400 inline" />
            Snippet + component strategies</td>
        </tr>
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            >Runtime validation</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><X class="h-4 w-4 text-red-600 dark:text-red-400 inline" /> Manual</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><Check class="h-4 w-4 text-green-600 dark:text-green-400 inline" />
            Built-in with Valibot/Zod</td>
        </tr>
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            >Type inference from schemas</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><X class="h-4 w-4 text-red-600 dark:text-red-400 inline" /> Manual</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><Check class="h-4 w-4 text-green-600 dark:text-green-400 inline" />
            Automatic</td>
        </tr>
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            >Declarative fallbacks</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><X class="h-4 w-4 text-red-600 dark:text-red-400 inline" /> Manual if/else</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><Check class="h-4 w-4 text-green-600 dark:text-green-400 inline" />
            Built-in</td>
        </tr>
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm">Three-state logic</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><X class="h-4 w-4 text-red-600 dark:text-red-400 inline" /> Complex
            conditionals</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><Check class="h-4 w-4 text-green-600 dark:text-green-400 inline" />
            Automatic</td>
        </tr>
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm">CLI scaffolding</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><X class="h-4 w-4 text-red-600 dark:text-red-400 inline" /> None</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><Check class="h-4 w-4 text-green-600 dark:text-green-400 inline" />
            Interactive CLI</td>
        </tr>
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm">Team consistency</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><X class="h-4 w-4 text-amber-600 dark:text-amber-400 inline" /> Convention-based</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm"
            ><Check class="h-4 w-4 text-green-600 dark:text-green-400 inline" />
            Enforced by library</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Next Steps -->
  <div class="prose dark:prose-invert max-w-none mt-12">
    <h2>Next Steps</h2>
  </div>

  <div class="not-prose grid gap-4 md:grid-cols-3 mt-6">
    <a
      href="/docs/quick-start"
      class="group block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10">
      <div class="flex items-start justify-between mb-3">
        <div class="rounded-lg bg-indigo-500/10 p-2">
          <Terminal class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <ArrowRight
          class="h-5 w-5 text-indigo-600 dark:text-indigo-400 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
      </div>
      <h3 class="text-lg font-semibold mb-2">Quick Start</h3>
      <p class="text-sm text-muted-foreground">
        Generate your first region with the CLI in 30 seconds
      </p>
    </a>

    <a
      href="/docs/strategy-comparison"
      class="group block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10">
      <div class="flex items-start justify-between mb-3">
        <div class="rounded-lg bg-indigo-500/10 p-2">
          <TrendingUp class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <ArrowRight
          class="h-5 w-5 text-indigo-600 dark:text-indigo-400 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
      </div>
      <h3 class="text-lg font-semibold mb-2">Strategy Comparison</h3>
      <p class="text-sm text-muted-foreground">
        Compare all three strategies and choose the right one
      </p>
    </a>

    <a
      href="/examples"
      class="group block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10">
      <div class="flex items-start justify-between mb-3">
        <div class="rounded-lg bg-indigo-500/10 p-2">
          <LayoutGrid class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <ArrowRight
          class="h-5 w-5 text-indigo-600 dark:text-indigo-400 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
      </div>
      <h3 class="text-lg font-semibold mb-2">See Examples</h3>
      <p class="text-sm text-muted-foreground">
        Explore live demos with complete code for all patterns
      </p>
    </a>
  </div>

</div>
