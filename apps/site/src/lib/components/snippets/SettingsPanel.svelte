<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { Switch } from '$lib/components/ui/switch';
  import { ChevronDown } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { notificationState } from '$lib/stores/notifications.svelte';

  let { theme, onThemeChange, notificationsEnabled, onNotificationToggle } = $props<{
    theme: 'light' | 'dark' | 'system';
    onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
    notificationsEnabled: boolean;
    onNotificationToggle: () => void;
  }>();

  // Sync local prop with global state
  $effect(() => {
    notificationState.enabled = notificationsEnabled;
  });

  const themeLabels: Record<'light' | 'dark' | 'system', string> = {
    light: 'Light',
    dark: 'Dark',
    system: 'System'
  };

  // Handle theme change with real visual feedback
  function handleThemeChange(newTheme: 'light' | 'dark' | 'system') {
    onThemeChange(newTheme);

    // Only show toast if notifications are enabled
    if (notificationsEnabled) {
      toast.success(`Theme changed to ${themeLabels[newTheme]}`);
    }
  }

  // Handle notification toggle
  function handleNotificationToggle() {
    // Check current state BEFORE toggle to show the "turning on/off" message
    const wasEnabled = notificationsEnabled;

    // Toggle the state in parent
    onNotificationToggle();

    // Always show this one toast to confirm the toggle action
    if (wasEnabled) {
      // Was ON, now turning OFF
      toast.info('Notifications disabled', {
        description: 'Theme change toasts will no longer appear.'
      });
    } else {
      // Was OFF, now turning ON
      toast.success('Notifications enabled!', {
        description: "You'll now see toasts when changing themes."
      });
    }
  }

  // Compute theme classes for visual feedback
  const themeClasses = $derived(() => {
    if (theme === 'light') {
      return 'bg-white border-slate-200 text-slate-900';
    } else if (theme === 'dark') {
      return 'bg-slate-900 border-slate-700 text-white';
    } else {
      // System - use a gradient or neutral state
      return 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border-slate-300 dark:border-slate-700';
    }
  });

  // Compute card classes based on theme
  const cardClasses = $derived(() => {
    if (theme === 'light') {
      return 'bg-white border-slate-200';
    } else if (theme === 'dark') {
      return 'bg-slate-800 border-slate-700';
    } else {
      return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  });

  // Compute label classes based on theme
  const labelClasses = $derived(() => {
    if (theme === 'light') {
      return 'text-slate-900';
    } else if (theme === 'dark') {
      return 'text-slate-100';
    } else {
      return 'text-slate-900 dark:text-slate-100';
    }
  });

  // Compute muted text classes based on theme
  const mutedClasses = $derived(() => {
    if (theme === 'light') {
      return 'text-slate-600';
    } else if (theme === 'dark') {
      return 'text-slate-400';
    } else {
      return 'text-slate-600 dark:text-slate-400';
    }
  });

  // Compute dropdown button classes based on theme
  const dropdownClasses = $derived(() => {
    if (theme === 'light') {
      return 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50';
    } else if (theme === 'dark') {
      return 'border-slate-600 bg-slate-700 text-slate-100 hover:bg-slate-600';
    } else {
      return 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-600';
    }
  });
</script>

<div class="space-y-4 rounded-lg border-2 p-4 transition-all duration-300 {themeClasses()}">
  <div>
    <h3 class="mb-3 text-lg font-semibold {labelClasses()}">User Settings</h3>
    <p class="text-sm {labelClasses()}">
      This panel demonstrates <strong class={labelClasses()}>real interactivity</strong>: the theme
      selector changes this section's appearance in real-time, and the notification toggle controls
      whether theme change toasts appear.
    </p>
  </div>

  <div class="space-y-3">
    <!-- Theme selector with dropdown -->
    <div
      class="flex items-center justify-between rounded-lg border p-3 transition-colors {cardClasses()}"
    >
      <div>
        <div class="text-sm font-medium {labelClasses()}">Theme</div>
        <div class="text-xs {mutedClasses()}">Choose your color scheme</div>
      </div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          class="inline-flex items-center gap-2 rounded border px-3 py-1.5 text-sm transition-colors {dropdownClasses()}"
        >
          {themeLabels[theme as 'light' | 'dark' | 'system']}
          <ChevronDown class="h-3 w-3" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.RadioGroup value={theme}>
            <DropdownMenu.RadioItem value="light" onclick={() => handleThemeChange('light')}>
              Light
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="dark" onclick={() => handleThemeChange('dark')}>
              Dark
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="system" onclick={() => handleThemeChange('system')}>
              System
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>

    <!-- Notifications toggle with shadcn Switch -->
    <div
      class="flex items-center justify-between rounded-lg border p-3 transition-colors {cardClasses()}"
    >
      <div>
        <div class="text-sm font-medium {labelClasses()}">Toast Notifications</div>
        <div class="text-xs {mutedClasses()}">Control theme change alerts</div>
      </div>
      <Switch
        checked={notificationsEnabled}
        onCheckedChange={handleNotificationToggle}
        aria-label="Toggle notifications"
        class="data-[state=unchecked]:bg-slate-300 dark:data-[state=unchecked]:bg-slate-600"
      />
    </div>
  </div>
</div>
