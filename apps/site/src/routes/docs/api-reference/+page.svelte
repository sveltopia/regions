<script lang="ts">
  import CodeViewer from '$lib/components/CodeViewer.svelte';
  import KeyConcept from '$lib/components/KeyConcept.svelte';
  import SvelteHead from '$lib/components/SvelteHead.svelte';
  import { Check, LayoutGrid, TrendingUp, ArrowRight } from 'lucide-svelte';

  const layoutRegionsCode = `${'<'}script>
  import { LayoutRegions } from '@sveltopia/regions';

  let { children } = $props();
${'<'}/script>

<LayoutRegions>
  <!-- Your layout content -->
  {@render children()}
</LayoutRegions>`;

  const layoutRegionCode = `${'<'}script>
  import { LayoutRegion } from '@sveltopia/regions';
  import { mySchema, type MyData } from './schema';
${'<'}/script>

<LayoutRegion name="regionName" schema={mySchema}>
  {#snippet children(data)}
    {@const typedData = data as unknown as MyData}
    <!-- Render your content using typedData -->
  {/snippet}
</LayoutRegion>`;

  const layoutRegionWithFallbackCode = `${'<'}script>
  import { LayoutRegion } from '@sveltopia/regions';
  import { mySchema, type MyData } from './schema';
${'<'}/script>

<LayoutRegion name="regionName" schema={mySchema}>
  {#snippet children(data)}
    {@const typedData = data as unknown as MyData}
    <h1>{typedData.title}</h1>
  {/snippet}
  {#snippet fallback()}
    <h1>Default Title</h1>
  {/snippet}
</LayoutRegion>`;

  const useLayoutRegionsCode = `${'<'}script>
  import { useLayoutRegions } from '@sveltopia/regions';

  // With data object
  useLayoutRegions({
    'region-name': { title: 'Hello', count: 42 }
  });

  // With snippet
  useLayoutRegions({
    'region-name': mySnippet
  });
${'<'}/script>

{#snippet mySnippet()}
  <div>Snippet content</div>
{/snippet}`;

  const regionSchemaCode = `import type { RegionSchema } from '@sveltopia/regions';

// Define your output type
type MyOutput = {
  title: string;
  count: number;
};

// With Valibot
import * as v from 'valibot';

const schema = v.object({
  title: v.string(),
  count: v.number()
});

export const mySchema = {
  parse: (data: unknown) => v.parse(schema, data)
} satisfies RegionSchema<MyOutput>;

// With Zod
import { z } from 'zod';

const schema = z.object({
  title: z.string(),
  count: z.number()
});

export const mySchema = schema satisfies RegionSchema<MyOutput>;

// TypeScript only
export const mySchema = {
  parse: (data: unknown) => data as MyOutput
} satisfies RegionSchema<MyOutput>;`;

  const loadFunctionCode = `import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return {
    regions: {
      'region-1': { /* data */ },
      'region-2': { /* data */ }
    }
  };
};`;
</script>

<SvelteHead
  title="API Reference - @sveltopia/regions"
  description="Complete API reference for @sveltopia/regions. LayoutRegions, LayoutRegion, useLayoutRegions, RegionSchema, and CLI commands."
/>

<div class="prose max-w-none dark:prose-invert">
  <h1>API Reference</h1>
  <p class="lead">
    Complete reference for all exports, types, and interfaces in @sveltopia/regions.
  </p>

  <h2>Import Paths</h2>

  <p>All exports are available from a single import path:</p>

  <div class="not-prose mb-8">
    <div class="rounded-lg bg-indigo-500/5 p-4">
      <pre class="overflow-x-auto text-sm"><code class="language-typescript"
          >import {'{'}
  LayoutRegions,     // Root provider component
  LayoutRegion,      // Consumer component
  useLayoutRegions,  // Composable function
  type RegionSchema  // TypeScript interface
} from '@sveltopia/regions';</code
        ></pre>
    </div>
  </div>

  <h2>Core Components</h2>

  <!-- LayoutRegions -->
  <div class="not-prose mb-8 space-y-6">
    <div class="rounded-lg bg-indigo-500/5 p-6">
      <h3 class="mb-2 text-lg font-semibold">
        <code class="text-indigo-600 dark:text-indigo-400">LayoutRegions</code>
      </h3>
      <p class="mb-4 text-sm text-muted-foreground">
        Root provider component that manages region context. Wrap your root layout with this.
      </p>

      <div class="mb-4">
        <p class="mb-2 text-sm font-semibold">Usage:</p>
        <CodeViewer
          filename="src/routes/+layout.svelte"
          language="svelte"
          code={layoutRegionsCode}
        />
      </div>

      <div class="grid gap-4 text-sm md:grid-cols-2">
        <div>
          <p class="mb-2 font-semibold">Props:</p>
          <ul class="space-y-1 text-muted-foreground">
            <li>• <code class="not-prose">children</code> - Required snippet</li>
          </ul>
        </div>
        <div>
          <p class="mb-2 font-semibold">Notes:</p>
          <ul class="space-y-1 text-muted-foreground">
            <li>• Place in root +layout.svelte</li>
            <li>• Only one instance needed</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- LayoutRegion -->
    <div class="rounded-lg bg-indigo-500/5 p-6">
      <h3 class="mb-2 text-lg font-semibold">
        <code class="text-indigo-600 dark:text-indigo-400">LayoutRegion</code>
      </h3>
      <p class="mb-4 text-sm text-muted-foreground">
        Consumer component that renders region content. Place wherever you want region data to
        appear.
      </p>

      <div class="mb-4">
        <p class="mb-2 text-sm font-semibold">Basic Usage:</p>
        <CodeViewer
          filename="src/routes/+layout.svelte"
          language="svelte"
          code={layoutRegionCode}
        />
      </div>

      <div class="mb-4">
        <p class="mb-2 text-sm font-semibold">With Fallback:</p>
        <CodeViewer
          filename="src/routes/+layout.svelte"
          language="svelte"
          code={layoutRegionWithFallbackCode}
        />
        <p class="mt-2 text-xs text-muted-foreground">
          The fallback snippet renders when no region data is provided.
        </p>
      </div>

      <div class="grid gap-4 text-sm md:grid-cols-2">
        <div>
          <p class="mb-2 font-semibold">Props:</p>
          <ul class="space-y-1 text-muted-foreground">
            <li>
              • <code class="not-prose">name</code> - string (required)
            </li>
            <li>
              • <code class="not-prose">schema</code> - RegionSchema (optional)
            </li>
            <li>
              • <code class="not-prose">children</code> - Snippet (optional)
            </li>
            <li>
              • <code class="not-prose">fallback</code> - Snippet (optional)
            </li>
          </ul>
        </div>
        <div>
          <p class="mb-2 font-semibold">Notes:</p>
          <ul class="space-y-1 text-muted-foreground">
            <li>• Schema validates data objects only</li>
            <li>• Data: Validates, then passes to children</li>
            <li>• Snippet: Renders directly, bypasses schema</li>
            <li>• Fallback renders when no region data</li>
            <li>• Renders nothing if no children/fallback</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <h2>Composable Functions</h2>

  <!-- useLayoutRegions -->
  <div class="not-prose mb-8 space-y-6">
    <div class="rounded-lg bg-indigo-500/5 p-6">
      <h3 class="mb-2 text-lg font-semibold">
        <code class="text-indigo-600 dark:text-indigo-400">useLayoutRegions</code>
      </h3>
      <p class="mb-4 text-sm text-muted-foreground">
        Set region data from within +page.svelte files. Call with an object mapping region names to
        data objects or snippets.
      </p>

      <div class="mb-4">
        <p class="mb-2 text-sm font-semibold">Usage:</p>
        <CodeViewer filename="+page.svelte" language="svelte" code={useLayoutRegionsCode} />
      </div>

      <div class="grid gap-4 text-sm md:grid-cols-2">
        <div>
          <p class="mb-2 font-semibold">Parameters:</p>
          <ul class="space-y-1 text-muted-foreground">
            <li>
              • <code class="not-prose">regions</code> - Record&lt;string, unknown | Snippet&gt;
            </li>
          </ul>
          <p class="mt-3 mb-2 font-semibold">Returns:</p>
          <ul class="space-y-1 text-muted-foreground">
            <li>• <code class="not-prose">void</code></li>
          </ul>
        </div>
        <div>
          <p class="mb-2 font-semibold">Notes:</p>
          <ul class="space-y-1 text-muted-foreground">
            <li>• Call during component initialization</li>
            <li>• Can set multiple regions at once</li>
            <li>• Accepts data objects or snippets</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <h2>TypeScript Types</h2>

  <!-- RegionSchema -->
  <div class="not-prose mb-8 space-y-6">
    <div class="rounded-lg bg-indigo-500/5 p-6">
      <h3 class="mb-2 text-lg font-semibold">
        <code class="text-indigo-600 dark:text-indigo-400">RegionSchema&lt;T&gt;</code>
      </h3>
      <p class="mb-4 text-sm text-muted-foreground">
        Interface for validation schemas. Compatible with Valibot, Zod, or custom validators. The
        type parameter <code class="not-prose">T</code> represents the validated output type that your
        schema produces.
      </p>

      <div class="mb-4">
        <p class="mb-2 text-sm font-semibold">Examples:</p>
        <CodeViewer filename="schema.ts" language="typescript" code={regionSchemaCode} />
      </div>

      <div class="text-sm">
        <p class="mb-2 font-semibold">Interface:</p>
        <pre
          class="overflow-x-auto rounded bg-muted p-3 text-xs">{'interface RegionSchema<T> {\n  parse: (data: unknown) => T;\n}'}</pre>
      </div>
    </div>
  </div>

  <KeyConcept>
    <strong>Validator agnostic:</strong> RegionSchema works with any validation library that has a
    <code class="not-prose">parse</code> method. Valibot and Zod schemas satisfy this interface directly.
  </KeyConcept>

  <h2>Load Function Convention</h2>

  <p>
    Return region data under the <code>regions</code> key in your load function:
  </p>

  <div class="not-prose mb-6">
    <CodeViewer filename="+page.server.ts" language="typescript" code={loadFunctionCode} />
  </div>

  <div class="not-prose space-y-3">
    <div class="rounded-lg border p-4">
      <p class="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Check class="h-4 w-4 text-green-600 dark:text-green-400" />
        Requirements
      </p>
      <ul class="space-y-1 text-sm text-muted-foreground">
        <li>• Use the exact key <code class="not-prose">regions</code></li>
        <li>• Return an object mapping region names to data</li>
        <li>• Data must be serializable (no functions)</li>
        <li>• Works in both +page.server.ts and +layout.server.ts</li>
      </ul>
    </div>
    <div class="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
      <p class="text-sm">
        <strong>Learn more:</strong> See
        <a href="/docs/advanced" class="text-indigo-600 hover:underline dark:text-indigo-400"
          >Advanced Patterns</a
        >
        for using <code class="not-prose">+layout.server.ts</code> with region inheritance and override
        patterns.
      </p>
    </div>
  </div>

  <h2>Validation Libraries</h2>

  <div class="not-prose mb-8 grid gap-4 md:grid-cols-3">
    <div class="rounded-lg border p-4">
      <h3 class="mb-2 font-semibold">Valibot</h3>
      <p class="mb-3 text-sm text-muted-foreground">Recommended. Smallest bundle size (~1kb).</p>
      <a
        href="https://valibot.dev"
        target="_blank"
        rel="noopener noreferrer"
        class="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
      >
        Documentation →
      </a>
    </div>

    <div class="rounded-lg border p-4">
      <h3 class="mb-2 font-semibold">Zod</h3>
      <p class="mb-3 text-sm text-muted-foreground">
        Popular, feature-rich. Larger bundle (~14kb).
      </p>
      <a
        href="https://zod.dev"
        target="_blank"
        rel="noopener noreferrer"
        class="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
      >
        Documentation →
      </a>
    </div>

    <div class="rounded-lg border p-4">
      <h3 class="mb-2 font-semibold">TypeScript Only</h3>
      <p class="mb-3 text-sm text-muted-foreground">No runtime validation. Zero bundle cost.</p>
      <a
        href="/examples/load-function/typescript-only"
        class="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
      >
        See Example →
      </a>
    </div>
  </div>

  <h2>Package Exports</h2>

  <div class="not-prose">
    <table class="w-full border-collapse text-sm">
      <thead>
        <tr class="border-b">
          <th class="p-3 text-left">Export</th>
          <th class="p-3 text-left">Type</th>
          <th class="p-3 text-left">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b">
          <td class="p-3">
            <code class="text-indigo-600 dark:text-indigo-400">LayoutRegions</code>
          </td>
          <td class="p-3 text-muted-foreground">Component</td>
          <td class="p-3 text-muted-foreground">Root provider component</td>
        </tr>
        <tr class="border-b">
          <td class="p-3">
            <code class="text-indigo-600 dark:text-indigo-400">LayoutRegion</code>
          </td>
          <td class="p-3 text-muted-foreground">Component</td>
          <td class="p-3 text-muted-foreground">Region consumer component</td>
        </tr>
        <tr class="border-b">
          <td class="p-3">
            <code class="text-indigo-600 dark:text-indigo-400">useLayoutRegions</code>
          </td>
          <td class="p-3 text-muted-foreground">Function</td>
          <td class="p-3 text-muted-foreground">Set region data</td>
        </tr>
        <tr class="border-b">
          <td class="p-3">
            <code class="text-indigo-600 dark:text-indigo-400">RegionSchema&lt;T&gt;</code>
          </td>
          <td class="p-3 text-muted-foreground">Type</td>
          <td class="p-3 text-muted-foreground">Validation schema interface</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2>CLI Commands</h2>

  <div class="not-prose mb-8 space-y-3">
    <div class="rounded-lg border p-4">
      <p class="mb-2 font-mono text-sm">
        <code class="text-indigo-600 dark:text-indigo-400"
          >npx @sveltopia/regions add &lt;name&gt;</code
        >
      </p>
      <p class="text-sm text-muted-foreground">
        Generate complete region boilerplate with interactive prompts.
      </p>
      <a
        href="/docs/quick-start"
        class="mt-2 inline-block text-sm text-indigo-600 hover:underline dark:text-indigo-400"
      >
        Learn more →
      </a>
    </div>
  </div>

  <h2>Error Handling</h2>

  <div class="not-prose space-y-3">
    <div class="rounded-lg border p-4">
      <p class="mb-2 text-sm font-semibold">Validation Errors</p>
      <p class="mb-3 text-sm text-muted-foreground">
        If validation fails, LayoutRegion logs an error and renders nothing. Check your browser
        console for validation error details.
      </p>
      <div class="mt-2 rounded border border-red-500/20 bg-red-500/5 p-3">
        <p class="font-mono text-xs text-red-600 dark:text-red-400">
          [Regions] Validation error for region "header":<br />
          Expected string for title, received number
        </p>
      </div>
    </div>

    <div class="rounded-lg border p-4">
      <p class="mb-2 text-sm font-semibold">Missing Region Data</p>
      <p class="text-sm text-muted-foreground">
        If no data is provided for a region, LayoutRegion renders nothing. This is expected behavior
        for optional regions.
      </p>
    </div>

    <div class="rounded-lg border p-4">
      <p class="mb-2 text-sm font-semibold">Type Mismatches</p>
      <p class="text-sm text-muted-foreground">
        TypeScript will catch type mismatches at compile-time. Runtime validation (Valibot/Zod)
        provides an additional safety layer.
      </p>
    </div>
  </div>

  <h2>Next Steps</h2>

  <div class="not-prose mt-6 grid gap-4 md:grid-cols-2">
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
      <h3 class="mb-2 text-lg font-semibold">Browse Examples</h3>
      <p class="text-sm text-muted-foreground">
        See all APIs in action with live demos and complete code
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
      <p class="text-sm text-muted-foreground">Learn which strategy to use for your use case</p>
    </a>
  </div>
</div>
