<script lang="ts">
  import '../app.css';
  import { LayoutRegions } from '@sveltopia/regions';
  import { Toaster } from '$lib/components/ui/sonner';
  import { ModeWatcher } from 'mode-watcher';
  import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
  import SearchButton from '$lib/components/SearchButton.svelte';
  import SearchModal from '$lib/components/SearchModal.svelte';
  import Logo from '$lib/components/Logo.svelte';
  import { Menu } from 'lucide-svelte';
  import { page } from '$app/state';
  import { onMount } from 'svelte';

  let { children } = $props();
  let searchOpen = $state(false);
  let pagefindReady = $state(false);

  function toggleMobileMenu() {
    // Dispatch custom event for docs/examples layouts to toggle their menus
    window.dispatchEvent(new CustomEvent('toggle-mobile-menu'));
  }

  // Global Command-K/Ctrl-K keyboard shortcut handler
  function handleKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchOpen = !searchOpen;
    }
  }

  // Load Pagefind once on app initialization
  onMount(async () => {
    // Load raw Pagefind API at app startup (production only)
    if (import.meta.env.PROD) {
      try {
        // Use dynamic import with string concatenation to bypass Vite's static analysis
        const pagefindPath = '/pagefind/' + 'pagefind.js';
        const pagefind = await import(/* @vite-ignore */ pagefindPath);
        await pagefind.init();
        window.pagefind = pagefind;
        pagefindReady = true;
      } catch (e) {
        console.error('Failed to load Pagefind:', e);
      }
    }
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<ModeWatcher />
<LayoutRegions>
  <div class="min-h-screen bg-background dark:bg-slate-950">
    <!-- Global Header -->
    <header
      class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      <!-- Mobile Header -->
      <div class="space-y-3 px-4 py-3 lg:hidden">
        <!-- Top row: logo, Regions, version, hamburger (on internal pages) -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-8">
            <a href="/">
              <Logo class="h-7 -translate-y-px text-foreground" id="mobile-logo" />
            </a>
            <div class="flex items-center gap-2">
              <span class="font-semibold">Regions</span>
              <span
                class="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400"
                >v0.1.0</span
              >
            </div>
          </div>
          <!-- Hamburger only on docs/examples pages -->
          {#if page.url.pathname.startsWith('/docs') || page.url.pathname.startsWith('/examples')}
            <button
              onclick={toggleMobileMenu}
              class="flex items-center rounded-md border px-2 py-2 hover:bg-muted"
              aria-label="Toggle menu"
            >
              <Menu class="h-5 w-5" />
            </button>
          {/if}
        </div>
        <!-- Second row: nav links, search, mode -->
        <div class="flex items-center justify-between">
          <nav class="flex items-center gap-4 text-sm font-medium">
            <a
              href="/docs"
              class="transition-colors hover:text-foreground/80 {page.url.pathname.startsWith(
                '/docs'
              )
                ? 'text-foreground'
                : 'text-muted-foreground'}">Docs</a
            >
            <a
              href="/examples"
              class="transition-colors hover:text-foreground/80 {page.url.pathname.startsWith(
                '/examples'
              )
                ? 'text-foreground'
                : 'text-muted-foreground'}">Examples</a
            >
            <a
              href="https://github.com/sveltopia/regions"
              class="text-muted-foreground transition-colors hover:text-foreground/80">GitHub</a
            >
          </nav>
          <div class="flex items-center gap-1">
            <SearchButton onclick={() => (searchOpen = true)} iconOnly />
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      <!-- Desktop Header -->
      <div class="hidden lg:block">
        <div class="w-full px-4 lg:container lg:mx-auto">
          <div class="flex h-14 items-center gap-6">
            <!-- Logo area - matches aside width -->
            <a href="/" class="flex w-64 shrink-0 items-center">
              <Logo class="h-8 text-foreground" id="desktop-logo" />
            </a>

            <!-- Content area - matches article, justify-between -->
            <div class="flex flex-1 items-center justify-between">
              <!-- Left: Layout Regions, version, nav -->
              <div class="flex items-center gap-2 px-4">
                <span class="font-semibold">Regions</span>
                <span
                  class="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400"
                  >v0.1.0</span
                >
                <nav class="flex items-center space-x-1 pl-8 text-sm font-medium">
                  <a
                    href="/docs"
                    class="border-b-3 px-3 py-2 transition-colors hover:text-foreground/80 {page.url.pathname.startsWith(
                      '/docs'
                    )
                      ? 'border-indigo-500/75'
                      : 'border-transparent'}">Docs</a
                  >
                  <a
                    href="/examples"
                    class="border-b-3 px-3 py-2 transition-colors hover:text-foreground/80 {page.url.pathname.startsWith(
                      '/examples'
                    )
                      ? 'border-indigo-500/75'
                      : 'border-transparent'}">Examples</a
                  >
                  <a
                    href="https://github.com/sveltopia/regions"
                    class="border-b-3 border-transparent px-3 py-2 transition-colors hover:text-foreground/80"
                    >GitHub</a
                  >
                </nav>
              </div>

              <!-- Right: search, mode -->
              <div class="flex items-center gap-2">
                <SearchButton onclick={() => (searchOpen = true)} />
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main>
      {@render children()}
    </main>

    <!-- Global Footer -->
    <footer class="border-t py-6 md:py-0">
      <div
        class="flex w-full flex-col items-center justify-between gap-4 px-4 md:container md:mx-auto md:h-24 md:flex-row"
      >
        <p class="text-sm text-muted-foreground">
          Built by <a href="https://sveltopia.dev" class="font-medium underline underline-offset-4"
            >Sveltopia</a
          >. The source code is available on
          <a
            href="https://github.com/sveltopia/regions"
            class="font-medium underline underline-offset-4">GitHub</a
          >.
        </p>
      </div>
    </footer>
  </div>

  <!-- Search Modal -->
  <SearchModal bind:open={searchOpen} {pagefindReady} />

  <!-- Toast notifications -->
  <Toaster position="bottom-center" />
</LayoutRegions>
