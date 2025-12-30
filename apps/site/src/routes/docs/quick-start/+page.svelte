<script lang="ts">
  import CodeViewer from '$lib/components/CodeViewer.svelte';
  import KeyConcept from '$lib/components/KeyConcept.svelte';
  import SvelteHead from '$lib/components/SvelteHead.svelte';
  import { TrendingUp, LayoutGrid, ArrowRight } from 'lucide-svelte';

  const installCode = `npm install @sveltopia/regions
# or
pnpm add @sveltopia/regions
# or
yarn add @sveltopia/regions`;

  const cliAddCommand = `npx @sveltopia/regions add page-header`;

  const cliInteractive = `┌  Sveltopia Regions Generator
│
◆  What strategy would you like to use?
│  ● Load function (+page.server.ts) - Recommended for SEO, no layout shift
│  ○ Component wrapper (useLayoutRegions) - Simple, client-side
│  ○ Snippet region - Advanced, full reactivity
│
◆  What fields should this region have? (comma-separated)
│  title, description
│
◆  Type for "title"?
│  ● string
│  ○ number
│  ○ boolean
│
◆  Is "title" required?
│  ● Yes / ○ No
│
◆  Type for "description"?
│  ● string
│  ○ number
│  ○ boolean
│
◆  Is "description" required?
│  ○ Yes / ● No
│
◆  Which validator would you like to use?
│  ○ None (TypeScript only - no runtime validation)
│  ● Valibot (recommended - smaller bundle)
│  ○ Zod
│
◆  Where should server load run?
│  ● +page.server.ts (server-only, recommended)
│  ○ +page.ts (universal)
│
◆  Where should we generate the load function example?
│  src/routes/example
│
◇  Files created!
│
◇  Created files ───────────────────────────────────────╮
│                                                       │
│  ✓ src/lib/regions/page-header/pageHeaderSchema.ts    │
│  ✓ src/lib/regions/page-header/PageHeaderRegion.svelte│
│  ✓ src/routes/example/+page.server.ts                 │
│                                                       │
└───────────────────────────────────────────────────────╯`;

  const generatedSchema = `import * as v from 'valibot';
import { valibot } from '@sveltopia/regions';

const _pageHeaderSchema = v.pipe(
  v.object({
    title: v.string(),
    description: v.optional(v.string())
  })
);

export type PageHeaderData = v.InferOutput<typeof _pageHeaderSchema>;

export const pageHeaderSchema = valibot<PageHeaderData>(_pageHeaderSchema, v.parse);`;

  const generatedLoadFunction = `import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return {
    regions: {
      pageHeader: {
        title: 'TODO: Replace with your title',
        description: 'TODO: Replace with your description'
      }
    }
  };
};`;

  const generatedConsumer = `${'<'}script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import { pageHeaderSchema, type PageHeaderData } from './pageHeaderSchema';
${'<'}/script>

<LayoutRegion name="pageHeader" schema={pageHeaderSchema}>
  {#snippet children(data: Record<string, unknown> | undefined)}
    {@const typedData = data as unknown as PageHeaderData}
    <!-- Insert your UI here -->
    {typedData.title}
    {#if typedData.description}
      {typedData.description}
    {/if}
  {/snippet}
</LayoutRegion>`;

  const nextSteps = `◇  Next steps ─────────────────────────────────────────────────────────────╮
│                                                                          │
│  1. Ensure your root +layout.svelte wraps everything in <LayoutRegions>: │
│     ${'<'}script lang="ts">                                                   │
│       import { LayoutRegions } from '@sveltopia/regions';                │
│     ${'<'}/script>                                                            │
│     <LayoutRegions>{@render children()}</LayoutRegions>                  │
│     Note: Required for regions to work (one-time setup)                  │
│                                                                          │
│  2. Add the region consumer to your +layout.svelte:                      │
│     ${'<'}script lang="ts">                                                   │
│       import PageHeaderRegion from                                       │
│         '$lib/regions/page-header/PageHeaderRegion.svelte'               │
│     ${'<'}/script>                                                            │
│     <PageHeaderRegion />                                                 │
│                                                                          │
│  3. Customize the region UI in PageHeaderRegion.svelte:                  │
│     - Wrap your data properties with your desired HTML/UI                │
│     - The data properties (title, description) are already inserted      │
│                                                                          │
│  4. Move the generated load function to your actual page route(s):       │
│     - Copy src/routes/example/+page.server.ts                            │
│     - To your page route (e.g., src/routes/products/+page.server.ts)     │
│     - Update the TODO placeholders with real data                        │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────╯
│
└  Done!`;
</script>

<SvelteHead
  title="Quick Start - @sveltopia/regions"
  description="Get started with @sveltopia/regions in under 5 minutes. Use the CLI to generate your first region, or set up manually with our step-by-step guide."
/>

<div class="prose max-w-none dark:prose-invert">
  <h1>Quick Start</h1>
  <p class="lead">
    Generate complete region boilerplate with one command. The fastest way to add regions to your
    project.
  </p>

  <h2>Installation</h2>
  <p>Install the package using your preferred package manager:</p>

  <div class="not-prose">
    <CodeViewer filename="terminal" language="bash" code={installCode} />
  </div>

  <h3>Requirements</h3>
  <ul>
    <li><strong>SvelteKit 2+</strong></li>
    <li><strong>Svelte 5+</strong> (uses runes)</li>
  </ul>

  <h2>One-Time Setup</h2>

  <p>
    Before creating your first region, you need to wrap your root layout with <code
      class="not-prose">LayoutRegions</code
    >. This is a <strong>one-time setup</strong> that enables the region system throughout your app.
  </p>

  <div class="not-prose mb-6">
    <CodeViewer
      filename="src/routes/+layout.svelte"
      language="svelte"
      code={`${'<'}script lang="ts">
  import { LayoutRegions } from '@sveltopia/regions';

  let { children } = $props();
${'<'}/script>

<LayoutRegions>
  {@render children()}
</LayoutRegions>`}
    />
  </div>

  <KeyConcept>
    <strong>Important:</strong> All regions need a
    <code class="not-prose">LayoutRegions</code>
    wrapper somewhere above them in the layout hierarchy. The easiest approach is to add it to your root
    <code class="not-prose">src/routes/+layout.svelte</code> file—this covers all regions throughout your
    entire app.
  </KeyConcept>

  <h2>The Command</h2>

  <div class="not-prose">
    <CodeViewer filename="terminal" language="bash" code={cliAddCommand} />
  </div>

  <p>
    Replace <code class="not-prose">page-header</code> with your desired region name (e.g.,
    <code class="not-prose">dashboard-stats</code>,
    <code class="not-prose">userProfile</code>,
    <code class="not-prose">product-details</code>). Both kebab-case and camelCase work.
  </p>

  <p>
    This single command generates everything you need: schema, wrapper component, region consumer,
    and type definitions.
  </p>

  <h2>Interactive Prompts</h2>

  <p>The CLI guides you through configuration with friendly prompts:</p>

  <ol>
    <li>
      <strong>Strategy selection</strong> - Choose Load function (SSR), Component wrapper, or Snippet
    </li>
    <li>
      <strong>Field definitions</strong> - Define your data fields as comma-separated list
    </li>
    <li>
      <strong>Field types</strong> - For each field, choose string/number/boolean and required/optional
    </li>
    <li>
      <strong>Validator choice</strong> - Pick Valibot, Zod, or TypeScript-only
    </li>
    <li>
      <strong>Load location</strong> - Server-only (+page.server.ts) or universal (+page.ts)
    </li>
    <li>
      <strong>Example path</strong> - Where to generate the example load function or layout file
    </li>
  </ol>

  <div class="not-prose">
    <CodeViewer filename="terminal" language="bash" code={cliInteractive} />
  </div>

  <KeyConcept>
    <strong>Zero manual setup.</strong> The CLI creates all files and provides clear next steps for integrating
    the region into your app.
  </KeyConcept>

  <h2>What Gets Generated</h2>

  <div class="not-prose space-y-8">
    <div class="space-y-6">
      <div>
        <h3 class="mb-2 text-lg font-semibold">1. Schema Definition</h3>
        <p class="text-sm text-muted-foreground">
          Type-safe schema with your chosen validation library (or TypeScript only).
        </p>
      </div>
      <CodeViewer
        filename="src/lib/regions/page-header/pageHeaderSchema.ts"
        language="typescript"
        code={generatedSchema}
      />
    </div>

    <div class="space-y-6">
      <div>
        <h3 class="mb-2 text-lg font-semibold">2. Region Consumer</h3>
        <p class="text-sm text-muted-foreground">
          Layout component that renders the region content with validation. Wrap your data in
          whatever UI/HTML you'd like.
        </p>
      </div>
      <CodeViewer
        filename="src/lib/regions/page-header/PageHeaderRegion.svelte"
        language="svelte"
        code={generatedConsumer}
      />
    </div>

    <div class="space-y-6">
      <div>
        <h3 class="mb-2 text-lg font-semibold">3. Example Load Function</h3>
        <p class="text-sm text-muted-foreground">
          Example +page.server.ts showing how to use the region in your pages.
        </p>
      </div>
      <CodeViewer
        filename="src/routes/example/+page.server.ts"
        language="typescript"
        code={generatedLoadFunction}
      />
      <KeyConcept>
        <strong>Note:</strong> Load functions work in both
        <code class="rounded bg-muted px-1 py-0.5">+page.server.ts</code>
        and
        <code class="rounded bg-muted px-1 py-0.5">+layout.server.ts</code>
        files. See
        <a href="/docs/advanced" class="text-indigo-600 hover:underline dark:text-indigo-400"
          >Advanced Patterns</a
        > for layout-level regions and inheritance.
      </KeyConcept>
    </div>
  </div>

  <h2>Next Steps</h2>

  <p>After generation, the CLI provides clear instructions for integrating the region:</p>

  <div class="not-prose">
    <CodeViewer filename="terminal" language="bash" code={nextSteps} />
  </div>

  <h2>Validation Options</h2>

  <div class="not-prose mb-8 space-y-4">
    <div class="rounded-lg border p-4">
      <h3 class="mb-2 font-semibold">Valibot (Recommended)</h3>
      <ul class="space-y-1 text-sm text-muted-foreground">
        <li>• Smallest bundle size (~1kb)</li>
        <li>• Modern, type-safe API</li>
        <li>• Perfect for most use cases</li>
      </ul>
    </div>

    <div class="rounded-lg border p-4">
      <h3 class="mb-2 font-semibold">Zod</h3>
      <ul class="space-y-1 text-sm text-muted-foreground">
        <li>• Popular, feature-rich</li>
        <li>• Great if already using Zod</li>
        <li>• Larger bundle (~14kb)</li>
      </ul>
    </div>

    <div class="rounded-lg border p-4">
      <h3 class="mb-2 font-semibold">TypeScript Only</h3>
      <ul class="space-y-1 text-sm text-muted-foreground">
        <li>• Zero runtime validation</li>
        <li>• Smallest possible bundle</li>
        <li>• Compile-time safety only</li>
      </ul>
    </div>
  </div>

  <h2>Benefits</h2>

  <ul>
    <li>
      <strong>Saves time</strong> - 30 seconds vs 5+ minutes of manual setup
    </li>
    <li>
      <strong>Zero errors</strong> - Generated code is correct by default
    </li>
    <li>
      <strong>Consistent patterns</strong> - All regions follow the same structure
    </li>
    <li>
      <strong>Type-safe</strong> - Full TypeScript support out of the box
    </li>
    <li>
      <strong>Best practices</strong> - Uses recommended patterns and validation
    </li>
  </ul>

  <h2>Next Steps</h2>

  <div class="not-prose mt-6 grid gap-4 md:grid-cols-2">
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
        Compare all three strategies: load functions, component wrappers, and snippets.
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
        Explore all three strategies with live demos and complete code
      </p>
    </a>
  </div>
</div>
