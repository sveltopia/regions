<script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import { ChevronRight } from 'lucide-svelte';
  import { breadcrumbsSchema, type BreadcrumbsData } from './breadcrumbsSchema';
</script>

<LayoutRegion name="breadcrumbs" schema={breadcrumbsSchema}>
  {#snippet children(data: Record<string, unknown> | undefined)}
    {@const breadcrumbs = data as unknown as BreadcrumbsData}
    <nav aria-label="Breadcrumb" class="mb-4">
      <ol class="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {#each breadcrumbs as breadcrumb, index}
          <li class="flex items-center gap-1.5">
            {#if index > 0}
              <ChevronRight class="h-3.5 w-3.5 shrink-0" />
            {/if}
            {#if index === breadcrumbs.length - 1}
              <!-- Last item (current page) - not a link -->
              <span class="font-medium text-foreground" aria-current="page">
                {breadcrumb.label}
              </span>
            {:else}
              <!-- Parent pages - clickable links -->
              <a href={breadcrumb.href} class="transition-colors hover:text-foreground">
                {breadcrumb.label}
              </a>
            {/if}
          </li>
        {/each}
      </ol>
    </nav>
  {/snippet}
</LayoutRegion>
