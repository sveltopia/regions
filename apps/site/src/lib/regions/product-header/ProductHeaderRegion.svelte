<script lang="ts">
  import { LayoutRegion } from "@sveltopia/regions";
  import {
    productHeaderSchema,
    type ProductHeaderData,
  } from "./productHeaderSchema";
  import RegionIndicator from "$lib/components/RegionIndicator.svelte";
</script>

<LayoutRegion name="productHeader" schema={productHeaderSchema}>
  {#snippet children(data: Record<string, unknown> | undefined)}
    {@const typedData = data as ProductHeaderData}
    <RegionIndicator label="Product Header Region" color="orange">
      <div class="border-b pb-4">
        <h1 class="text-3xl font-bold">{typedData.productName}</h1>
        <div class="mt-2 flex items-center gap-4">
          <span class="text-2xl font-semibold text-primary"
            >${typedData.price.toFixed(2)}</span>
          <span
            class={`rounded px-2 py-1 text-sm ${typedData.inStock ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"}`}>
            {typedData.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </RegionIndicator>
  {/snippet}
</LayoutRegion>
