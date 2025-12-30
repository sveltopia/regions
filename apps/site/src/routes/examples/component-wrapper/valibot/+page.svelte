<script lang="ts">
  import CatalogHeader from '$lib/regions/catalog-header/CatalogHeader.svelte';
  import CodeViewer from '$lib/components/CodeViewer.svelte';
  import KeyConcept from '$lib/components/KeyConcept.svelte';
  import SvelteHead from '$lib/components/SvelteHead.svelte';

  // Code examples stored as variables to avoid TS parsing issues
  const schemaCode = `import * as v from 'valibot';
import { valibot } from '@sveltopia/regions';

const _catalogHeaderSchema = v.pipe(
  v.object({
    catalogName: v.string(),
    itemCount: v.number()
  })
);

export type CatalogHeaderData = v.InferOutput<typeof _catalogHeaderSchema>;

export const catalogHeaderSchema = valibot<CatalogHeaderData>(_catalogHeaderSchema, v.parse);`;

  const wrapperCode = `${'<'}script lang="ts">
  import { useLayoutRegions } from '@sveltopia/regions';
  import { catalogHeaderSchema } from './catalogHeaderSchema';

  let { catalogName, itemCount } = $props();

  useLayoutRegions({
    catalogHeader: { catalogName, itemCount }
  });
${'<'}/script>

<!-- This component automatically sets the 'catalogHeader' region when mounted -->`;

  const regionConsumerCode = `${'<'}script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import { catalogHeaderSchema, type CatalogHeaderData } from './catalogHeaderSchema';
${'<'}/script>

<LayoutRegion name="catalogHeader" schema={catalogHeaderSchema}>
  {#snippet children(data: Record<string, unknown>)}
    {@const typedData = data as unknown as CatalogHeaderData}
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">{typedData.catalogName}</h2>
      <p class="text-sm text-muted-foreground">{typedData.itemCount} items</p>
    </div>
  {/snippet}
</LayoutRegion>`;

  const usageCode = `${'<'}script>
  import CatalogHeader from '$lib/regions/catalog-header/CatalogHeader.svelte';
${'<'}/script>

<CatalogHeader catalogName="Spring 2025 Collection" itemCount={42} />`;
</script>

<SvelteHead
  title="Valibot Example - Component Wrapper - @sveltopia/regions"
  description="Component wrapper strategy with Valibot validation. Client-side props with minimal bundle size (~1kb)."
/>

<CatalogHeader catalogName="Spring 2025 Collection" itemCount={42} />

<h2>Component Wrapper + Valibot Validation</h2>

<div class="not-prose mb-8 rounded-lg border bg-indigo-500/5 p-6">
  <h3 class="mb-3 text-lg font-semibold">Quick Start with CLI</h3>
  <p class="mb-4 text-sm text-muted-foreground">Generate this entire pattern automatically:</p>
  <CodeViewer
    filename="terminal"
    language="bash"
    code="npx @sveltopia/regions add catalog-header"
  />
  <p class="mt-4 text-sm text-muted-foreground">
    During the interactive prompts, select <strong>Component Wrapper</strong> strategy and
    <strong>Valibot</strong> validator, then define your fields (catalogName, itemCount).
  </p>
</div>

<h3>How It Works</h3>
<ul>
  <li>
    <strong>Client-side only</strong> - No server load function required, uses simple component props
  </li>
  <li>
    <strong>Valibot validation</strong> - Runtime validation with the smallest validator library (~1kb
    bundle)
  </li>
  <li>
    <strong>Wrapper component pattern</strong> - Create a component that calls useLayoutRegions() to set
    region data
  </li>
  <li><strong>Type-safe props</strong> - Full TypeScript support with automatic type inference</li>
  <li><strong>Simple API</strong> - Use like any other Svelte component with props</li>
</ul>

<h3>Code Examples (used on this page)</h3>

<div class="space-y-8">
  <div class="space-y-6">
    <p class="text-sm font-medium">1. Define your schema with Valibot:</p>
    <CodeViewer
      filename="src/lib/regions/catalog-header/catalogHeaderSchema.ts"
      language="typescript"
      code={schemaCode}
    />
  </div>

  <div class="space-y-6">
    <div>
      <p class="text-sm font-medium">
        2. Create a wrapper component that calls <code class="not-prose">useLayoutRegions()</code> to
        set region data:
      </p>
      <KeyConcept>
        <strong>Key concept:</strong> The wrapper component receives props and passes them to
        <code class="not-prose">useLayoutRegions()</code>, which validates and sets the region data
        for consumption elsewhere in your layout.
      </KeyConcept>
    </div>
    <CodeViewer
      filename="src/lib/regions/catalog-header/CatalogHeader.svelte"
      language="svelte"
      code={wrapperCode}
    />
  </div>

  <div class="space-y-6">
    <p class="text-sm font-medium">
      3. Consume the region in your layout (just like with load functions):
    </p>
    <CodeViewer
      filename="src/lib/regions/catalog-header/CatalogHeaderRegion.svelte"
      language="svelte"
      code={regionConsumerCode}
    />
  </div>

  <div class="space-y-6">
    <p class="text-sm font-medium">
      4. Use the wrapper component anywhere in your pages with simple props &mdash; the wrapper
      handles calling <code class="not-prose">useLayoutRegions()</code>, which validates the data
      and makes it available to the region consumer in your layout.
    </p>
    <CodeViewer
      filename="src/routes/examples/page-component/valibot/+page.svelte"
      language="svelte"
      code={usageCode}
    />
  </div>
</div>
