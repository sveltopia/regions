<script lang="ts">
	import GalleryHeader from '$lib/regions/gallery-header/GalleryHeader.svelte';
	import CodeViewer from '$lib/components/CodeViewer.svelte';
	import KeyConcept from '$lib/components/KeyConcept.svelte';

	// Code examples stored as variables to avoid TS parsing issues
	const schemaCode = `import { z } from 'zod';
import { zod } from '@sveltopia/regions';

const _galleryHeaderSchema = z.object({
  galleryTitle: z.string(),
  imageCount: z.number()
});

export type GalleryHeaderData = z.infer<typeof _galleryHeaderSchema>;

export const galleryHeaderSchema = zod<GalleryHeaderData>(_galleryHeaderSchema);`;

	const wrapperCode = `${'<'}script lang="ts">
  import { useLayoutRegions } from '@sveltopia/regions';
  import { galleryHeaderSchema } from './galleryHeaderSchema';

  let { galleryTitle, imageCount } = $props();

  useLayoutRegions({
    galleryHeader: { galleryTitle, imageCount }
  });
${'<'}/script>

<!-- This component automatically sets the 'galleryHeader' region when mounted -->`;

	const regionConsumerCode = `${'<'}script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import { galleryHeaderSchema, type GalleryHeaderData } from './galleryHeaderSchema';
${'<'}/script>

<LayoutRegion name="galleryHeader" schema={galleryHeaderSchema}>
  {#snippet children(data: Record<string, unknown>)}
    {@const typedData = data as unknown as GalleryHeaderData}
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">{typedData.galleryTitle}</h2>
      <p class="text-sm text-muted-foreground">{typedData.imageCount} images</p>
    </div>
  {/snippet}
</LayoutRegion>`;

	const usageCode = `${'<'}script>
  import GalleryHeader from '$lib/regions/gallery-header/GalleryHeader.svelte';
${'<'}/script>

<GalleryHeader galleryTitle="Nature Photography" imageCount={127} />`;
</script>

<GalleryHeader galleryTitle="Nature Photography" imageCount={127} />

<h2>Component Wrapper + Zod Validation</h2>

<div class="not-prose mb-8 rounded-lg border bg-indigo-500/5 p-6">
  <h3 class="text-lg font-semibold mb-3">Quick Start with CLI</h3>
  <p class="text-sm text-muted-foreground mb-4">
    Generate this entire pattern automatically:
  </p>
  <CodeViewer
    filename="terminal"
    language="bash"
    code="npx @sveltopia/regions add gallery-header" />
  <p class="text-sm text-muted-foreground mt-4">
    During the interactive prompts, select <strong>Component Wrapper</strong> strategy
    and <strong>Zod</strong> validator, then define your fields (galleryTitle, imageCount).
  </p>
</div>

<h3>How It Works</h3>
<ul>
	<li><strong>Client-side only</strong> - No server load function required, uses simple component props</li>
	<li><strong>Zod validation</strong> - Runtime validation with the most popular TypeScript schema validator (~14kb bundle)</li>
	<li><strong>Wrapper component pattern</strong> - Create a component that calls <code class="not-prose">useLayoutRegions()</code> to set region data</li>
	<li><strong>Type-safe props</strong> - Full TypeScript support with automatic type inference</li>
	<li><strong>Simple API</strong> - Use like any other Svelte component with props</li>
</ul>

<h3>Code Examples (used on this page)</h3>

<div class="space-y-8">
	<div class="space-y-6">
		<p class="text-sm font-medium">1. Define your schema with Zod:</p>
		<CodeViewer
			filename="src/lib/regions/gallery-header/galleryHeaderSchema.ts"
			language="typescript"
			code={schemaCode}
		/>
	</div>

	<div class="space-y-6">
		<div>
			<p class="text-sm font-medium">2. Create a wrapper component that calls <code class="not-prose">useLayoutRegions()</code> to set region data:</p>
			<KeyConcept>
				<strong>Key concept:</strong> The wrapper component receives props and passes them to <code class="not-prose">useLayoutRegions()</code>, which validates and sets the region data for consumption elsewhere in your layout.
			</KeyConcept>
		</div>
		<CodeViewer
			filename="src/lib/regions/gallery-header/GalleryHeader.svelte"
			language="svelte"
			code={wrapperCode}
		/>
	</div>

	<div class="space-y-6">
		<p class="text-sm font-medium">3. Consume the region in your layout (just like with load functions):</p>
		<CodeViewer
			filename="src/lib/regions/gallery-header/GalleryHeaderRegion.svelte"
			language="svelte"
			code={regionConsumerCode}
		/>
	</div>

	<div class="space-y-6">
		<p class="text-sm font-medium">4. Use the wrapper component anywhere in your pages with simple props &mdash; the wrapper handles calling <code class="not-prose">useLayoutRegions()</code>, which validates the data and makes it available to the region consumer in your layout.</p>
		<CodeViewer
			filename="src/routes/examples/page-component/zod/+page.svelte"
			language="svelte"
			code={usageCode}
		/>
	</div>
</div>
