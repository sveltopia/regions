<script lang="ts">
  import CodeViewer from '$lib/components/CodeViewer.svelte';

  // Code examples stored as variables to avoid TS parsing issues
  const schemaCode = `import { z } from 'zod';
import type { RegionSchema } from '@sveltopia/regions';

const _productHeaderSchema = z.object({
  productName: z.string(),
  price: z.number(),
  inStock: z.boolean()
});

export type ProductHeaderData = z.infer<typeof _productHeaderSchema>;

export const productHeaderSchema = _productHeaderSchema satisfies RegionSchema<ProductHeaderData>;`;

  const loadFunctionCode = `import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    regions: {
      productHeader: {
        productName: 'Premium Wireless Headphones',
        price: 299.99,
        inStock: true
      }
    }
  };
};`;

  const regionConsumerCode = `${'<'}script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import { productHeaderSchema, type ProductHeaderData } from './productHeaderSchema';
${'<'}/script>

<LayoutRegion name="productHeader" schema={productHeaderSchema}>
  {#snippet children(data: Record<string, unknown>)}
    {@const typedData = data as ProductHeaderData}
    <div class="product-header">
      <h1>{typedData.productName}</h1>
      <div class="product-meta">
        <span class="price">\${typedData.price}</span>
        <span class="stock {typedData.inStock ? 'in-stock' : 'out-of-stock'}">
          {typedData.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
    </div>
  {/snippet}
</LayoutRegion>`;

  const componentAbstractedCode = `${'<'}script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import { productHeaderSchema, type ProductHeaderData } from './productHeaderSchema';
${'<'}/script>

<LayoutRegion name="productHeader" schema={productHeaderSchema}>
  {#snippet children(data: Record<string, unknown>)}
    {@const typedData = data as ProductHeaderData}
    <div class="product-header">
      <h1>{typedData.productName}</h1>
      <div class="product-meta">
        <span class="price">\${typedData.price}</span>
        <span class="stock {typedData.inStock ? 'in-stock' : 'out-of-stock'}">
          {typedData.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
    </div>
  {/snippet}
</LayoutRegion>`;

  const cleanLayoutCode = `${'<'}script lang="ts">
  import ProductHeaderRegion from '$lib/regions/product-header/ProductHeaderRegion.svelte';

  let { children } = $props();
${'<'}/script>

<ProductHeaderRegion />

<main class="content">
  {@render children()}
</main>`;
</script>

<h2>Load Function + Zod Validation</h2>

<div class="not-prose mb-8 rounded-lg border bg-indigo-500/5 p-6">
  <h3 class="mb-3 text-lg font-semibold">Quick Start with CLI</h3>
  <p class="mb-4 text-sm text-muted-foreground">Generate this entire pattern automatically:</p>
  <CodeViewer
    filename="terminal"
    language="bash"
    code="npx @sveltopia/regions add product-header"
  />
  <p class="mt-4 text-sm text-muted-foreground">
    During the interactive prompts, select <strong>Load function</strong> strategy and
    <strong>Zod</strong> validator, then define your fields (productName, price, inStock).
  </p>
</div>

<h3>How It Works</h3>
<ul>
  <li>
    <strong>Most Svelte-native approach</strong> - Uses standard SvelteKit
    <code class="not-prose">load()</code> functions to pass data from page to layout
  </li>
  <li>
    <strong>Server-side rendered</strong> - Data is available immediately on page load, no client-side
    fetching
  </li>
  <li>
    <strong>Zod validation</strong> - The LayoutRegion component automatically validates incoming data
    against your schema (~14kb bundle)
  </li>
  <li>
    <strong>SEO-friendly</strong> - Content is in the initial HTML response for search engines
  </li>
  <li>
    <strong>Zero layout shift</strong> - No hydration flicker or content jumping
  </li>
  <li>
    <strong>Type-safe</strong> - Full TypeScript support with automatic type inference
  </li>
</ul>

<h3>Code Examples (used on this page)</h3>

<div class="space-y-8">
  <div class="space-y-6">
    <p class="text-sm font-medium">1. Define your schema with Zod:</p>
    <CodeViewer
      filename="src/lib/regions/product-header/productHeaderSchema.ts"
      language="typescript"
      code={schemaCode}
    />
  </div>

  <div class="space-y-6">
    <p class="text-sm font-medium">2. Return region data from your load function:</p>
    <CodeViewer
      filename="src/routes/examples/load-function/zod/+page.server.ts"
      language="typescript"
      code={loadFunctionCode}
    />
  </div>

  <div class="space-y-6">
    <div>
      <p class="text-sm font-medium">
        3. Consume the region in your +layout.svelte file, passing the Zod schema to LayoutRegion
        for automatic validation:
      </p>
      <p class="text-sm text-muted-foreground">
        <strong>Note:</strong> The
        <code class="not-prose">@const typedData = data as ProductHeaderData</code>
        line narrows the type from
        <code class="not-prose">Record&lt;string, unknown&gt;</code>
        to your specific schema type for full TypeScript autocomplete and type safety.
        <a
          href="https://svelte.dev/docs/svelte/snippet#Typing-snippets"
          target="_blank"
          class="underline">Learn more about typing snippets</a
        >.
      </p>
    </div>
    <CodeViewer
      filename="src/routes/examples/load-function/zod/+layout.svelte"
      language="svelte"
      code={regionConsumerCode}
    />
  </div>

  <div class="space-y-6">
    <p class="text-sm font-medium">
      4. Or, abstract the region to its own component for better organization (this is how our CLI
      generates regions):
    </p>
    <CodeViewer
      filename="src/lib/regions/product-header/ProductHeaderRegion.svelte"
      language="svelte"
      code={componentAbstractedCode}
    />
  </div>

  <div class="space-y-6">
    <p class="text-sm font-medium">
      5. Then your +layout.svelte stays clean and organized &mdash; the region is now a
      self-contained component with its own schema, validation, and UI.
    </p>
    <CodeViewer
      filename="src/routes/examples/load-function/zod/+layout.svelte"
      language="svelte"
      code={cleanLayoutCode}
    />
  </div>
</div>
