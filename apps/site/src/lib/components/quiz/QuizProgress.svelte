<script lang="ts">
  interface Props {
    currentStep: number;
    totalSteps: number;
  }

  let { currentStep, totalSteps }: Props = $props();
</script>

<div
  class="mb-6 flex justify-center gap-2"
  role="progressbar"
  aria-valuenow={currentStep + 1}
  aria-valuemin={1}
  aria-valuemax={totalSteps}
  aria-label="Quiz progress: step {currentStep + 1} of {totalSteps}"
>
  {#each Array.from({ length: totalSteps }, (_, idx) => idx) as i (i)}
    <div
      class="h-2 w-8 rounded-full transition-colors duration-300 {i <= currentStep
        ? 'bg-indigo-600 dark:bg-indigo-400'
        : 'bg-gray-200 dark:bg-gray-700'}"
      aria-hidden="true"
    ></div>
  {/each}
</div>
