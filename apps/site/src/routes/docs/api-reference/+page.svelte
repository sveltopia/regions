<script lang="ts">
  import CodeViewer from "$lib/components/CodeViewer.svelte";
  import KeyConcept from "$lib/components/KeyConcept.svelte";
  import { Check, LayoutGrid, TrendingUp, ArrowRight } from "lucide-svelte";

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

<div class="prose dark:prose-invert max-w-none">
    <h1>API Reference</h1>
    <p class="lead">
      Complete reference for all exports, types, and interfaces in
      @sveltopia/regions.
    </p>

    <h2>Import Paths</h2>

    <p>All exports are available from a single import path:</p>

    <div class="not-prose mb-8">
      <div class="rounded-lg bg-indigo-500/5 p-4">
        <pre class="text-sm overflow-x-auto"><code class="language-typescript">import {"{"}
  LayoutRegions,     // Root provider component
  LayoutRegion,      // Consumer component
  useLayoutRegions,  // Composable function
  type RegionSchema  // TypeScript interface
{"}"} from '@sveltopia/regions';</code></pre>
      </div>
    </div>

    <h2>Core Components</h2>

    <!-- LayoutRegions -->
    <div class="not-prose space-y-6 mb-8">
      <div class="rounded-lg bg-indigo-500/5 p-6">
        <h3 class="text-lg font-semibold mb-2">
          <code class="text-indigo-600 dark:text-indigo-400">LayoutRegions</code>
        </h3>
        <p class="text-sm text-muted-foreground mb-4">
          Root provider component that manages region context. Wrap your root
          layout with this.
        </p>

        <div class="mb-4">
          <p class="text-sm font-semibold mb-2">Usage:</p>
          <CodeViewer
            filename="src/routes/+layout.svelte"
            language="svelte"
            code={layoutRegionsCode} />
        </div>

        <div class="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p class="font-semibold mb-2">Props:</p>
            <ul class="text-muted-foreground space-y-1">
              <li>• <code class="not-prose">children</code> - Required snippet</li>
            </ul>
          </div>
          <div>
            <p class="font-semibold mb-2">Notes:</p>
            <ul class="text-muted-foreground space-y-1">
              <li>• Place in root +layout.svelte</li>
              <li>• Only one instance needed</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- LayoutRegion -->
      <div class="rounded-lg bg-indigo-500/5 p-6">
        <h3 class="text-lg font-semibold mb-2">
          <code class="text-indigo-600 dark:text-indigo-400">LayoutRegion</code>
        </h3>
        <p class="text-sm text-muted-foreground mb-4">
          Consumer component that renders region content. Place wherever you want
          region data to appear.
        </p>

        <div class="mb-4">
          <p class="text-sm font-semibold mb-2">Basic Usage:</p>
          <CodeViewer
            filename="src/routes/+layout.svelte"
            language="svelte"
            code={layoutRegionCode} />
        </div>

        <div class="mb-4">
          <p class="text-sm font-semibold mb-2">With Fallback:</p>
          <CodeViewer
            filename="src/routes/+layout.svelte"
            language="svelte"
            code={layoutRegionWithFallbackCode} />
          <p class="text-xs text-muted-foreground mt-2">
            The fallback snippet renders when no region data is provided.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p class="font-semibold mb-2">Props:</p>
            <ul class="text-muted-foreground space-y-1">
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
            <p class="font-semibold mb-2">Notes:</p>
            <ul class="text-muted-foreground space-y-1">
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
    <div class="not-prose space-y-6 mb-8">
      <div class="rounded-lg bg-indigo-500/5 p-6">
        <h3 class="text-lg font-semibold mb-2">
          <code class="text-indigo-600 dark:text-indigo-400"
            >useLayoutRegions</code>
        </h3>
        <p class="text-sm text-muted-foreground mb-4">
          Set region data from within +page.svelte files. Call with an object
          mapping region names to data objects or snippets.
        </p>

        <div class="mb-4">
          <p class="text-sm font-semibold mb-2">Usage:</p>
          <CodeViewer
            filename="+page.svelte"
            language="svelte"
            code={useLayoutRegionsCode} />
        </div>

        <div class="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p class="font-semibold mb-2">Parameters:</p>
            <ul class="text-muted-foreground space-y-1">
              <li>
                • <code class="not-prose">regions</code> - Record&lt;string, unknown | Snippet&gt;
              </li>
            </ul>
            <p class="font-semibold mb-2 mt-3">Returns:</p>
            <ul class="text-muted-foreground space-y-1">
              <li>• <code class="not-prose">void</code></li>
            </ul>
          </div>
          <div>
            <p class="font-semibold mb-2">Notes:</p>
            <ul class="text-muted-foreground space-y-1">
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
    <div class="not-prose space-y-6 mb-8">
      <div class="rounded-lg bg-indigo-500/5 p-6">
        <h3 class="text-lg font-semibold mb-2">
          <code class="text-indigo-600 dark:text-indigo-400">RegionSchema&lt;T&gt;</code>
        </h3>
        <p class="text-sm text-muted-foreground mb-4">
          Interface for validation schemas. Compatible with Valibot, Zod, or
          custom validators. The type parameter <code class="not-prose">T</code> represents
          the validated output type that your schema produces.
        </p>

        <div class="mb-4">
          <p class="text-sm font-semibold mb-2">Examples:</p>
          <CodeViewer
            filename="schema.ts"
            language="typescript"
            code={regionSchemaCode} />
        </div>

        <div class="text-sm">
          <p class="font-semibold mb-2">Interface:</p>
          <pre class="bg-muted p-3 rounded text-xs overflow-x-auto">{'interface RegionSchema<T> {\n  parse: (data: unknown) => T;\n}'}</pre>
        </div>
      </div>
    </div>

    <KeyConcept>
      <strong>Validator agnostic:</strong> RegionSchema works with any validation
      library that has a <code class="not-prose">parse</code> method. Valibot and Zod schemas
      satisfy this interface directly.
    </KeyConcept>

    <h2>Load Function Convention</h2>

    <p>
      Return region data under the <code>regions</code> key in your load function:
    </p>

    <div class="not-prose mb-6">
      <CodeViewer
        filename="+page.server.ts"
        language="typescript"
        code={loadFunctionCode} />
    </div>

    <div class="not-prose space-y-3">
      <div class="rounded-lg border p-4">
        <p class="font-semibold mb-2 text-sm flex items-center gap-2">
          <Check class="h-4 w-4 text-green-600 dark:text-green-400" />
          Requirements
        </p>
        <ul class="text-sm text-muted-foreground space-y-1">
          <li>• Use the exact key <code class="not-prose">regions</code></li>
          <li>• Return an object mapping region names to data</li>
          <li>• Data must be serializable (no functions)</li>
          <li>• Works in both +page.server.ts and +layout.server.ts</li>
        </ul>
      </div>
      <div class="rounded-lg bg-indigo-500/5 border border-indigo-500/20 p-4">
        <p class="text-sm">
          <strong>Learn more:</strong> See <a href="/docs/advanced" class="text-indigo-600 dark:text-indigo-400 hover:underline">Advanced Patterns</a> for using <code class="not-prose">+layout.server.ts</code> with region inheritance and override patterns.
        </p>
      </div>
    </div>

    <h2>Validation Libraries</h2>

    <div class="not-prose grid md:grid-cols-3 gap-4 mb-8">
      <div class="rounded-lg border p-4">
        <h3 class="font-semibold mb-2">Valibot</h3>
        <p class="text-sm text-muted-foreground mb-3">
          Recommended. Smallest bundle size (~1kb).
        </p>
        <a
          href="https://valibot.dev"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          Documentation →
        </a>
      </div>

      <div class="rounded-lg border p-4">
        <h3 class="font-semibold mb-2">Zod</h3>
        <p class="text-sm text-muted-foreground mb-3">
          Popular, feature-rich. Larger bundle (~14kb).
        </p>
        <a
          href="https://zod.dev"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          Documentation →
        </a>
      </div>

      <div class="rounded-lg border p-4">
        <h3 class="font-semibold mb-2">TypeScript Only</h3>
        <p class="text-sm text-muted-foreground mb-3">
          No runtime validation. Zero bundle cost.
        </p>
        <a
          href="/examples/load-function/typescript-only"
          class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          See Example →
        </a>
      </div>
    </div>

    <h2>Package Exports</h2>

    <div class="not-prose">
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr class="border-b">
            <th class="text-left p-3">Export</th>
            <th class="text-left p-3">Type</th>
            <th class="text-left p-3">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b">
            <td class="p-3">
              <code class="text-indigo-600 dark:text-indigo-400"
                >LayoutRegions</code>
            </td>
            <td class="p-3 text-muted-foreground">Component</td>
            <td class="p-3 text-muted-foreground">Root provider component</td>
          </tr>
          <tr class="border-b">
            <td class="p-3">
              <code class="text-indigo-600 dark:text-indigo-400"
                >LayoutRegion</code>
            </td>
            <td class="p-3 text-muted-foreground">Component</td>
            <td class="p-3 text-muted-foreground">Region consumer component</td>
          </tr>
          <tr class="border-b">
            <td class="p-3">
              <code class="text-indigo-600 dark:text-indigo-400"
                >useLayoutRegions</code>
            </td>
            <td class="p-3 text-muted-foreground">Function</td>
            <td class="p-3 text-muted-foreground">Set region data</td>
          </tr>
          <tr class="border-b">
            <td class="p-3">
              <code class="text-indigo-600 dark:text-indigo-400"
                >RegionSchema&lt;T&gt;</code>
            </td>
            <td class="p-3 text-muted-foreground">Type</td>
            <td class="p-3 text-muted-foreground">Validation schema interface</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>CLI Commands</h2>

    <div class="not-prose space-y-3 mb-8">
      <div class="rounded-lg border p-4">
        <p class="font-mono text-sm mb-2">
          <code class="text-indigo-600 dark:text-indigo-400"
            >npx @sveltopia/regions add &lt;name&gt;</code>
        </p>
        <p class="text-sm text-muted-foreground">
          Generate complete region boilerplate with interactive prompts.
        </p>
        <a
          href="/docs/quick-start"
          class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block">
          Learn more →
        </a>
      </div>
    </div>

    <h2>Error Handling</h2>

    <div class="not-prose space-y-3">
      <div class="rounded-lg border p-4">
        <p class="font-semibold mb-2 text-sm">Validation Errors</p>
        <p class="text-sm text-muted-foreground mb-3">
          If validation fails, LayoutRegion logs an error and renders nothing.
          Check your browser console for validation error details.
        </p>
        <div class="rounded bg-red-500/5 border border-red-500/20 p-3 mt-2">
          <p class="text-xs font-mono text-red-600 dark:text-red-400">
            [Regions] Validation error for region "header":<br />
            Expected string for title, received number
          </p>
        </div>
      </div>

      <div class="rounded-lg border p-4">
        <p class="font-semibold mb-2 text-sm">Missing Region Data</p>
        <p class="text-sm text-muted-foreground">
          If no data is provided for a region, LayoutRegion renders nothing. This
          is expected behavior for optional regions.
        </p>
      </div>

      <div class="rounded-lg border p-4">
        <p class="font-semibold mb-2 text-sm">Type Mismatches</p>
        <p class="text-sm text-muted-foreground">
          TypeScript will catch type mismatches at compile-time. Runtime validation
          (Valibot/Zod) provides an additional safety layer.
        </p>
      </div>
    </div>

    <h2>Next Steps</h2>

    <div class="not-prose grid gap-4 md:grid-cols-2 mt-6">
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
        <h3 class="text-lg font-semibold mb-2">Browse Examples</h3>
        <p class="text-sm text-muted-foreground">
          See all APIs in action with live demos and complete code
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
          Learn which strategy to use for your use case
        </p>
      </a>
    </div>
</div>
