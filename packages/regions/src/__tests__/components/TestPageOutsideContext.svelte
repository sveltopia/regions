<script lang="ts">
  import { useLayoutRegions } from "../../useLayoutRegions.svelte";

  // This will trigger a warning because we're not inside LayoutRegions
  useLayoutRegions({
    header: { title: "Should Warn" },
  });
</script>

<div>Page Outside Context</div>
