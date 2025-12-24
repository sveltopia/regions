<script lang="ts">
  import { useLayoutRegions } from "../../useLayoutRegions.svelte";

  // Missing required "title" field
  useLayoutRegions({
    header: { description: "Missing title field" },
  });
</script>

<div>Page Content</div>
