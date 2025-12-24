<script lang="ts">
  import { useLayoutRegions } from "../../useLayoutRegions.svelte";

  // Only set header, not sidebar - so sidebar fallback should render
  useLayoutRegions({
    header: { title: "Header Without Sidebar" },
  });
</script>

<div>Page Without Sidebar</div>
