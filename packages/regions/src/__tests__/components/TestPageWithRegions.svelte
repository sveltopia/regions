<script lang="ts">
  import { useLayoutRegions } from "../../useLayoutRegions.svelte";

  // Set up regions using the composition function
  useLayoutRegions({
    header: { title: "Header Content" },
    sidebar: sidebarSnippet,
    footer: null, // Explicitly suppress footer
  });
</script>

{#snippet sidebarSnippet()}
  <div>Sidebar Snippet Content</div>
{/snippet}

<div>Page Content</div>
