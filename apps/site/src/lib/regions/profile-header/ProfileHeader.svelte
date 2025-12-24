<script lang="ts">
  import { useLayoutRegions } from '@sveltopia/regions';

  let { username, bio } = $props();

  useLayoutRegions({
    profileHeader: { username, bio }
  });
</script>

<!-- This component automatically sets the 'profile-header' region when mounted -->
