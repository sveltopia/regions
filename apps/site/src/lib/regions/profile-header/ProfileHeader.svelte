<script lang="ts">
  import { useLayoutRegions } from '@sveltopia/regions';
  import type { ProfileHeaderData } from './profileHeaderSchema';

  let { username, bio }: ProfileHeaderData = $props();

  useLayoutRegions(() => ({
    profileHeader: { username, bio }
  }));
</script>

<!-- This component automatically sets the 'profile-header' region when mounted -->
