<script lang="ts">
  import CodeViewer from '$lib/components/CodeViewer.svelte';
  import KeyConcept from '$lib/components/KeyConcept.svelte';

  // Code examples
  const regionConsumerCode = `${'<'}script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import type { Snippet } from 'svelte';
${' <'}/script>

<LayoutRegion<Snippet> name="counter">
  {#snippet children(snippet)}
    {@render snippet()}
  {/snippet}
</LayoutRegion>`;

  const pageSnippetCode = `${'<'}script lang="ts">
  import { useLayoutRegions } from '@sveltopia/regions';

  let count = $state(0);

  useLayoutRegions({
    'counter': counterSnippet
  });
${' <'}/script>

{#snippet counterSnippet()}
  <div>
    <h1>Counter: {count}</h1>
    <button onclick={() => count++}>
      Increment
    </button>
  </div>
{/snippet}

<!-- The snippet has full access to count and updates reactively -->`;
</script>

<h2>Snippet Strategy</h2>

<div class="not-prose mb-8 rounded-lg border bg-indigo-500/5 p-6">
  <h3 class="mb-3 text-lg font-semibold">Quick Start with CLI</h3>
  <p class="mb-4 text-sm text-muted-foreground">Generate this entire pattern automatically:</p>
  <CodeViewer filename="terminal" language="bash" code="npx @sveltopia/regions add counter" />
  <p class="mt-4 text-sm text-muted-foreground">
    During the interactive prompts, select <strong>Snippet</strong> strategy. The CLI generates a region
    consumer that accepts Snippets and an example layout with snippet definition.
  </p>
</div>

<h3>How It Works</h3>
<ul>
  <li><strong>Maximum flexibility</strong> - Full access to page state, props, and context</li>
  <li><strong>Reactive</strong> - Updates automatically when page state changes</li>
  <li><strong>Inline definition</strong> - No separate component files needed</li>
  <li><strong>Type-safe</strong> - Snippet signatures provide compile-time type checking</li>
  <li>
    <strong>TypeScript only</strong> - Snippets use compile-time validation (runtime validation would
    be redundant)
  </li>
</ul>

<h3>Code Example</h3>

<div class="space-y-8">
  <div class="space-y-6">
    <div>
      <p class="text-sm font-medium">1. Create a region consumer that accepts a Snippet type:</p>
      <KeyConcept>
        <strong>Note:</strong> The LayoutRegion is typed to accept a Snippet, and renders it directly
        with the render tag.
      </KeyConcept>
    </div>
    <CodeViewer
      filename="src/lib/regions/counter/CounterRegion.svelte"
      language="svelte"
      code={regionConsumerCode}
    />
  </div>

  <div class="space-y-6">
    <div>
      <p class="text-sm font-medium">
        2. In your page component, define a snippet and pass it to useLayoutRegions():
      </p>
      <KeyConcept>
        <strong>Key concept:</strong> The snippet has full access to the page's reactive state (count).
        When count changes, the snippet automatically re-renders in the layout.
      </KeyConcept>
    </div>
    <CodeViewer
      filename="src/routes/my-page/+page.svelte"
      language="svelte"
      code={pageSnippetCode}
    />
  </div>
</div>

<h3>Why TypeScript Only?</h3>
<KeyConcept>
  <strong>Snippets are type-safe by design.</strong> Unlike data objects or component props, snippets
  are defined with explicit signatures that TypeScript validates at compile-time. Adding runtime validation
  (Valibot/Zod) would be redundant and add unnecessary bundle size.
</KeyConcept>

<h3>When to Use Snippets</h3>
<ul>
  <li>Highly interactive UIs - Counters, forms, real-time updates</li>
  <li>Need full page state access - Reactive data, derived values, local state</li>
  <li>Complex rendering logic - Conditional rendering based on page state</li>
  <li>Maximum control and flexibility - When other strategies feel too restrictive</li>
</ul>

<h3>vs. Other Strategies</h3>
<div class="mb-6 grid gap-4 md:grid-cols-2">
  <div class="rounded-lg border p-4">
    <h4 class="mb-2 font-semibold">Load Function Strategy</h4>
    <p class="mb-2 text-sm text-muted-foreground">
      <strong>Better for:</strong> SEO, SSR, zero layout shift, server-side data fetching
    </p>
    <p class="text-sm text-muted-foreground">
      <strong>Trade-off:</strong> Less reactive, can't access page state
    </p>
  </div>

  <div class="rounded-lg border p-4">
    <h4 class="mb-2 font-semibold">Component Wrapper Strategy</h4>
    <p class="mb-2 text-sm text-muted-foreground">
      <strong>Better for:</strong> Simple APIs, rapid development, reusable wrappers
    </p>
    <p class="text-sm text-muted-foreground">
      <strong>Trade-off:</strong> Less flexible, requires separate component files
    </p>
  </div>
</div>

<p class="mb-8 text-sm text-muted-foreground">
  <strong>Choose snippets</strong> when you need maximum flexibility and reactivity.
  <strong>Choose load functions</strong> when you need SEO and SSR.
  <strong>Choose component wrappers</strong> when you want simplicity and reusability.
</p>
