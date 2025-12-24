<script lang="ts">
  import { ArrowRight, ExternalLink, BookOpen, Code } from 'lucide-svelte';

  interface Props {
    resultType:
      | 'no-need'
      | 'diy-capable'
      | 'load-function'
      | 'load-or-component'
      | 'snippet'
      | 'component';
  }

  let { resultType }: Props = $props();

  // Result configurations
  const results = {
    'no-need': {
      title: "You don't need this library",
      description:
        "Based on your answers, you're only passing data down from parents to children. This is what standard component props are for!",
      explanation:
        "This library solves the problem of passing content UP from child pages to parent layouts (like page headers, sidebars, or breadcrumbs). For parent-to-child data flow, stick with SvelteKit's built-in patterns.",
      ctas: [
        {
          label: 'Learn about SvelteKit layouts',
          href: 'https://kit.svelte.dev/docs/routing#layout',
          external: true,
          primary: true,
        },
      ],
    },
    'diy-capable': {
      title: 'You could build this yourself',
      description:
        "You have the skills and prefer manual control. This library would save you time, but it's not strictly necessary for your use case.",
      explanation:
        "Since you only need simple data and prefer writing your own load functions, you can absolutely implement this pattern manually. However, the CLI scaffolding, automatic type inference, and validation patterns might still be worth exploring.",
      ctas: [
        {
          label: 'See what the CLI generates',
          href: '/docs/quick-start',
          external: false,
          primary: true,
        },
        {
          label: 'View manual examples',
          href: '/examples',
          external: false,
          primary: false,
        },
      ],
    },
    'load-function': {
      title: 'Use the Load Function Strategy',
      description:
        'Perfect for server-side rendering with zero layout shift. Your content will be in the HTML from the start.',
      explanation:
        "Load Functions return data from your page's server-side load function, ensuring everything is rendered on the server. Great for SEO-critical content, works without JavaScript, and eliminates cumulative layout shift (CLS).",
      ctas: [
        {
          label: 'Quick Start with CLI',
          href: '/docs/quick-start',
          external: false,
          primary: true,
        },
        {
          label: 'Load Function examples',
          href: '/examples/load-function',
          external: false,
          primary: false,
        },
        {
          label: 'Strategy comparison',
          href: '/docs/strategy-comparison',
          external: false,
          primary: false,
        },
      ],
    },
    'load-or-component': {
      title: 'Choose: Load Function or Component Wrapper',
      description:
        'Both strategies work well for consistent, repeatable schemas. The choice depends on whether you need SSR.',
      explanation:
        "Load Function gives you server-side rendering (SEO, no layout shift). Component Wrapper is simpler and renders client-side. Both support validation and type safety.",
      ctas: [
        {
          label: 'Compare strategies',
          href: '/docs/strategy-comparison',
          external: false,
          primary: true,
        },
        {
          label: 'Load Function examples',
          href: '/examples/load-function',
          external: false,
          primary: false,
        },
        {
          label: 'Component Wrapper examples',
          href: '/examples/component-wrapper',
          external: false,
          primary: false,
        },
      ],
    },
    snippet: {
      title: 'Use the Snippet Strategy',
      description:
        'Maximum flexibility with full access to page reactive state. Perfect for interactive, dynamic content.',
      explanation:
        "Snippets give you complete per-page control with custom HTML, reactive state, and dynamic content. You can use page variables, event handlers, and Svelte's full reactive system directly in your region definitions.",
      ctas: [
        {
          label: 'Quick Start with CLI',
          href: '/docs/quick-start',
          external: false,
          primary: true,
        },
        {
          label: 'Snippet examples',
          href: '/examples/snippet',
          external: false,
          primary: false,
        },
        {
          label: 'Strategy comparison',
          href: '/docs/strategy-comparison',
          external: false,
          primary: false,
        },
      ],
    },
    component: {
      title: 'Use the Component Wrapper Strategy',
      description:
        'Simple, clean props-based API for client-side rendering. Easy to understand and maintain.',
      explanation:
        "Component Wrappers provide a straightforward component-based approach with props. They're rendered client-side, support validation, and can be upgraded to Snippets later if you need more power.",
      ctas: [
        {
          label: 'Quick Start with CLI',
          href: '/docs/quick-start',
          external: false,
          primary: true,
        },
        {
          label: 'Component Wrapper examples',
          href: '/examples/component-wrapper',
          external: false,
          primary: false,
        },
        {
          label: 'Strategy comparison',
          href: '/docs/strategy-comparison',
          external: false,
          primary: false,
        },
      ],
    },
  };

  const result = results[resultType];
</script>

<div class="space-y-6">
  <!-- Title -->
  <div>
    <h3 class="text-2xl font-bold mb-2">{result.title}</h3>
    <p class="text-lg text-muted-foreground">{result.description}</p>
  </div>

  <!-- Explanation -->
  <div class="rounded-lg bg-indigo-500/5 border border-indigo-500/20 p-6">
    <h4 class="font-semibold mb-2 flex items-center gap-2 text-foreground">
      <BookOpen class="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      Why this recommendation?
    </h4>
    <p class="text-sm text-muted-foreground leading-relaxed">
      {result.explanation}
    </p>
  </div>

  <!-- CTAs -->
  <div class="space-y-3">
    <h4 class="font-semibold text-sm text-muted-foreground">Next steps:</h4>
    <div class="flex flex-col gap-3">
      {#each result.ctas as cta}
        {#if cta.primary}
          <a
            href={cta.href}
            target={cta.external ? '_blank' : undefined}
            rel={cta.external ? 'noopener noreferrer' : undefined}
            aria-label={cta.external ? `${cta.label} (opens in new window)` : cta.label}
            class="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition-colors cursor-pointer">
            {cta.label}
            {#if cta.external}
              <ExternalLink class="h-4 w-4" aria-hidden="true" />
            {:else}
              <ArrowRight class="h-4 w-4" aria-hidden="true" />
            {/if}
          </a>
        {:else}
          <a
            href={cta.href}
            aria-label={cta.label}
            class="inline-flex items-center justify-center gap-2 rounded-md border px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
            <Code class="h-4 w-4" aria-hidden="true" />
            {cta.label}
          </a>
        {/if}
      {/each}
    </div>
  </div>
</div>
