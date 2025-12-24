<script lang="ts">
  import { useLayoutRegions } from '@sveltopia/regions';
  import type { CatalogHeaderData } from './catalogHeaderSchema';

  let { catalogName, itemCount }: CatalogHeaderData = $props();

  useLayoutRegions(() => ({
    catalogHeader: { catalogName, itemCount }
  }));
</script>

<!-- This component automatically sets the 'catalog-header' region when mounted -->
