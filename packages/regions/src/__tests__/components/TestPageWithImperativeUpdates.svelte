<script lang="ts">
  import { useLayoutRegions } from "../../useLayoutRegions.svelte";

  // Get context to enable imperative updates
  const context = useLayoutRegions({
    header: { title: "Initial Title" },
  });

  function updateTitle() {
    if (context) {
      context.setRegion("header", { title: "Updated Title" });
    }
  }

  function clearTitle() {
    if (context) {
      context.clearRegion("header");
    }
  }
</script>

<button data-testid="update-button" onclick={updateTitle}>Update Title</button>
<button data-testid="clear-button" onclick={clearTitle}>Clear Title</button>
<div>Page Content</div>
