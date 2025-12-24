<script lang="ts">
  import { ArrowRight, Terminal, Info, TrendingUp, Code } from 'lucide-svelte';
</script>

<div class="space-y-8">
  <!-- Header -->
  <div class="space-y-4">
    <h1 class="text-4xl font-bold tracking-tight">Introduction</h1>
    <div class="prose max-w-none dark:prose-invert">
      <p class="lead">
        @sveltopia/regions provides <strong>three flexible strategies</strong>
        for passing content from SvelteKit pages to parent layouts, with built-in
        <strong>validation</strong>, <strong>type safety</strong>, and
        <strong>declarative fallback handling</strong>.
      </p>

      <h2>The Challenge: Creating "Front Matter" for SvelteKit</h2>

      <p class="text-lg">
        If you've used static site generators like Astro, Jekyll, or Hugo, you know the convenience
        of front matter—defining page metadata right at the top of your content. SvelteKit doesn't
        have a native equivalent for this pattern, and while you can pass data from pages to layouts
        using <code>load()</code>
        functions and <code>page.data</code>, this approach has limitations when you need more
        flexibility.
      </p>

      <p class="text-lg">
        <a
          href="/docs/native-vs-regions"
          class="text-indigo-600 hover:underline dark:text-indigo-400"
          >Native vs Regions Comparison →</a
        >
      </p>

      <ul>
        <li>
          <strong>Data-only:</strong> You can't pass Svelte snippets or reactive UI components
          through <code>page.data</code>
        </li>
        <li>
          <strong>Manual wiring:</strong> No built-in validation, type inference, or fallback handling
        </li>
        <li>
          <strong>Repetitive patterns:</strong> Every page needs similar boilerplate without structured
          tooling
        </li>
      </ul>

      <h2>Our Solution: Three strategies that cover a wide range of use cases:</h2>

      <ol>
        <li>
          <strong>Load Function Strategy</strong> - Uses SvelteKit's native
          <code>load()</code> pattern enhanced with structured components, optional CLI scaffolding, validation,
          and type safety
        </li>
        <li>
          <strong>Component Wrapper Strategy</strong> - Pass data from within
          <code>+page.svelte</code> using wrapper components and context (client-side rendered)
        </li>
        <li>
          <strong>Snippet Strategy</strong> - Pass complete Svelte snippets with full reactivity and state
          access (client-side rendered)
        </li>
      </ol>

      <p class="text-lg">
        All strategies include <strong>declarative fallback handling</strong>—define default content
        in your layout once, then optionally override or suppress it per-page. No repetitive null
        checking required.
      </p>

      <p class="text-lg">
        Whether you need SEO-friendly server rendering, rapid development with component wrappers,
        or maximum flexibility with reactive snippets, regions give you a validated, type-safe way
        to compose your layout architecture—with optional CLI tooling to eliminate manual
        boilerplate.
      </p>
    </div>
  </div>

  <!-- Quick Navigation Cards -->
  <div class="mt-12 grid gap-6 md:grid-cols-2">
    <!-- Quick Start -->
    <a
      href="/docs/quick-start"
      class="group block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10"
    >
      <div class="mb-3 flex items-start justify-between">
        <div class="rounded-lg bg-indigo-500/10 p-2">
          <Terminal class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <ArrowRight
          class="h-5 w-5 -translate-x-2 text-indigo-600 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 dark:text-indigo-400"
        />
      </div>
      <h3 class="mb-2 text-lg font-semibold">Quick Start</h3>
      <p class="text-sm text-muted-foreground">
        Generate region boilerplate with one command. The fastest way to add regions to your
        project.
      </p>
    </a>

    <!-- Native vs Regions -->
    <a
      href="/docs/native-vs-regions"
      class="group block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10"
    >
      <div class="mb-3 flex items-start justify-between">
        <div class="rounded-lg bg-indigo-500/10 p-2">
          <Info class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <ArrowRight
          class="h-5 w-5 -translate-x-2 text-indigo-600 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 dark:text-indigo-400"
        />
      </div>
      <h3 class="mb-2 text-lg font-semibold">Native vs Regions Comparison</h3>
      <p class="text-sm text-muted-foreground">
        What SvelteKit already provides, when it falls short, and when you need this library.
      </p>
    </a>

    <!-- Strategy Comparison -->
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
        Load functions vs component wrappers vs snippets. Choose the right approach for your use
        case.
      </p>
    </a>

    <!-- API Reference -->
    <a
      href="/docs/api-reference"
      class="group block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10"
    >
      <div class="mb-3 flex items-start justify-between">
        <div class="rounded-lg bg-indigo-500/10 p-2">
          <Code class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <ArrowRight
          class="h-5 w-5 -translate-x-2 text-indigo-600 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 dark:text-indigo-400"
        />
      </div>
      <h3 class="mb-2 text-lg font-semibold">API Reference</h3>
      <p class="text-sm text-muted-foreground">
        Complete reference for all exports, types, and interfaces.
      </p>
    </a>
  </div>

  <!-- Quick Links -->
  <div class="mt-12 border-t pt-8">
    <h2 class="mb-4 text-lg font-semibold">Looking for Examples?</h2>
    <p class="mb-6 text-muted-foreground">
      Our comprehensive examples section shows every pattern in action with live demos and code.
    </p>
    <a
      href="/examples"
      class="inline-flex items-center gap-2 text-indigo-600 hover:underline dark:text-indigo-400"
    >
      Browse Examples
      <ArrowRight class="h-4 w-4" />
    </a>
  </div>
</div>
