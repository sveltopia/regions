<script lang="ts">
  import { onMount } from 'svelte';
  import CodeViewer from '$lib/components/CodeViewer.svelte';
  import DecisionQuiz from '$lib/components/quiz/DecisionQuiz.svelte';
  import RegionsAnimation from '$lib/components/RegionsAnimationV2/RegionsAnimation.svelte';
  import MobileAnimation from '$lib/components/RegionsAnimationV2/MobileAnimation.svelte';
  import { Code, Dice3, ShieldCheck } from 'lucide-svelte';

  // Track viewport for conditional animation mounting (performance optimization)
  // Only one animation component is mounted at a time
  let isMobile = $state(false);
  let mounted = $state(false);

  onMount(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    isMobile = mq.matches;
    mounted = true;

    const handler = (e: MediaQueryListEvent) => {
      isMobile = e.matches;
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  });

  // Code examples for each strategy
  const loadFunctionExample = `export const load = () => ({
  regions: {
    pageHeader: {
      title: 'My Page',
      description: 'Server-rendered content'
    }
  }
});`;

  const pageComponentExample = `${'<'}script>
  ${'import'} PageHeader from '$lib/regions/PageHeader.svelte';
${'<'}/script>

<PageHeader
  title="My Page"
  description="Client-side content" />`;

  const snippetExample = `${'<'}script>
  import { useLayoutRegions } from '@sveltopia/regions';

  let count = $state(0);

  useLayoutRegions({
    pageHeader: headerSnippet
  });
${'<'}/script>

{#snippet headerSnippet()}
  <h1>Count: {count}</h1>
  <button onclick={() => count++}>
    Increment
  </button>
{/snippet}`;

  const layoutExample = `${'<'}script>
  import { LayoutRegion } from '@sveltopia/regions';

  let { children } = $props();
${'<'}/script>

<LayoutRegion name="pageHeader" {schema}>
  {#snippet children(data)}
    <h1>{data.title}</h1>
    <p>{data.description}</p>
  {/snippet}
</LayoutRegion>

<main>
  {@render children()}
</main>`;
</script>

<div class="w-full px-4 py-6 sm:py-8 md:container md:mx-auto md:max-w-5xl md:py-12">
  <div class="space-y-4 sm:space-y-8">
    <!-- Hero Section -->
    <div class="space-y-4">
      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">@sveltopia/regions</h1>
      <p class="max-w-2xl text-lg text-muted-foreground sm:text-xl">
        Named content regions for SvelteKit layouts
      </p>
    </div>

    <!-- Visual Storytelling Animation -->
    <!-- Conditionally mount only one animation for performance -->
    {#if mounted}
      {#if isMobile}
        <MobileAnimation />
      {:else}
        <RegionsAnimation />
      {/if}
    {/if}

    <!-- Features Grid -->
    <div class="mt-12 grid gap-6 md:grid-cols-3">
      <div class="rounded-lg bg-muted p-6">
        <div class="mb-4">
          <Code class="text-indigo-600 dark:text-indigo-400" size={24} />
        </div>
        <h3 class="mb-2 font-semibold">"Front Matter" for your Pages</h3>
        <p class="text-sm text-muted-foreground">
          Declare metadata for each page, render them as custom regions in your layouts.
        </p>
      </div>

      <div class="rounded-lg bg-muted p-6">
        <div class="mb-4">
          <Dice3 class="text-indigo-600 dark:text-indigo-400" size={24} />
        </div>
        <h3 class="mb-2 font-semibold">Three Strategies</h3>
        <p class="text-sm text-muted-foreground">
          Choose between load functions, wrapper components, or reactive snippets.
        </p>
      </div>

      <div class="rounded-lg bg-muted p-6">
        <div class="mb-4">
          <ShieldCheck class="text-indigo-600 dark:text-indigo-400" size={24} />
        </div>
        <h3 class="mb-2 font-semibold">Type-Safe</h3>
        <p class="text-sm text-muted-foreground">
          Static type inference and runtime schema validation with Valibot or Zod.
        </p>
      </div>
    </div>

    <!-- CTA -->
    <div class="mt-12 flex flex-col gap-4 sm:flex-row">
      <a
        href="/docs/quick-start"
        class="inline-flex cursor-pointer items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Quick Start
      </a>
      <a
        href="/docs"
        class="inline-flex cursor-pointer items-center justify-center rounded-md border px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
      >
        Docs
      </a>
      <a
        href="/examples"
        class="inline-flex cursor-pointer items-center justify-center rounded-md border px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
      >
        View Examples
      </a>
    </div>

    <!-- Interactive Decision Quiz -->
    <section class="mt-16">
      <div class="mb-12 text-center">
        <h2 class="mb-4 text-3xl font-bold tracking-tight">Are Regions Right for Your Project?</h2>
        <p class="text-xl text-muted-foreground">Take our 60-second quiz</p>
      </div>

      <DecisionQuiz />
    </section>

    <!-- Quick Examples - All 3 Strategies -->
    <div class="mt-16 space-y-8">
      <div>
        <h2 class="mb-2 text-2xl font-bold">Three Ways to Use Regions</h2>
        <p class="text-muted-foreground">
          Choose the strategy that fits your needs - all type-safe, all flexible.
        </p>
      </div>

      <!-- Strategy 1: Load Function -->
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-semibold">1. Load Function (SSR)</h3>
          <p class="text-sm text-muted-foreground">
            Server-rendered with validation and type safety. Best for SEO and zero layout shift.
          </p>
        </div>
        <CodeViewer filename="+page.server.ts" language="typescript" code={loadFunctionExample} />
      </div>

      <!-- Strategy 2: Component Wrapper -->
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-semibold">2. Component Wrapper (Rendered Client-Side)</h3>
          <p class="text-sm text-muted-foreground">
            Simple wrapper components with props. Fast and intuitive.
          </p>
        </div>
        <CodeViewer filename="+page.svelte" language="svelte" code={pageComponentExample} />
      </div>

      <!-- Strategy 3: Snippet -->
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-semibold">
            3. Snippet (Rendered Client-Side, Maximum Flexibility)
          </h3>
          <p class="text-sm text-muted-foreground">
            Full access to page state. Perfect for interactive UIs.
          </p>
        </div>
        <CodeViewer filename="+page.svelte" language="svelte" code={snippetExample} />
      </div>

      <!-- Layout consumption example -->
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-semibold">Then consume in your layout</h3>
          <p class="text-sm text-muted-foreground">
            All strategies use the same LayoutRegion component.
          </p>
        </div>
        <CodeViewer filename="+layout.svelte" language="svelte" code={layoutExample} />
      </div>
    </div>

    <!-- Bottom CTA -->
    <div class="mt-12 flex flex-col gap-4 sm:flex-row">
      <a
        href="/docs/quick-start"
        class="inline-flex cursor-pointer items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Quick Start
      </a>
      <a
        href="/docs"
        class="inline-flex cursor-pointer items-center justify-center rounded-md border px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
      >
        Docs
      </a>
      <a
        href="/examples"
        class="inline-flex cursor-pointer items-center justify-center rounded-md border px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
      >
        View Examples
      </a>
    </div>
  </div>
</div>
