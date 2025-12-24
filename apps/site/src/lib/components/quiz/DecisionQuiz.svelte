<script lang="ts">
  import { fade } from "svelte/transition";
  import QuizProgress from "./QuizProgress.svelte";
  import QuizResult from "./QuizResult.svelte";
  import { ArrowLeft } from "lucide-svelte";

  type ResultType =
    | "no-need"
    | "diy-capable"
    | "load-function"
    | "load-or-component"
    | "snippet"
    | "component";

  // State
  let currentStep = $state(0);
  let answers = $state<string[]>([]);
  let cardElement: HTMLDivElement | undefined = $state();
  let containerHeight = $state<number | undefined>();

  // Derived state
  let showResult = $derived(calculateResult(answers) !== null);
  let resultType = $derived(calculateResult(answers));

  // Calculate which question to show (skips Q3 and Q4 if Q2 was "no")
  let currentQuestionIndex = $derived.by(() => {
    if (currentStep === 0) return 0; // Q1
    if (currentStep === 1) return 1; // Q2

    // Q2 = yes (simple data) → show Q3, Q4, Q5, Q6
    // Q2 = no (advanced features) → skip Q3 and Q4, show Q5, Q6 only
    if (answers[1] === "yes") {
      // Simple data path: show all remaining questions
      if (currentStep === 2) return 2; // Q3: preference
      if (currentStep === 3) return 3; // Q4: SSR
      if (currentStep === 4) return 4; // Q5: schema consistency
      return 5; // Q6: flexibility
    } else {
      // Advanced features path: skip Q3 and Q4, go straight to Q5
      if (currentStep === 2) return 4; // Q5: schema consistency
      return 5; // Q6: flexibility
    }
  });

  // Actions
  function answer(choice: string) {
    answers = [...answers, choice];

    const result = calculateResult([...answers]);
    if (!result) {
      currentStep++;
    }
  }

  function goBack() {
    if (showResult) {
      // Going back from result - just remove last answer
      answers = answers.slice(0, -1);
    } else if (currentStep > 0) {
      currentStep--;
      answers = answers.slice(0, -1);
    }
  }

  function restart() {
    currentStep = 0;
    answers = [];
  }

  // Result calculation logic
  function calculateResult(currentAnswers: string[]): ResultType | null {
    if (currentAnswers.length === 0) return null;

    // Q1: Core need
    if (currentAnswers[0] === "no") return "no-need";
    if (currentAnswers.length < 2) return null;

    // Q2: Simple data only?
    if (currentAnswers[1] === "yes") {
      // SIMPLE DATA PATH: They only need simple data - ask about preference
      if (currentAnswers.length < 3) return null;
      // Q3: Prefer manual?
      if (currentAnswers[2] === "yes") return "diy-capable";
      // They want automation - continue to Q4 (SSR)
      if (currentAnswers.length < 4) return null;

      // Q4: SSR requirements (index 3)
      if (currentAnswers[3] === "yes") return "load-function";
      if (currentAnswers.length < 5) return null;

      // Q5: Schema consistency (index 4)
      if (currentAnswers[4] === "yes") return "load-or-component";
      if (currentAnswers.length < 6) return null;

      // Q6: Flexibility needs (index 5)
      if (currentAnswers[5] === "yes") return "snippet";
      return "component";
    } else {
      // ADVANCED FEATURES PATH: They need reactive/interactive features
      // Skip Q3 and Q4, go straight to Q5
      if (currentAnswers.length < 3) return null;

      // Q5: Schema consistency (index 2 on this path)
      if (currentAnswers[2] === "yes") return "component";
      if (currentAnswers.length < 4) return null;

      // Q6: Flexibility needs (index 3 on this path)
      if (currentAnswers[3] === "yes") return "snippet";
      return "component";
    }
  }

  // Questions data
  const questions = [
    {
      id: 1,
      question:
        "Do you need to pass content from child pages to parent layouts?",
      description: "Examples: Page headers, sidebars, breadcrumbs, meta tags",
      choices: [
        {
          value: "yes",
          label: "Yes",
          description: "I need to pass data up the layout tree",
        },
        {
          value: "no",
          label: "No",
          description: "I only pass data down (standard props)",
        },
      ],
    },
    {
      id: 2,
      question: "Will you only ever need to pass simple data primitives?",
      description:
        "Basic values like strings, numbers, objects - no reactive state, no interactive UI, no custom HTML",
      choices: [
        {
          value: "yes",
          label: "Yes",
          description: "Simple data is all I need",
        },
        {
          value: "no",
          label: "No",
          description: "I need reactive state, interactive UI, or custom HTML",
        },
      ],
    },
    {
      id: 3,
      question:
        "Do you prefer manually creating load functions, type definitions, and region patterns yourself?",
      description:
        "Or would you prefer CLI scaffolding and automated type-safe patterns?",
      choices: [
        {
          value: "yes",
          label: "Prefer manual",
          description: "I'd rather write the boilerplate myself",
        },
        {
          value: "no",
          label: "Prefer automation",
          description: "I'd rather use CLI tools and generated code",
        },
      ],
    },
    {
      id: 4,
      question: "Do you need ALL content server-side rendered?",
      description: "SEO-critical, no layout shift, works without JavaScript",
      choices: [
        {
          value: "yes",
          label: "Yes",
          description: "Server rendering is required for my use case",
        },
        {
          value: "no",
          label: "No",
          description: "Client-side rendering is acceptable",
        },
      ],
    },
    {
      id: 5,
      question: "Will your content have a consistent, repeatable schema?",
      description:
        "Examples: Blog posts always have title + author, product pages always have name + price",
      choices: [
        {
          value: "yes",
          label: "Yes",
          description: "My data follows predictable patterns",
        },
        {
          value: "no",
          label: "No",
          description: "Each page has unique, variable content",
        },
      ],
    },
    {
      id: 6,
      question: "Do you need complete per-page control?",
      description:
        "Custom HTML, reactive state, dynamic content, page-specific logic",
      choices: [
        {
          value: "yes",
          label: "Yes",
          description: "I need full flexibility and reactivity",
        },
        {
          value: "no",
          label: "No",
          description: "Simple, consistent patterns are fine",
        },
      ],
    },
  ];

  const totalSteps = 6; // Total possible steps

  // Measure card height for smooth transitions
  $effect(() => {
    // Dependencies: currentQuestionIndex, showResult, cardElement
    void currentQuestionIndex;
    void showResult;

    if (cardElement) {
      // Wait for DOM to update, then measure
      requestAnimationFrame(() => {
        if (cardElement) {
          containerHeight = cardElement.offsetHeight;
        }
      });
    }
  });
</script>

<div class="mx-auto max-w-2xl" role="region" aria-label="Interactive decision quiz">
  <!-- Progress indicator -->
  <QuizProgress {currentStep} {totalSteps} />

  <!-- Navigation buttons -->
  <nav class="flex items-center justify-between mb-6" aria-label="Quiz navigation">
    <!-- Back button (always rendered, faded when not available) -->
    <button
      onclick={goBack}
      aria-label="Go back to previous question"
      aria-disabled={currentStep === 0 && !showResult}
      class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all cursor-pointer"
      style:opacity={currentStep > 0 || showResult ? 1 : 0}
      style:pointer-events={currentStep > 0 || showResult ? 'auto' : 'none'}>
      <ArrowLeft class="h-4 w-4" />
      Back
    </button>

    <!-- Start Over button (always rendered, faded when not available) -->
    <button
      onclick={restart}
      aria-label="Restart quiz from beginning"
      aria-disabled={currentStep === 0 && !showResult}
      class="text-sm text-muted-foreground hover:text-foreground transition-all cursor-pointer"
      style:opacity={currentStep > 0 || showResult ? 1 : 0}
      style:pointer-events={currentStep > 0 || showResult ? 'auto' : 'none'}>
      Start Over
    </button>
  </nav>

  <!-- Quiz content with smooth height transition -->
  <div
    class="relative transition-all duration-300 ease-out"
    style:min-height={containerHeight ? `${containerHeight}px` : "auto"}>
    {#if !showResult}
      {#key currentQuestionIndex}
        <div
          bind:this={cardElement}
          transition:fade={{ duration: 300 }}
          class="absolute w-full rounded-lg border bg-card p-8 shadow-sm"
          role="group"
          aria-labelledby="question-{currentQuestionIndex}"
          aria-describedby="question-desc-{currentQuestionIndex}">
          <h3 id="question-{currentQuestionIndex}" class="text-2xl font-semibold mb-3">
            {questions[currentQuestionIndex].question}
          </h3>

          {#if questions[currentQuestionIndex].description}
            <p id="question-desc-{currentQuestionIndex}" class="text-sm text-muted-foreground mb-6">
              {questions[currentQuestionIndex].description}
            </p>
          {/if}

          <div class="space-y-3" role="radiogroup" aria-labelledby="question-{currentQuestionIndex}">
            {#each questions[currentQuestionIndex].choices as choice}
              <button
                onclick={() => answer(choice.value)}
                role="radio"
                aria-checked="false"
                aria-label="{choice.label}: {choice.description}"
                class="w-full text-left rounded-lg p-4 transition-all bg-muted hover:bg-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer">
                <div class="font-medium mb-1">{choice.label}</div>
                <div class="text-sm text-muted-foreground">
                  {choice.description}
                </div>
              </button>
            {/each}
          </div>
        </div>
      {/key}
    {:else}
      <!-- Quiz Result -->
      <div
        bind:this={cardElement}
        transition:fade={{ duration: 300 }}
        class="absolute w-full rounded-lg border bg-card p-8 shadow-sm"
        role="region"
        aria-live="polite"
        aria-label="Quiz result">
        {#if resultType}
          <QuizResult resultType={resultType} />
        {/if}
      </div>
    {/if}
  </div>
</div>
