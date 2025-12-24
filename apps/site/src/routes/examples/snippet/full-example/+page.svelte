<script lang="ts">
  import { useLayoutRegions } from "@sveltopia/regions";
  import CodeViewer from "$lib/components/CodeViewer.svelte";
  import KeyConcept from "$lib/components/KeyConcept.svelte";
  import RegionIndicator from "$lib/components/RegionIndicator.svelte";
  import SettingsPanel from "$lib/components/snippets/SettingsPanel.svelte";

  // Example 1: Product Header - user interaction
  const adjectives = [
    "elegant",
    "underrated",
    "magic",
    "delightful",
    "intuitive",
    "beloved",
    "performant",
    "set apart",
    "poetry",
  ];
  let currentIndex = $state(0);

  function nextAdjective() {
    currentIndex = (currentIndex + 1) % adjectives.length;
  }

  // Example 2: Settings Header - component wrapping
  let theme = $state<"light" | "dark" | "system">("system");
  let notificationsEnabled = $state(true);

  function handleThemeChange(newTheme: "light" | "dark" | "system") {
    theme = newTheme;
  }

  function handleNotificationToggle() {
    notificationsEnabled = !notificationsEnabled;
  }

  // Example 3: Stats Header - reactive state access
  let viewCount = $state(0);
  let conversionRate = $state(3.2);

  // Register all 3 snippets with layout regions
  useLayoutRegions({
    productHeader: productHeaderSnippet as any,
    settingsHeader: settingsHeaderSnippet as any,
    statsHeader: statsHeaderSnippet as any,
  });

  // Code examples stored as variables to avoid TS parsing issues
  const pageCode = `${"<"}script lang="ts">
  import { useLayoutRegions } from '@sveltopia/regions';
  import SettingsPanel from '$lib/components/snippets/SettingsPanel.svelte';

  // Example 1: User Interaction
  const adjectives = ['elegant', 'underrated', 'magic', 'delightful'];
  let currentIndex = $state(0);
  function nextAdjective() {
    currentIndex = (currentIndex + 1) % adjectives.length;
  }

  // Example 2: Component Wrapping
  let theme = $state<'light' | 'dark' | 'system'>('system');
  let notificationsEnabled = $state(true);

  // Example 3: Reactive State Access
  let viewCount = $state(0);
  let conversionRate = $state(3.2);

  // Register all snippets
  useLayoutRegions({
    productHeader: productHeaderSnippet,
    settingsHeader: settingsHeaderSnippet,
    statsHeader: statsHeaderSnippet
  });
${"<"}/script>

<!-- Example 1: User Interaction -->
{#snippet productHeaderSnippet()}
  <div>
    <h2>Svelte is {adjectives[currentIndex]}</h2>
    <button onclick={nextAdjective}>Next</button>
  </div>
{/snippet}

<!-- Example 2: Component Wrapping -->
{#snippet settingsHeaderSnippet()}
  <SettingsPanel
    {theme}
    {notificationsEnabled}
    onThemeChange={(t) => theme = t}
    onNotificationToggle={() => notificationsEnabled = !notificationsEnabled}
  />
{/snippet}

<!-- Example 3: Reactive State Access -->
{#snippet statsHeaderSnippet()}
  <div>
    <h2>Stats: {viewCount} views, {conversionRate}% conversion</h2>
    <button onclick={() => viewCount++}>Update</button>
  </div>
{/snippet}`;

  const regionConsumerCode = `${"<"}script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import type { Snippet } from 'svelte';

  // Simple schema for snippets (no runtime validation needed)
  const snippetSchema = {
    parse: (data: unknown) => data as Snippet<[]>
  };
${"<"}/script>

<!-- Example 1: User Interaction -->
<LayoutRegion name="productHeader" schema={snippetSchema}>
  {#snippet children(snippet)}
    {@render snippet()}
  {/snippet}
</LayoutRegion>

<!-- Example 2: Component Wrapping -->
<LayoutRegion name="settingsHeader" schema={snippetSchema}>
  {#snippet children(snippet)}
    {@render snippet()}
  {/snippet}
</LayoutRegion>

<!-- Example 3: Reactive State Access -->
<LayoutRegion name="statsHeader" schema={snippetSchema}>
  {#snippet children(snippet)}
    {@render snippet()}
  {/snippet}
</LayoutRegion>`;
</script>

{#snippet statsHeaderSnippet()}
  <RegionIndicator
    label="Stats Header Region (Snippet with Reactive State)"
    color="blue">
    <div class="space-y-4">
      <div>
        <h2 class="mt-0 text-2xl font-semibold">Dashboard Statistics</h2>
        <p class="text-sm text-muted-foreground">
          Real-time data with full reactivity
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="rounded-lg border bg-card p-4">
          <div class="text-2xl font-bold">{viewCount}</div>
          <div class="text-xs text-muted-foreground">Total Views</div>
        </div>
        <div class="rounded-lg border bg-card p-4">
          <div class="text-2xl font-bold">{conversionRate}%</div>
          <div class="text-xs text-muted-foreground">Conversion Rate</div>
        </div>
      </div>

      <button
        onclick={() => {
          viewCount += Math.floor(Math.random() * 100);
          conversionRate = Number((Math.random() * 10).toFixed(1));
        }}
        class="rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
        Update Stats
      </button>
    </div>
  </RegionIndicator>
{/snippet}

{#snippet productHeaderSnippet()}
  <RegionIndicator label="Product Header Region (Snippet)" color="orange">
    <div class="flex items-center justify-between">
      <h2 class="mt-0 mb-0 text-3xl font-bold">
        Svelte is <span class="text-indigo-600 dark:text-indigo-400 font-bold"
          >{adjectives[currentIndex]}</span>
      </h2>
      <button
        onclick={nextAdjective}
        class="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 cursor-pointer">
        Next
      </button>
    </div>
  </RegionIndicator>
{/snippet}

{#snippet settingsHeaderSnippet()}
  <RegionIndicator
    label="Settings Header Region (Snippet Wrapping Component)"
    color="green">
    <SettingsPanel
      {theme}
      {notificationsEnabled}
      onThemeChange={handleThemeChange}
      onNotificationToggle={handleNotificationToggle} />
  </RegionIndicator>
{/snippet}

<h2>Snippet + TypeScript Only</h2>

<div class="not-prose mb-8 rounded-lg border bg-indigo-500/5 p-6">
  <h3 class="text-lg font-semibold mb-3">Quick Start with CLI</h3>
  <p class="text-sm text-muted-foreground mb-4">
    Generate snippet region boilerplate automatically:
  </p>
  <CodeViewer
    filename="terminal"
    language="bash"
    code="npx @sveltopia/regions add product-header" />
  <p class="text-sm text-muted-foreground mt-4">
    During the interactive prompts, select <strong>Snippet</strong> strategy.
    The CLI generates a region consumer that accepts Snippets and an example
    layout file with snippet definitions and full state access.
  </p>
</div>

<p>
  Snippets are the most powerful and flexible strategy for regions. They give
  you <strong>full access to page state, props, and context</strong> while remaining
  type-safe and reactive.
</p>

<h3>The 3 Snippet Superpowers</h3>
<p class="text-sm text-muted-foreground mb-4">
  This page demonstrates all three capabilities working together in the regions
  above.
</p>

<ul>
  <li>
    <strong>1. User Interaction</strong> - Snippets can handle events and mutate
    page state directly, making highly interactive UIs trivial.
    <em>(See Product Header - click "Next" to cycle adjectives)</em>
  </li>
  <li>
    <strong>2. Component Wrapping</strong> - Snippets can wrap entire
    components, giving them access to page state and handlers without prop
    drilling through your layout.
    <em>(See Settings Header - full component with page state access)</em>
  </li>
  <li>
    <strong>3. Reactive State Access</strong> - Snippets have direct access to
    all page state, props, and context. When state changes, snippets
    automatically re-render.
    <em>(See Stats Header - try clicking "Update Stats")</em>
  </li>
</ul>

<h3>Why Use Snippets in Layouts?</h3>
<p>
  Snippets solve a specific problem: <strong
    >"I need the layout to control positioning and chrome, while each page
    controls what content goes there"</strong> - whether that's simple varying markup
  or deeply interactive UI with full page state access.
</p>

<div class="not-prose space-y-3 mb-6">
  <h4>Example Use Cases:</h4>
  <div class="rounded-lg border bg-card p-4">
    <h4 class="font-semibold mb-2 text-sm">Page Actions Bar</h4>
    <ul class="text-sm text-muted-foreground space-y-1">
      <li>
        • <strong>Layout:</strong> "Page actions always appear top-right, styled
        consistently"
      </li>
      <li>
        • <strong>Page snippet:</strong> "<em>This</em> page needs
        <strong>Save + Delete</strong>, connected to my form state. Another page
        needs <strong>Publish + Archive</strong>."
      </li>
      <li>
        • <strong>Alternative:</strong> Every page duplicates positioning/styling
        OR prop drilling hell
      </li>
    </ul>
  </div>

  <div class="rounded-lg border bg-card p-4">
    <h4 class="font-semibold mb-2 text-sm">Contextual Sidebar</h4>
    <ul class="text-sm text-muted-foreground space-y-1">
      <li>
        • <strong>Layout:</strong> "Sidebar appears on right, collapsible, consistent
        behavior"
      </li>
      <li>
        • <strong>Page snippet:</strong> "<em>This</em> page's sidebar needs
        <strong>filters</strong> that update my data table. Another page's
        sidebar needs
        <strong>navigation links</strong>."
      </li>
      <li>
        • <strong>Why snippet?</strong> Filter state lives on page, but sidebar position
        is layout concern
      </li>
    </ul>
  </div>

  <div class="rounded-lg border bg-card p-4">
    <h4 class="font-semibold mb-2 text-sm">Dynamic Breadcrumbs</h4>
    <ul class="text-sm text-muted-foreground space-y-1">
      <li>
        • <strong>Layout:</strong> "Breadcrumbs always at top, styled, positioned"
      </li>
      <li>
        • <strong>Page snippet:</strong> "My breadcrumbs are interactive (click to
        filter), need page state"
      </li>
    </ul>
  </div>
</div>

<KeyConcept>
  <strong>The pattern:</strong> Layout controls the "chrome" (position, container,
  transitions), snippet provides the "meat" (interactive content with page state
  access). This separation of concerns keeps your layouts DRY while giving pages
  maximum flexibility.
</KeyConcept>

<h3>Why TypeScript Only for Snippets?</h3>
<p>
  Snippets are typed at compile-time through their signature. Runtime validation
  with Valibot/Zod would be redundant since the snippet signature already
  enforces types.
</p>

<h3>Code Examples (used on this page)</h3>

<div class="space-y-8">
  <div class="space-y-6">
    <div>
      <p class="text-sm font-medium">
        <strong>Step 1:</strong> Define all 3 snippets in your page component:
      </p>
      <KeyConcept>
        <strong>Notice the 3 patterns:</strong> Snippets can handle user interaction
        (example 1), wrap full components (example 2), and access reactive state
        (example 3). All have access to page state via closure.
      </KeyConcept>
    </div>
    <CodeViewer
      filename="src/routes/examples/snippet/full-example/+page.svelte"
      language="svelte"
      code={pageCode} />
  </div>

  <div class="space-y-6">
    <p class="text-sm font-medium">
      <strong>Step 2:</strong> Consume snippets in your layout &mdash; the layout
      controls positioning and styling, while the snippets provide interactive content
      with full page state access.
    </p>
    <CodeViewer
      filename="src/routes/examples/+layout.svelte"
      language="svelte"
      code={regionConsumerCode} />
  </div>
</div>
