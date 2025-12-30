<script lang="ts">
  import { page } from '$app/state';
  import { X } from 'lucide-svelte';
  import { onMount } from 'svelte';

  let { children } = $props();

  // Mobile menu state
  let mobileMenuOpen = $state(false);

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }

  // Listen for toggle event from global header
  onMount(() => {
    function handleToggle() {
      mobileMenuOpen = !mobileMenuOpen;
    }
    window.addEventListener('toggle-mobile-menu', handleToggle);
    return () => {
      window.removeEventListener('toggle-mobile-menu', handleToggle);
    };
  });
</script>

<!-- Mobile Menu Overlay -->
{#if mobileMenuOpen}
  <div
    class="fixed inset-0 z-40 bg-black/50 md:hidden"
    onclick={closeMobileMenu}
    onkeydown={(e) => e.key === 'Escape' && closeMobileMenu()}
    role="button"
    tabindex="-1"
    aria-label="Close mobile menu"
  ></div>
{/if}

<!-- Docs Container with Sidebar -->
<div class="w-full px-4 pb-6 lg:container lg:mx-auto lg:py-6">
  <div class="flex flex-col gap-6 lg:flex-row">
    <!-- Sidebar Navigation (Left) -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto border-r bg-background p-4 transition-transform lg:static lg:z-0 lg:block lg:w-64 lg:shrink-0 lg:border-r-0 lg:p-0 {mobileMenuOpen
        ? 'translate-x-0'
        : '-translate-x-full lg:translate-x-0'}"
    >
      <!-- Close button (mobile only, inside sidebar) -->
      <div class="mb-4 flex items-center justify-between lg:hidden">
        <h3 class="text-lg font-semibold">Menu</h3>
        <button
          onclick={closeMobileMenu}
          class="rounded-md p-2 hover:bg-muted"
          aria-label="Close menu"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <div class="space-y-4 lg:sticky lg:top-20">
        <!-- Navigation Menu -->
        <div>
          <a href="/docs" class="mb-4 hidden text-lg font-semibold hover:text-primary lg:block"
            >Documentation</a
          >
          <nav class="space-y-2">
            <a
              href="/docs"
              onclick={closeMobileMenu}
              class="block rounded px-3 py-2 text-sm font-medium hover:bg-muted {page.url
                .pathname === '/docs'
                ? 'bg-muted font-semibold'
                : ''}"
            >
              Introduction
            </a>

            <a
              href="/docs/quick-start"
              onclick={closeMobileMenu}
              class="block rounded px-3 py-2 text-sm font-medium hover:bg-muted {page.url
                .pathname === '/docs/quick-start'
                ? 'bg-muted font-semibold'
                : ''}"
            >
              Quick Start
            </a>

            <a
              href="/docs/native-vs-regions"
              onclick={closeMobileMenu}
              class="block rounded px-3 py-2 text-sm font-medium hover:bg-muted {page.url
                .pathname === '/docs/native-vs-regions'
                ? 'bg-muted font-semibold'
                : ''}"
            >
              Native vs Regions
            </a>

            <a
              href="/docs/strategy-comparison"
              onclick={closeMobileMenu}
              class="block rounded px-3 py-2 text-sm font-medium hover:bg-muted {page.url
                .pathname === '/docs/strategy-comparison'
                ? 'bg-muted font-semibold'
                : ''}"
            >
              Strategy Comparison
            </a>

            <a
              href="/docs/api-reference"
              onclick={closeMobileMenu}
              class="block rounded px-3 py-2 text-sm font-medium hover:bg-muted {page.url
                .pathname === '/docs/api-reference'
                ? 'bg-muted font-semibold'
                : ''}"
            >
              API Reference
            </a>

            <a
              href="/docs/advanced"
              onclick={closeMobileMenu}
              class="block rounded px-3 py-2 text-sm font-medium hover:bg-muted {page.url
                .pathname === '/docs/advanced'
                ? 'bg-muted font-semibold'
                : ''}"
            >
              Advanced
            </a>

            <a
              href="/docs/llms"
              onclick={closeMobileMenu}
              class="block rounded px-3 py-2 text-sm font-medium hover:bg-muted {page.url
                .pathname === '/docs/llms'
                ? 'bg-muted font-semibold'
                : ''}"
            >
              AI Docs
            </a>
          </nav>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <article class="flex-1 lg:w-0" data-pagefind-meta="category:Documentation">
      <div class="w-full px-4 py-12 lg:max-w-5xl">
        {@render children()}
      </div>
    </article>
  </div>
</div>
