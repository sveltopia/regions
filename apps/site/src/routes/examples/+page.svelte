<script lang="ts">
  import KeyConcept from "$lib/components/KeyConcept.svelte";
</script>

<div class="space-y-6">
  <KeyConcept variant="orange" noMargin>
    <p><strong>Regions Demo</strong></p>
    <p class="mt-2">
      All of the colored/dashed areas shown on these example pages are using
      actual Layout Regions. See the
      <a href="/docs/quick-start" class="underline font-medium">Quick Start guide</a> to scaffold your own regions in 30 seconds.
    </p>
  </KeyConcept>

  <div class="not-prose grid gap-4 md:grid-cols-2">
    <a
      href="/examples/load-function"
      class="group block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10">
      <h3 class="font-semibold text-lg mb-2">Load Function Strategy</h3>
      <p class="text-sm text-muted-foreground">
        Server-side rendering with load() functions. Best for SEO and zero
        layout shift.
      </p>
      <div class="mt-4 flex items-center text-sm font-medium">
        View example
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="ml-2">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>
    </a>

    <a
      href="/examples/component-wrapper"
      class="group block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10">
      <h3 class="font-semibold text-lg mb-2">Component Wrapper Strategy</h3>
      <p class="text-sm text-muted-foreground">
        Client-side with wrapper components. Simple and straightforward.
      </p>
      <div class="mt-4 flex items-center text-sm font-medium">
        View example
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="ml-2">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>
    </a>

    <a
      href="/examples/snippet"
      class="group block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10">
      <h3 class="font-semibold text-lg mb-2">Snippet Strategy</h3>
      <p class="text-sm text-muted-foreground">
        Maximum flexibility with inline snippets. Full access to page state.
      </p>
      <div class="mt-4 flex items-center text-sm font-medium">
        View example
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="ml-2">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>
    </a>

    <a
      href="/examples/advanced"
      class="group block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10">
      <h3 class="font-semibold text-lg mb-2">Advanced: Region Inheritance</h3>
      <p class="text-sm text-muted-foreground">
        Learn how to use layout hierarchies to inherit, override, and extend regions.
      </p>
      <div class="mt-4 flex items-center text-sm font-medium">
        View example
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="ml-2">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>
    </a>
  </div>

  <!-- Validator Comparison -->
  <div class="mt-12">
    <h2 id="validator-comparison" class="text-2xl font-bold mb-4">Validator Options</h2>
    <p class="text-muted-foreground mb-6">
      Each strategy supports three validation approaches. Choose based on your
      needs:
    </p>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b">
            <th class="text-left p-3 font-semibold">Validator</th>
            <th class="text-left p-3 font-semibold">Bundle Size</th>
            <th class="text-left p-3 font-semibold">When to Use</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b">
            <td class="p-3 font-medium">Valibot</td>
            <td class="p-3">~1kb</td>
            <td class="p-3">Smallest footprint, modern API</td>
          </tr>
          <tr class="border-b">
            <td class="p-3 font-medium">Zod</td>
            <td class="p-3">~14kb</td>
            <td class="p-3">Most popular, rich ecosystem</td>
          </tr>
          <tr>
            <td class="p-3 font-medium">TypeScript</td>
            <td class="p-3">0kb</td>
            <td class="p-3">Compile-time only, trusted data</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
