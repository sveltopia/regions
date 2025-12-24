<script lang="ts">
  import { useLayoutRegions } from "../../useLayoutRegions.svelte";

  useLayoutRegions({
    header: { title: "Valid Title", description: "Valid Description" },
  });
</script>

<div>Page Content</div>
