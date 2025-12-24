<script lang="ts">
  import { useLayoutRegions } from '@sveltopia/regions';

  let { catalogName, itemCount } = $props();

  useLayoutRegions({
    catalogHeader: { catalogName, itemCount }
  });
</script>

<!-- This component automatically sets the 'catalog-header' region when mounted -->
