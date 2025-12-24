<script lang="ts">
  import { page } from "$app/state";
  import { X } from "lucide-svelte";
  import { onMount } from "svelte";
  import { LayoutRegion } from "@sveltopia/regions";
  import PageHeaderRegion from "$lib/regions/page-header/PageHeaderRegion.svelte";
  import ProductHeaderRegion from "$lib/regions/product-header/ProductHeaderRegion.svelte";
  import ArticleHeaderRegion from "$lib/regions/article-header/ArticleHeaderRegion.svelte";
  import DashboardHeaderRegion from "$lib/regions/dashboard-header/DashboardHeaderRegion.svelte";
  import CatalogHeaderRegion from "$lib/regions/catalog-header/CatalogHeaderRegion.svelte";
  import GalleryHeaderRegion from "$lib/regions/gallery-header/GalleryHeaderRegion.svelte";
  import ProfileHeaderRegion from "$lib/regions/profile-header/ProfileHeaderRegion.svelte";
  import SidebarRegion from "$lib/regions/sidebar/SidebarRegion.svelte";
  import FooterRegion from "$lib/regions/footer/FooterRegion.svelte";
  import BreadcrumbsRegion from "$lib/regions/breadcrumbs/BreadcrumbsRegion.svelte";

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
    window.addEventListener("toggle-mobile-menu", handleToggle);
    return () => {
      window.removeEventListener("toggle-mobile-menu", handleToggle);
    };
  });
</script>

<!-- Mobile Menu Overlay -->
{#if mobileMenuOpen}
  <div
    class="fixed inset-0 z-40 bg-black/50 lg:hidden"
    onclick={closeMobileMenu}
    onkeydown={(e) => e.key === "Escape" && closeMobileMenu()}
    role="button"
    tabindex="-1"
    aria-label="Close mobile menu">
  </div>
{/if}

<!-- Examples Container with Visual Indicators -->
<div class="w-full px-4 pb-6 lg:container lg:mx-auto lg:py-6">
  <div class="flex flex-col gap-6 lg:flex-row">
    <!-- Sidebar Navigation (Left) -->
    <aside
      class="fixed inset-y-0 left-0 z-50 lg:z-0 w-64 overflow-y-auto border-r bg-background p-4 transition-transform lg:static lg:block lg:w-64 lg:shrink-0 lg:border-r-0 lg:p-0 {mobileMenuOpen
        ? 'translate-x-0'
        : '-translate-x-full lg:translate-x-0'}">
      <!-- Close button (mobile only, inside sidebar) -->
      <div class="mb-4 flex items-center justify-between lg:hidden">
        <h3 class="text-lg font-semibold">Menu</h3>
        <button
          onclick={closeMobileMenu}
          class="rounded-md p-2 hover:bg-muted"
          aria-label="Close menu">
          <X class="h-5 w-5" />
        </button>
      </div>

      <div class="lg:sticky lg:top-20 space-y-4">
        <!-- Navigation Menu -->
        <div>
          <a
            href="/examples"
            class="mb-4 text-lg font-semibold lg:block hidden hover:text-primary"
            >Examples</a>
          <nav class="space-y-3">
            <!-- Load Function Strategy -->
            <div>
              <a
                href="/examples/load-function"
                onclick={closeMobileMenu}
                class="block rounded px-3 py-2 text-sm font-medium hover:bg-muted {page.url.pathname.startsWith(
                  '/examples/load-function'
                )
                  ? 'bg-muted font-semibold'
                  : ''}">
                Load Function
              </a>
              <div class="ml-3 mt-1 space-y-1 border-l-2 border-muted pl-3">
                <a
                  href="/examples/load-function/valibot"
                  onclick={closeMobileMenu}
                  class="block rounded px-3 py-2 text-xs hover:bg-muted {page
                    .url.pathname === '/examples/load-function/valibot'
                    ? 'bg-muted font-semibold'
                    : ''}">
                  Valibot
                </a>
                <a
                  href="/examples/load-function/zod"
                  onclick={closeMobileMenu}
                  class="block rounded px-3 py-2 text-xs hover:bg-muted {page
                    .url.pathname === '/examples/load-function/zod'
                    ? 'bg-muted font-semibold'
                    : ''}">
                  Zod
                </a>
                <a
                  href="/examples/load-function/typescript-only"
                  onclick={closeMobileMenu}
                  class="block rounded px-3 py-2 text-xs hover:bg-muted {page
                    .url.pathname === '/examples/load-function/typescript-only'
                    ? 'bg-muted font-semibold'
                    : ''}">
                  TypeScript Only
                </a>
              </div>
            </div>

            <!-- Component Wrapper Strategy -->
            <div>
              <a
                href="/examples/component-wrapper"
                onclick={closeMobileMenu}
                class="block rounded px-3 py-2 text-sm font-medium hover:bg-muted {page.url.pathname.startsWith(
                  '/examples/component-wrapper'
                )
                  ? 'bg-muted font-semibold'
                  : ''}">
                Component Wrapper
              </a>
              <div class="ml-3 mt-1 space-y-1 border-l-2 border-muted pl-3">
                <a
                  href="/examples/component-wrapper/valibot"
                  onclick={closeMobileMenu}
                  class="block rounded px-3 py-2 text-xs hover:bg-muted {page
                    .url.pathname === '/examples/component-wrapper/valibot'
                    ? 'bg-muted font-semibold'
                    : ''}">
                  Valibot
                </a>
                <a
                  href="/examples/component-wrapper/zod"
                  onclick={closeMobileMenu}
                  class="block rounded px-3 py-2 text-xs hover:bg-muted {page
                    .url.pathname === '/examples/component-wrapper/zod'
                    ? 'bg-muted font-semibold'
                    : ''}">
                  Zod
                </a>
                <a
                  href="/examples/component-wrapper/typescript-only"
                  onclick={closeMobileMenu}
                  class="block rounded px-3 py-2 text-xs hover:bg-muted {page
                    .url.pathname ===
                  '/examples/component-wrapper/typescript-only'
                    ? 'bg-muted font-semibold'
                    : ''}">
                  TypeScript Only
                </a>
              </div>
            </div>

            <!-- Snippet Strategy -->
            <div>
              <a
                href="/examples/snippet"
                onclick={closeMobileMenu}
                class="block rounded px-3 py-2 text-sm font-medium hover:bg-muted {page.url.pathname.startsWith(
                  '/examples/snippet'
                )
                  ? 'bg-muted font-semibold'
                  : ''}">
                Snippet
              </a>
              <div class="ml-3 mt-1 space-y-1 border-l-2 border-muted pl-3">
                <a
                  href="/examples/snippet/full-example"
                  onclick={closeMobileMenu}
                  class="block rounded px-3 py-2 text-xs hover:bg-muted {page
                    .url.pathname === '/examples/snippet/full-example'
                    ? 'bg-muted font-semibold'
                    : ''}">
                  Full Example
                </a>
              </div>
            </div>

            <!-- Advanced Examples -->
            <div>
              <a
                href="/examples/advanced"
                onclick={closeMobileMenu}
                class="block rounded px-3 py-2 text-sm font-medium hover:bg-muted {page.url.pathname.startsWith(
                  '/examples/advanced'
                )
                  ? 'bg-muted font-semibold'
                  : ''}">
                Advanced
              </a>
            </div>
          </nav>
        </div>

        <!-- Dynamic Sidebar Content -->
        <SidebarRegion />
      </div>
    </aside>

    <!-- Main Content Area -->
    <article class="flex-1 lg:w-0" data-pagefind-meta="category:Example">
      <div class="w-full px-4 py-6 lg:py-12 lg:max-w-5xl space-y-6">
        <!-- Breadcrumbs Navigation -->
        <BreadcrumbsRegion />

        <!-- Region Consumers (each with their own visual indicator) -->
        <PageHeaderRegion showIndicator={true} />
        <ProductHeaderRegion />
        <ArticleHeaderRegion />
        <DashboardHeaderRegion />
        <CatalogHeaderRegion />
        <GalleryHeaderRegion />
        <ProfileHeaderRegion />

        <!-- Snippet Regions (render directly, no consumer component) -->
        <LayoutRegion name="featureHeader" />
        <LayoutRegion name="settingsHeader" />
        <LayoutRegion name="statsHeader" />

        <!-- Page Content -->
        <div
          class="prose prose-slate dark:prose-invert max-w-none rounded-lg border bg-card p-6">
          {@render children()}
        </div>

        <!-- Page Footer Region -->
        <FooterRegion />
      </div>
    </article>
  </div>
</div>
