<script lang="ts">
  import { useLayoutRegions } from "../../useLayoutRegions.svelte";

  // This page sets a region that doesn't exist in the layout
  useLayoutRegions({
    unexpectedRegion: { data: "This region doesn't exist!" }
  });
</script>

<div>Page Content</div>
