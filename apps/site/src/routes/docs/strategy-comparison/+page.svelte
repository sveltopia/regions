<script lang="ts">
  import CodeViewer from '$lib/components/CodeViewer.svelte';
  import KeyConcept from '$lib/components/KeyConcept.svelte';
  import { CircleAlert, Star, Check, Server, Box, FileCode, Code, ArrowRight } from 'lucide-svelte';

  const loadFunctionCode = `export const load = () => ({
  regions: {
    pageHeader: {
      title: 'My Page',
      description: 'Server-rendered'
    }
  }
});`;

  const pageComponentCode = `<Header
  title="My Page"
  description="Client-side"
/>`;

  const snippetCode = `let count = $state(0);

useLayoutRegions({
  'counter': counterSnippet
});

{#snippet counterSnippet()}
  <button onclick={() => count++}>
    Count: {count}
  </button>
{/snippet}`;
</script>

<div class="prose max-w-none dark:prose-invert">
  <h1>Strategy Comparison</h1>
  <p class="lead">
    Choose the right approach for your use case. All three strategies are type-safe and flexible.
  </p>

  <h2>Quick Decision Matrix</h2>

  <div class="not-prose mb-8">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b">
            <th class="p-3 text-left font-semibold">Use Case</th>
            <th class="p-3 text-left font-semibold">Recommended Strategy</th>
            <th class="p-3 text-left font-semibold">Why</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          <tr class="border-b">
            <td class="p-3">Page titles, meta tags</td>
            <td class="p-3">
              <span class="font-semibold text-indigo-600 dark:text-indigo-400">Load Function</span>
            </td>
            <td class="p-3 text-muted-foreground">SEO, zero layout shift</td>
          </tr>
          <tr class="border-b">
            <td class="p-3">Breadcrumbs, navigation</td>
            <td class="p-3">
              <span class="font-semibold text-indigo-600 dark:text-indigo-400">Load Function</span>
            </td>
            <td class="p-3 text-muted-foreground">Server-rendered, always visible</td>
          </tr>
          <tr class="border-b">
            <td class="p-3">Simple header/footer content</td>
            <td class="p-3">
              <span class="font-semibold text-indigo-600 dark:text-indigo-400"
                >Component Wrapper</span
              >
            </td>
            <td class="p-3 text-muted-foreground">Clean API, easy to use</td>
          </tr>
          <tr class="border-b">
            <td class="p-3">Action buttons with handlers</td>
            <td class="p-3">
              <span class="font-semibold text-indigo-600 dark:text-indigo-400">Snippet</span>
            </td>
            <td class="p-3 text-muted-foreground">Access to page state/handlers</td>
          </tr>
          <tr class="border-b">
            <td class="p-3">Forms, counters, toggles</td>
            <td class="p-3">
              <span class="font-semibold text-indigo-600 dark:text-indigo-400">Snippet</span>
            </td>
            <td class="p-3 text-muted-foreground">Reactive, interactive UI</td>
          </tr>
          <tr class="border-b">
            <td class="p-3">Dashboard stats</td>
            <td class="p-3">
              <span class="font-semibold text-indigo-600 dark:text-indigo-400">Snippet</span>
            </td>
            <td class="p-3 text-muted-foreground">Real-time updates, state access</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <h2>The Three Strategies</h2>

  <div class="not-prose space-y-8">
    <!-- Load Function -->
    <div class="rounded-lg bg-indigo-500/5 p-6">
      <div class="mb-4">
        <h3 class="mb-2 text-lg font-semibold">1. Load Function (SSR)</h3>
        <p class="mb-4 text-sm text-muted-foreground">
          Return region data from your page's load function. Best for SEO and server-side rendering.
        </p>
        <CodeViewer filename="+page.server.ts" language="typescript" code={loadFunctionCode} />
        <div class="mt-3 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3">
          <p class="text-xs text-muted-foreground">
            <strong>Note:</strong> Also works in
            <code class="rounded bg-muted px-1 py-0.5">+layout.server.ts</code>
            files. See
            <a href="/docs/advanced" class="text-indigo-600 hover:underline dark:text-indigo-400"
              >Advanced Patterns</a
            > for layout-level regions and inheritance.
          </p>
        </div>
      </div>

      <div class="mt-6 grid gap-3 md:grid-cols-2">
        <div class="rounded-lg bg-indigo-500/10 p-5">
          <p class="mb-3 flex items-center gap-2 font-semibold">
            <Check class="h-4 w-4 text-green-600 dark:text-green-400" />
            Best For:
          </p>
          <ul class="space-y-1.5 text-sm text-muted-foreground">
            <li>• SEO-critical content</li>
            <li>• Page titles and meta tags</li>
            <li>• Breadcrumb navigation</li>
            <li>• Zero layout shift</li>
            <li>• Server-side data fetching</li>
          </ul>
        </div>
        <div class="rounded-lg bg-indigo-500/10 p-5">
          <p class="mb-3 flex items-center gap-2 font-semibold">
            <CircleAlert class="h-4 w-4 text-amber-600 dark:text-amber-500" /> Limitations:
          </p>
          <ul class="space-y-1.5 text-sm text-muted-foreground">
            <li>• Can't access page state</li>
            <li>• No reactive updates</li>
            <li>• Data must be serializable</li>
          </ul>
        </div>
      </div>

      <a
        href="/examples/load-function"
        class="mt-4 inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
      >
        View Examples →
      </a>
    </div>

    <!-- Component Wrapper -->
    <div class="rounded-lg bg-indigo-500/5 p-6">
      <div class="mb-4">
        <h3 class="mb-2 text-lg font-semibold">2. Component Wrapper (Client-Side)</h3>
        <p class="mb-4 text-sm text-muted-foreground">
          Use a wrapper component with props. Simple, clean API that works like any Svelte
          component.
        </p>
        <CodeViewer filename="+page.svelte" language="svelte" code={pageComponentCode} />
      </div>

      <div class="mt-6 grid gap-3 md:grid-cols-2">
        <div class="rounded-lg bg-indigo-500/10 p-5">
          <p class="mb-3 flex items-center gap-2 font-semibold">
            <Check class="h-4 w-4 text-green-600 dark:text-green-400" />
            Best For:
          </p>
          <ul class="space-y-1.5 text-sm text-muted-foreground">
            <li>• Simple, static content</li>
            <li>• Client-only pages</li>
            <li>• Rapid development</li>
            <li>• Clean, prop-based API</li>
            <li>• Generated with CLI</li>
          </ul>
        </div>
        <div class="rounded-lg bg-indigo-500/10 p-5">
          <p class="mb-3 flex items-center gap-2 font-semibold">
            <CircleAlert class="h-4 w-4 text-amber-600 dark:text-amber-500" /> Limitations:
          </p>
          <ul class="space-y-1.5 text-sm text-muted-foreground">
            <li>• Client-side only (no SSR)</li>
            <li>• Not ideal for SEO</li>
            <li>• Requires separate files</li>
          </ul>
        </div>
      </div>

      <a
        href="/examples/component-wrapper"
        class="mt-4 inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
      >
        View Examples →
      </a>
    </div>

    <!-- Snippet -->
    <div class="rounded-lg bg-indigo-500/5 p-6">
      <div class="mb-4">
        <h3 class="mb-2 text-lg font-semibold">3. Snippet (Maximum Flexibility)</h3>
        <p class="mb-4 text-sm text-muted-foreground">
          Define snippets inline with full access to page state. Perfect for interactive UIs.
        </p>
        <CodeViewer filename="+page.svelte" language="svelte" code={snippetCode} />
      </div>

      <div class="mt-6 grid gap-3 md:grid-cols-2">
        <div class="rounded-lg bg-indigo-500/10 p-5">
          <p class="mb-3 flex items-center gap-2 font-semibold">
            <Check class="h-4 w-4 text-green-600 dark:text-green-400" />
            Best For:
          </p>
          <ul class="space-y-1.5 text-sm text-muted-foreground">
            <li>• Interactive UI (forms, counters)</li>
            <li>• Access to page state</li>
            <li>• Event handlers from page</li>
            <li>• Real-time updates</li>
            <li>• Maximum flexibility</li>
          </ul>
        </div>
        <div class="rounded-lg bg-indigo-500/10 p-5">
          <p class="mb-3 flex items-center gap-2 font-semibold">
            <CircleAlert class="h-4 w-4 text-amber-600 dark:text-amber-500" /> Limitations:
          </p>
          <ul class="space-y-1.5 text-sm text-muted-foreground">
            <li>• Client-side only</li>
            <li>• More complex setup</li>
            <li>• TypeScript only (no runtime validation)</li>
          </ul>
        </div>
      </div>

      <a
        href="/examples/snippet"
        class="mt-4 inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
      >
        View Examples →
      </a>
    </div>
  </div>

  <KeyConcept>
    <strong>You can mix strategies!</strong> Use load functions for SEO content, component wrappers for
    simple regions, and snippets for interactive UI. All three work together seamlessly.
  </KeyConcept>

  <h2>Decision Flowchart</h2>

  <div class="not-prose rounded-lg border bg-card p-6">
    <div class="space-y-4 text-sm">
      <div class="flex items-start gap-3">
        <div
          class="shrink-0 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400"
        >
          START
        </div>
        <p class="pt-1">Does this content need to be in the initial HTML (SEO)?</p>
      </div>

      <div class="ml-8 space-y-3">
        <div class="flex items-start gap-3">
          <span class="shrink-0 text-indigo-600 dark:text-indigo-400">↳ YES</span>
          <p>
            <span class="font-semibold">Use Load Function</span> - Server-rendered, SEO-friendly
          </p>
        </div>

        <div class="flex items-start gap-3">
          <span class="shrink-0 text-indigo-600 dark:text-indigo-400">↳ NO</span>
          <p>Does it need access to page state or handlers?</p>
        </div>

        <div class="ml-8 space-y-3">
          <div class="flex items-start gap-3">
            <span class="shrink-0 text-indigo-600 dark:text-indigo-400">↳ YES</span>
            <p>
              <span class="font-semibold">Use Snippet</span> - Full state access, maximum flexibility
            </p>
          </div>

          <div class="flex items-start gap-3">
            <span class="shrink-0 text-indigo-600 dark:text-indigo-400">↳ NO</span>
            <p>
              <span class="font-semibold">Use Component Wrapper</span> - Simple, clean API
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <h2>Real-World Examples</h2>

  <div class="not-prose space-y-4">
    <div class="rounded-lg border p-4">
      <h3 class="mb-2 font-semibold">E-Commerce Product Page</h3>
      <ul class="space-y-1 text-sm text-muted-foreground">
        <li>
          • <strong>Load Function:</strong> Product title, meta description, breadcrumbs
        </li>
        <li>
          • <strong>Component Wrapper:</strong> Related products sidebar
        </li>
        <li>
          • <strong>Snippet:</strong> Add to cart button, quantity selector
        </li>
      </ul>
    </div>

    <div class="rounded-lg border p-4">
      <h3 class="mb-2 font-semibold">Blog Post</h3>
      <ul class="space-y-1 text-sm text-muted-foreground">
        <li>
          • <strong>Load Function:</strong> Post title, author, publish date, meta tags
        </li>
        <li>
          • <strong>Component Wrapper:</strong> Table of contents, author bio
        </li>
        <li>
          • <strong>Snippet:</strong> Like button, comment form
        </li>
      </ul>
    </div>

    <div class="rounded-lg border p-4">
      <h3 class="mb-2 font-semibold">Dashboard</h3>
      <ul class="space-y-1 text-sm text-muted-foreground">
        <li>
          • <strong>Load Function:</strong> Page title, breadcrumbs
        </li>
        <li>
          • <strong>Snippet:</strong> Real-time stats, filter controls, action buttons
        </li>
      </ul>
    </div>
  </div>

  <h2>Performance Comparison</h2>

  <div class="overflow-x-auto">
    <table class="w-full border-collapse text-sm">
      <thead>
        <tr class="border-b">
          <th class="p-3 text-left">Metric</th>
          <th class="p-3 text-center">Load Function</th>
          <th class="p-3 text-center">Component Wrapper</th>
          <th class="p-3 text-center">Snippet</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b">
          <td class="p-3">Initial Paint</td>
          <td class="p-3 text-center">
            <div class="inline-flex gap-0.5">
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </td>
          <td class="p-3 text-center">
            <div class="inline-flex gap-0.5">
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </td>
          <td class="p-3 text-center">
            <div class="inline-flex gap-0.5">
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </td>
        </tr>
        <tr class="border-b">
          <td class="p-3">SEO</td>
          <td class="p-3 text-center">
            <div class="inline-flex gap-0.5">
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </td>
          <td class="p-3 text-center">
            <div class="inline-flex gap-0.5">
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </td>
          <td class="p-3 text-center">
            <div class="inline-flex gap-0.5">
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </td>
        </tr>
        <tr class="border-b">
          <td class="p-3">Interactivity</td>
          <td class="p-3 text-center">
            <div class="inline-flex gap-0.5">
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </td>
          <td class="p-3 text-center">
            <div class="inline-flex gap-0.5">
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </td>
          <td class="p-3 text-center">
            <div class="inline-flex gap-0.5">
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </td>
        </tr>
        <tr class="border-b">
          <td class="p-3">Developer Experience</td>
          <td class="p-3 text-center">
            <div class="inline-flex gap-0.5">
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </td>
          <td class="p-3 text-center">
            <div class="inline-flex gap-0.5">
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </td>
          <td class="p-3 text-center">
            <div class="inline-flex gap-0.5">
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
              <Star class="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2>Next Steps</h2>

  <div class="not-prose mt-6 grid gap-4 md:grid-cols-2">
    <a
      href="/examples/load-function"
      class="group block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10"
    >
      <div class="mb-3 flex items-start justify-between">
        <div class="rounded-lg bg-indigo-500/10 p-2">
          <Server class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <ArrowRight
          class="h-5 w-5 -translate-x-2 text-indigo-600 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 dark:text-indigo-400"
        />
      </div>
      <h3 class="mb-2 text-lg font-semibold">Load Function Examples</h3>
      <p class="text-sm text-muted-foreground">See SSR examples with all three validators</p>
    </a>

    <a
      href="/examples/component-wrapper"
      class="group block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10"
    >
      <div class="mb-3 flex items-start justify-between">
        <div class="rounded-lg bg-indigo-500/10 p-2">
          <Box class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <ArrowRight
          class="h-5 w-5 -translate-x-2 text-indigo-600 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 dark:text-indigo-400"
        />
      </div>
      <h3 class="mb-2 text-lg font-semibold">Component Wrapper Examples</h3>
      <p class="text-sm text-muted-foreground">Explore the CLI-generated component pattern</p>
    </a>

    <a
      href="/examples/snippet"
      class="group block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10"
    >
      <div class="mb-3 flex items-start justify-between">
        <div class="rounded-lg bg-indigo-500/10 p-2">
          <FileCode class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <ArrowRight
          class="h-5 w-5 -translate-x-2 text-indigo-600 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 dark:text-indigo-400"
        />
      </div>
      <h3 class="mb-2 text-lg font-semibold">Snippet Examples</h3>
      <p class="text-sm text-muted-foreground">Learn the three snippet superpowers</p>
    </a>

    <a
      href="/docs/api-reference"
      class="group block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10"
    >
      <div class="mb-3 flex items-start justify-between">
        <div class="rounded-lg bg-indigo-500/10 p-2">
          <Code class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <ArrowRight
          class="h-5 w-5 -translate-x-2 text-indigo-600 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 dark:text-indigo-400"
        />
      </div>
      <h3 class="mb-2 text-lg font-semibold">API Reference</h3>
      <p class="text-sm text-muted-foreground">Complete reference for all exports and types</p>
    </a>
  </div>
</div>
