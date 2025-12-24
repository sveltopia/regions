<script lang="ts">
  import ProfileHeader from "$lib/regions/profile-header/ProfileHeader.svelte";
  import CodeViewer from "$lib/components/CodeViewer.svelte";
  import KeyConcept from "$lib/components/KeyConcept.svelte";

  // Code examples stored as variables to avoid TS parsing issues
  const typeCode = `/**
 * TypeScript-only type definition (no runtime validation).
 * For runtime validation, regenerate this region with Valibot or Zod.
 */
export interface ProfileHeaderData {
  username: string;
  bio: string;
}`;

  const wrapperCode = `${"<"}script lang="ts">
  import { useLayoutRegions } from '@sveltopia/regions';

  let { username, bio } = $props();

  useLayoutRegions({
    profileHeader: { username, bio }
  });
${"<"}/script>

<!-- This component automatically sets the 'profileHeader' region when mounted -->`;

  const regionConsumerCode = `${"<"}script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import type { ProfileHeaderData } from './ProfileHeaderData';
${"<"}/script>

<LayoutRegion name="profileHeader">
  {#snippet children(data: Record<string, unknown>)}
    {@const typedData = data as unknown as ProfileHeaderData}
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">@{typedData.username}</h2>
      <p class="text-muted-foreground">{typedData.bio}</p>
    </div>
  {/snippet}
</LayoutRegion>`;

  const usageCode = `${"<"}script>
  import ProfileHeader from '$lib/regions/profile-header/ProfileHeader.svelte';
${"<"}/script>

<ProfileHeader
  username="johndoe"
  bio="Full-stack developer passionate about building great web experiences with Svelte and TypeScript."
/>`;
</script>

<ProfileHeader
  username="johndoe"
  bio="Full-stack developer passionate about building great web experiences with Svelte and TypeScript." />

<h2>Component Wrapper + TypeScript Only</h2>

<div class="not-prose mb-8 rounded-lg border bg-indigo-500/5 p-6">
  <h3 class="text-lg font-semibold mb-3">Quick Start with CLI</h3>
  <p class="text-sm text-muted-foreground mb-4">
    Generate this entire pattern automatically:
  </p>
  <CodeViewer
    filename="terminal"
    language="bash"
    code="npx @sveltopia/regions add profile-header" />
  <p class="text-sm text-muted-foreground mt-4">
    During the interactive prompts, select <strong>Component Wrapper</strong> strategy
    and <strong>TypeScript only</strong> validator, then define your fields (username,
    bio).
  </p>
</div>

<h3>How It Works</h3>
<ul>
  <li>
    <strong>Client-side only</strong> - No server load function required, uses simple
    component props
  </li>
  <li>
    <strong>TypeScript only</strong> - Compile-time type checking with no runtime
    validation overhead (0kb validator bundle)
  </li>
  <li>
    <strong>Wrapper component pattern</strong> - Create a component that calls
    <code class="not-prose">useLayoutRegions()</code> to set region data
  </li>
  <li>
    <strong>Type-safe props</strong> - Full TypeScript support with interface definitions
  </li>
  <li>
    <strong>Simple API</strong> - Use like any other Svelte component with props
  </li>
</ul>

<h3>Code Examples (used on this page)</h3>

<div class="space-y-8">
  <div class="space-y-6">
    <p class="text-sm font-medium">
      1. Define your type with a TypeScript interface:
    </p>
    <CodeViewer
      filename="src/lib/regions/profile-header/ProfileHeaderData.ts"
      language="typescript"
      code={typeCode} />
  </div>

  <div class="space-y-6">
    <div>
      <p class="text-sm font-medium">
        2. Create a wrapper component that calls <code class="not-prose"
          >useLayoutRegions()</code> to set region data:
      </p>
      <KeyConcept>
        <strong>Key concept:</strong> The wrapper component receives props and
        passes them to <code class="not-prose">useLayoutRegions()</code>, which
        sets the region data for consumption elsewhere in your layout (no
        runtime validation).
      </KeyConcept>
    </div>
    <CodeViewer
      filename="src/lib/regions/profile-header/ProfileHeader.svelte"
      language="svelte"
      code={wrapperCode} />
  </div>

  <div class="space-y-6">
    <p class="text-sm font-medium">
      3. Consume the region in your layout (just like with load functions):
    </p>
    <CodeViewer
      filename="src/lib/regions/profile-header/ProfileHeaderRegion.svelte"
      language="svelte"
      code={regionConsumerCode} />
  </div>

  <div class="space-y-6">
    <p class="text-sm font-medium">
      4. Use the wrapper component anywhere in your pages with simple props
      &mdash; the wrapper handles calling <code class="not-prose"
        >useLayoutRegions()</code
      >, which makes the data available to the region consumer in your layout
      (with compile-time type checking only).
    </p>
    <CodeViewer
      filename="src/routes/examples/page-component/typescript-only/+page.svelte"
      language="svelte"
      code={usageCode} />
  </div>
</div>
