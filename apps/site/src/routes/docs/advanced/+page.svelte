<script lang="ts">
  import CodeViewer from '$lib/components/CodeViewer.svelte';
  import KeyConcept from '$lib/components/KeyConcept.svelte';
  import {
    ListCollapse,
    ArrowRight,
    Code,
    CheckCircle2,
    FileCode,
    AlertCircle,
    X
  } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Advanced - Region Inheritance | @sveltopia/regions</title>
  <meta
    name="description"
    content="Learn advanced patterns like region inheritance for nested layouts and complex routing scenarios."
  />
</svelte:head>

<h1 class="mb-4 text-4xl font-bold">Advanced Patterns</h1>

<p class="mb-8 text-lg text-muted-foreground">
  Learn advanced techniques for working with regions in complex applications.
</p>

<KeyConcept variant="indigo">
  <p class="mb-2 font-semibold">TL;DR - What This Page Covers</p>
  <p class="mb-3">
    This guide focuses on <strong>region inheritance using load functions</strong> (<code
      class="rounded bg-muted px-1 py-0.5">+layout.server.ts</code
    >
    / <code class="rounded bg-muted px-1 py-0.5">+page.server.ts</code>). You'll learn how to use
    <code class="rounded bg-muted px-1 py-0.5">await parent()</code> to inherit, override, and extend
    regions across nested route hierarchies.
  </p>
  <ul class="space-y-2 text-sm">
    <li>• <strong>Best for:</strong> Server-side data fetching with nested layouts</li>
    <li>• <strong>Key technique:</strong> Spread parent regions, then add or override</li>
    <li>
      • <strong>Alternative strategies:</strong> Component Wrapper and Snippet (see
      <a
        href="/docs/strategy-comparison"
        class="text-indigo-600 hover:underline dark:text-indigo-400">Strategy Comparison</a
      >)
    </li>
  </ul>
</KeyConcept>

<div class="my-8">
  <h3 class="mb-3 text-lg font-semibold">Prerequisites</h3>
  <p class="mb-3 text-sm text-muted-foreground">This guide assumes you're comfortable with:</p>
  <ul class="space-y-2 text-sm text-muted-foreground">
    <li>
      • <strong>SvelteKit load functions</strong> - How
      <code class="rounded bg-muted px-1 py-0.5">+layout.server.ts</code>
      and <code class="rounded bg-muted px-1 py-0.5">+page.server.ts</code> work (<a
        href="https://kit.svelte.dev/docs/load"
        target="_blank"
        rel="noopener noreferrer"
        class="text-indigo-600 hover:underline dark:text-indigo-400">SvelteKit docs</a
      >)
    </li>
    <li>
      • <strong>Basic region usage</strong> - How to define and render regions (<a
        href="/docs/quick-start"
        class="text-indigo-600 hover:underline dark:text-indigo-400">Quick Start guide</a
      >)
    </li>
  </ul>
</div>

<!-- SvelteKit Layout Hierarchy -->
<section class="mb-12">
  <h2 class="mb-4 text-3xl font-semibold">SvelteKit Layout Hierarchy</h2>

  <p class="mb-6 text-muted-foreground">
    Before diving into region inheritance, it's important to understand how SvelteKit's load
    function hierarchy works. Our regions system builds on top of these core SvelteKit concepts.
  </p>

  <h3 class="mb-3 text-2xl font-semibold">Load Functions: Layout vs Page</h3>

  <p class="mb-4 text-muted-foreground">
    SvelteKit provides two types of server-side load functions that work together in a hierarchy:
  </p>

  <div class="mb-6 space-y-4">
    <KeyConcept variant="indigo" icon={FileCode}>
      <p class="mb-2 font-semibold">
        <code class="rounded bg-muted px-1.5 py-0.5">+layout.server.ts</code>
      </p>
      <ul class="space-y-2">
        <li>• Runs <strong>once per layout level</strong> and applies to all child routes</li>
        <li>
          • Best for data that's <strong>common across multiple pages</strong> (navigation, auth, section-wide
          settings)
        </li>
        <li>
          • Can access route params if the layout is nested (e.g., <code
            class="rounded bg-muted px-1 py-0.5">/products/[category]/+layout.server.ts</code
          >)
        </li>
        <li>• Returns data available to both the layout AND all descendant pages</li>
      </ul>
    </KeyConcept>

    <KeyConcept variant="slate" icon={FileCode}>
      <p class="mb-2 font-semibold">
        <code class="rounded bg-muted px-1.5 py-0.5">+page.server.ts</code>
      </p>
      <ul class="space-y-2">
        <li>• Runs <strong>only for this specific page</strong></li>
        <li>
          • Best for <strong>page-specific data fetching</strong> (product details, user profile, article
          content)
        </li>
        <li>
          • Can call <code class="rounded bg-muted px-1.5 py-0.5">await parent()</code> to access all
          parent layout data
        </li>
        <li>• Can merge or override parent data before returning</li>
      </ul>
    </KeyConcept>
  </div>

  <h3 class="mb-3 text-2xl font-semibold">Common Patterns</h3>

  <div class="mb-6 space-y-4 text-sm">
    <div>
      <p class="mb-2 font-semibold">Scenario 1: Section-wide data in layout</p>
      <CodeViewer
        language="typescript"
        code={`// routes/products/+layout.server.ts
export const load = () => ({
  regions: {
    sidebar: { items: ["All Products", "Categories", "Featured"] }
  }
});

// routes/products/[id]/+page.server.ts
export const load = async ({ parent, params }) => {
  const parentData = await parent();
  const product = await fetchProduct(params.id);

  return {
    regions: {
      ...(parentData.regions || {}),  // Inherits sidebar
      pageHeader: { title: product.name }  // Adds page-specific header
    },
    product
  };
};`}
      />
    </div>

    <div>
      <p class="mb-2 font-semibold">Scenario 2: Page-specific data only</p>
      <CodeViewer
        language="typescript"
        code={`// routes/products/+layout.svelte defines empty pageHeader slot
// Each page provides its own content:

// routes/products/[id]/+page.server.ts
export const load = async ({ params }) => {
  const product = await fetchProduct(params.id);

  return {
    regions: {
      pageHeader: { title: product.name, price: product.price }
    }
  };
};`}
      />
    </div>
  </div>

  <h3 class="mb-3 text-2xl font-semibold">How This Connects to Regions</h3>

  <p class="mb-4 text-muted-foreground">
    Our regions system automatically reads from the <code class="rounded bg-muted px-1.5 py-0.5"
      >regions</code
    >
    key in your load function return data. This works for BOTH
    <code class="rounded bg-muted px-1.5 py-0.5">+layout.server.ts</code>
    and
    <code class="rounded bg-muted px-1.5 py-0.5">+page.server.ts</code> files:
  </p>

  <KeyConcept variant="neutral" icon={CheckCircle2}>
    <p class="mb-3 font-semibold">Both of these work automatically:</p>
    <ul class="space-y-2">
      <li>
        • Layout load functions: <code class="rounded bg-background px-1.5 py-0.5"
          >+layout.server.ts</code
        > → defines regions for entire section
      </li>
      <li>
        • Page load functions: <code class="rounded bg-background px-1.5 py-0.5"
          >+page.server.ts</code
        > → defines regions for specific page
      </li>
      <li>
        • No <code class="rounded bg-background px-1.5 py-0.5">useLayoutRegions()</code> call needed for
        load function data
      </li>
      <li>
        • <code class="rounded bg-background px-1.5 py-0.5">&lt;LayoutRegion&gt;</code>
        automatically reads from
        <code class="rounded bg-background px-1.5 py-0.5">page.data.regions</code>
      </li>
    </ul>
  </KeyConcept>

  <KeyConcept variant="slate" icon={AlertCircle}>
    <p class="mb-2 font-semibold">When to use useLayoutRegions()</p>
    <p class="mb-3">
      The <code class="rounded bg-muted px-1.5 py-0.5">useLayoutRegions()</code> function is for
      <strong>programmatic region definition in Svelte components</strong>—it's NOT needed when
      using load functions.
    </p>
    <ul class="space-y-2 text-sm">
      <li>
        <strong>Load Function Strategy (this page):</strong> Define regions in
        <code class="rounded bg-muted px-1 py-0.5">+layout.server.ts</code>
        or <code class="rounded bg-muted px-1 py-0.5">+page.server.ts</code>. Data flows to
        <code class="rounded bg-muted px-1 py-0.5">page.data.regions</code>
        automatically. No <code class="rounded bg-muted px-1 py-0.5">useLayoutRegions()</code> call needed.
      </li>
      <li>
        <strong>Component Wrapper / Snippet Strategies:</strong> Call
        <code class="rounded bg-muted px-1 py-0.5">useLayoutRegions()</code>
        in your content component (e.g.,
        <code class="rounded bg-muted px-1 py-0.5">GalleryHeader.svelte</code>
        or <code class="rounded bg-muted px-1 py-0.5">+page.svelte</code>) to provide region
        content. The <code class="rounded bg-muted px-1 py-0.5">+layout.svelte</code> contains the
        region slot component (e.g.,
        <code class="rounded bg-muted px-1 py-0.5">&lt;LayoutRegion&gt;</code>) that renders it.
      </li>
    </ul>
    <p class="mt-3 text-sm">
      <strong>TL;DR:</strong> If you're defining regions in load functions, you never call
      <code class="rounded bg-muted px-1 py-0.5">useLayoutRegions()</code>. For Component
      Wrapper/Snippet strategies, you call it in the component providing content, not in the layout.
    </p>
  </KeyConcept>

  <div class="mb-6">
    <a
      href="https://kit.svelte.dev/docs/load"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 text-indigo-600 hover:underline dark:text-indigo-400"
    >
      Learn more about SvelteKit load functions →
    </a>
  </div>
</section>

<!-- Region Inheritance -->
<section class="mb-12">
  <h2 class="mb-4 text-3xl font-semibold">Region Inheritance</h2>

  <p class="mb-6 text-muted-foreground">
    Region inheritance allows child pages to inherit and extend regions defined in parent layouts.
    This is useful for nested layouts where you want to preserve parent regions while adding or
    overriding specific ones at deeper nesting levels.
  </p>

  <KeyConcept variant="indigo" icon={ListCollapse}>
    <p class="mb-2 font-semibold">Live Example</p>
    <p class="mb-3">
      See region inheritance in action with visual indicators showing inherited, overridden, and
      added regions.
    </p>
    <a
      href="/examples/advanced"
      class="inline-flex items-center gap-2 text-indigo-600 hover:underline dark:text-indigo-400"
    >
      View Interactive Demo →
    </a>
  </KeyConcept>

  <h3 class="mb-3 text-2xl font-semibold">The Pattern</h3>

  <p class="mb-4 text-muted-foreground">
    Use the <code class="rounded bg-muted px-2 py-1 text-sm">parent()</code> function in your load function
    to access parent data and merge regions:
  </p>

  <CodeViewer
    language="typescript"
    code={`// routes/products/[id]/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, params }) => {
  const parentData = await parent();

  return {
    regions: {
      ...(parentData.regions || {}),  // Inherit all parent regions
      pageHeader: {                    // Override or add new region
        title: \`Product #\${params.id}\`,
        description: "View product details"
      }
    }
  };
};`}
  />

  <KeyConcept variant="neutral" icon={AlertCircle}>
    <p class="mb-2 font-semibold">Important: Spread .regions, Not All Parent Data</p>
    <p class="mb-3">
      The <code class="rounded bg-muted px-1.5 py-0.5">parentData</code> object contains
      <strong>all data</strong>
      returned by parent load functions—not just regions. This might include
      <code class="rounded bg-muted px-1 py-0.5">user</code>,
      <code class="rounded bg-muted px-1 py-0.5">session</code>,
      <code class="rounded bg-muted px-1 py-0.5">breadcrumbs</code>, or any other data your parent
      layouts return.
    </p>
    <p class="mb-3">
      <strong
        >Only spread <code class="rounded bg-muted px-1.5 py-0.5">parentData.regions</code></strong
      >, not the entire <code class="rounded bg-muted px-1.5 py-0.5">parentData</code> object:
    </p>
    <div class="space-y-3 text-sm">
      <div>
        <p class="mb-1 flex items-center gap-1.5 text-green-600 dark:text-green-400">
          <CheckCircle2 class="h-4 w-4" /> Correct:
        </p>
        <code class="block rounded bg-background px-2 py-1">
          {'regions: { ...(parentData.regions || {}), pageHeader: {...} }'}
        </code>
      </div>
      <div>
        <p class="mb-1 flex items-center gap-1.5 text-red-600 dark:text-red-400">
          <X class="h-4 w-4" /> Wrong:
        </p>
        <code class="block rounded bg-background px-2 py-1">
          {'regions: { ...parentData, pageHeader: {...} }'}
        </code>
        <p class="mt-1 text-xs italic">
          This would include user, session, etc. in your regions object!
        </p>
      </div>
    </div>
  </KeyConcept>

  <KeyConcept variant="indigo">
    <p class="mb-2 font-semibold">Key Points:</p>
    <ul class="mt-2 space-y-3">
      <li>
        • <strong>Spread first</strong>:
        <code class="rounded bg-muted px-1.5 py-0.5">{'...(parentData.regions || {})'}</code> preserves
        parent regions
      </li>
      <li>
        • <strong>Override after</strong>: Define regions with the same name to override parent's
        version
      </li>
      <li>
        • <strong>Safety fallback</strong>:
        <code class="rounded bg-muted px-1.5 py-0.5">{'|| {}'}</code> handles undefined parent regions
      </li>
    </ul>
  </KeyConcept>

  <KeyConcept variant="neutral" icon={AlertCircle}>
    <p class="mb-2 font-semibold">Server vs Universal Load Inheritance</p>
    <p class="mb-3">
      The <code class="rounded bg-muted px-1.5 py-0.5">parent()</code> function behaves differently depending
      on your file type:
    </p>
    <ul class="space-y-2">
      <li>
        • In <code class="rounded bg-muted px-1 py-0.5">+page.server.ts</code> or
        <code class="rounded bg-muted px-1 py-0.5">+layout.server.ts</code>: Returns data only from
        parent <code class="rounded bg-muted px-1 py-0.5">+layout.server.ts</code> files
      </li>
      <li>
        • In <code class="rounded bg-muted px-1 py-0.5">+page.ts</code> or
        <code class="rounded bg-muted px-1 py-0.5">+layout.ts</code>: Returns data from parent
        <code class="rounded bg-muted px-1 py-0.5">+layout.ts</code>
        files, OR from parent <code class="rounded bg-muted px-1 py-0.5">+layout.server.ts</code>
        files if no <code class="rounded bg-muted px-1 py-0.5">+layout.ts</code> shadows them
      </li>
    </ul>
    <p class="mt-3">
      <strong
        >For this regions pattern, we recommend using <code class="rounded bg-muted px-1.5 py-0.5"
          >.server.ts</code
        > files consistently for simpler, more predictable inheritance.</strong
      >
    </p>
  </KeyConcept>

  <h3 class="mt-8 mb-3 text-2xl font-semibold">How It Works</h3>

  <div class="mb-6 space-y-4 text-muted-foreground">
    <p>
      <strong>1. Inheritance:</strong> Child pages automatically receive all regions from parent layouts
    </p>
    <p>
      <strong>2. Override:</strong> Child can redefine a region with the same name to replace parent's
      version
    </p>
    <p><strong>3. Addition:</strong> Child can add new regions alongside inherited ones</p>
  </div>

  <KeyConcept variant="neutral">
    <p class="mb-2 font-semibold">Example Scenario - Addition:</p>
    <ul class="space-y-3">
      <li>
        • <strong>Parent layout defines:</strong>
        <code class="rounded bg-background px-1.5 py-0.5">{'{ "breadcrumbs", "sidebar" }'}</code>
      </li>
      <li>
        • <strong>Child page defines:</strong>
        <code class="rounded bg-background px-1.5 py-0.5">{'{ "pageHeader", "footer" }'}</code>
      </li>
      <li>
        • <strong>Final merged regions:</strong>
        <code class="rounded bg-background px-1.5 py-0.5"
          >{'{ "breadcrumbs", "sidebar", "pageHeader", "footer" }'}</code
        >
      </li>
    </ul>
  </KeyConcept>

  <KeyConcept variant="neutral">
    <p class="mb-2 font-semibold">Example Scenario - Override:</p>
    <ul class="space-y-3">
      <li>
        • <strong>Parent layout defines:</strong>
        <code class="rounded bg-background px-1.5 py-0.5"
          >{'{ "breadcrumbs", "sidebar": { items: ["Home", "About"] } }'}</code
        >
      </li>
      <li>
        • <strong>Child page defines:</strong>
        <code class="rounded bg-background px-1.5 py-0.5"
          >{'{ "breadcrumbs", "sidebar": { items: ["Products", "Categories"] }, "pageHeader" }'}</code
        >
      </li>
      <li>
        • <strong>Final merged regions:</strong>
        <code class="rounded bg-background px-1.5 py-0.5"
          >{'{ "breadcrumbs" (child version), "sidebar" (child version), "pageHeader" (new) }'}</code
        >
      </li>
    </ul>
  </KeyConcept>

  <h3 class="mt-8 mb-3 text-2xl font-semibold">Complete Example</h3>

  <p class="mb-4 text-muted-foreground">
    Here's a complete example showing region inheritance across multiple layout levels:
  </p>

  <h4 class="mb-3 text-xl font-medium">Root Layout</h4>
  <p class="mb-4 text-sm text-muted-foreground">
    Defines global navigation available on all pages:
  </p>

  <CodeViewer
    language="typescript"
    code={`// routes/+layout.server.ts
export const load = () => ({
  regions: {
    breadcrumbs: {
      items: [{ label: "Home", href: "/" }]
    }
  }
});`}
  />

  <h4 class="mt-6 mb-3 text-xl font-medium">Section Layout</h4>
  <p class="mb-4 text-sm text-muted-foreground">
    Inherits breadcrumbs, adds section-specific sidebar:
  </p>

  <CodeViewer
    language="typescript"
    code={`// routes/products/+layout.server.ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
  const parentData = await parent();

  return {
    regions: {
      ...(parentData.regions || {}),  // Keep breadcrumbs from root
      breadcrumbs: {                   // Override to extend path
        items: [
          ...(parentData.regions?.breadcrumbs?.items || []),
          { label: "Products", href: "/products" }
        ]
      },
      sidebar: {                       // Add section sidebar
        items: ["All Products", "Categories", "Featured"]
      }
    }
  };
};`}
  />

  <h4 class="mt-6 mb-3 text-xl font-medium">Page Level</h4>
  <p class="mb-4 text-sm text-muted-foreground">
    Inherits breadcrumbs and sidebar, adds page-specific header:
  </p>

  <CodeViewer
    language="typescript"
    code={`// routes/products/[id]/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, params }) => {
  const parentData = await parent();
  const product = await fetchProduct(params.id);

  return {
    regions: {
      ...(parentData.regions || {}),  // Keep breadcrumbs + sidebar
      breadcrumbs: {                   // Extend breadcrumb trail
        items: [
          ...(parentData.regions?.breadcrumbs?.items || []),
          { label: product.name, href: \`/products/\${params.id}\` }
        ]
      },
      pageHeader: {                    // Add page-specific header
        title: product.name,
        price: product.price,
        inStock: product.inStock
      }
    },
    product
  };
};`}
  />

  <KeyConcept variant="slate" icon={CheckCircle2}>
    <p class="mb-2 font-semibold">Result at /products/123:</p>
    <ul class="mt-2 space-y-3">
      <li>• <strong>breadcrumbs:</strong> Home → Products → Product Name</li>
      <li>• <strong>sidebar:</strong> Products section navigation</li>
      <li>• <strong>pageHeader:</strong> Product-specific header</li>
    </ul>
  </KeyConcept>

  <h3 class="mt-8 mb-3 text-2xl font-semibold">Common Patterns</h3>

  <div class="space-y-6">
    <div>
      <h4 class="mb-2 text-lg font-medium">Global Navigation</h4>
      <p class="mb-3 text-sm text-muted-foreground">
        Define breadcrumbs or navigation in root layout, extend in nested layouts:
      </p>
      <CodeViewer
        language="typescript"
        code={`// Root: Start breadcrumb trail
regions: {
  breadcrumbs: { items: [{ label: "Home", href: "/" }] }
}

// Section: Extend trail
regions: {
  ...(parentData.regions || {}),
  breadcrumbs: {
    items: [
      ...parentData.regions.breadcrumbs.items,
      { label: "Products", href: "/products" }
    ]
  }
}`}
      />
    </div>

    <div>
      <h4 class="mb-2 text-lg font-medium">Section-Specific Sidebars</h4>
      <p class="mb-3 text-sm text-muted-foreground">
        Add sidebars at section level, inherit in deeper pages:
      </p>
      <CodeViewer
        language="typescript"
        code={`// Section layout: Define sidebar
regions: {
  sidebar: { items: ["Dashboard", "Settings", "Profile"] }
}

// Child page: Inherit sidebar, add page content
regions: {
  ...(parentData.regions || {}),  // Keeps sidebar
  pageHeader: { title: "Settings" }
}`}
      />
    </div>

    <div>
      <h4 class="mb-2 text-lg font-medium">Conditional Override</h4>
      <p class="mb-3 text-sm text-muted-foreground">
        Override parent regions based on page conditions:
      </p>
      <CodeViewer
        language="typescript"
        code={`// Override sidebar for specific pages
export const load: PageServerLoad = async ({ parent, url }) => {
  const parentData = await parent();
  const isAdminPage = url.pathname.startsWith('/admin');

  return {
    regions: {
      ...(parentData.regions || {}),
      ...(isAdminPage && {
        sidebar: { items: ["Admin Dashboard", "Users", "Settings"] }
      })
    }
  };
};`}
      />
    </div>
  </div>

  <h3 class="mt-8 mb-3 text-2xl font-semibold">Gotchas & Best Practices</h3>

  <div class="space-y-4">
    <KeyConcept variant="slate" icon={AlertCircle}>
      <p class="mb-2 font-semibold">Order Matters</p>
      <p class="mb-4">
        Always spread parent regions <strong>first</strong>, then define your overrides. Spreading
        after will erase your changes!
      </p>
      <CodeViewer
        language="typescript"
        code={`// Correct: Override works
regions: {
  ...(parentData.regions || {}),  // Spread first
  pageHeader: { title: "New" }     // Then override
}

// Wrong: Override gets erased
regions: {
  pageHeader: { title: "New" },    // Define first
  ...(parentData.regions || {})   // Then spread = erases override!
}`}
      />
    </KeyConcept>

    <KeyConcept variant="slate" icon={AlertCircle}>
      <p class="mb-2 font-semibold">Type Safety</p>
      <p class="mb-4">
        Parent data is typed as <code class="rounded bg-muted px-1.5 py-0.5"
          >Awaited&lt;ReturnType&lt;typeof import('./$types').LayoutServerLoad&gt;&gt;</code
        >
        but regions are <code class="rounded bg-muted px-1.5 py-0.5">unknown</code>. Cast parent
        data to access regions and use type assertions for specific region data:
      </p>
      <CodeViewer
        language="typescript"
        code={`import type { BreadcrumbData } from '$lib/types';

const parentData = await parent();
const parentRegions = (parentData as Record<string, unknown>).regions || {};
const parentBreadcrumbs = parentRegions.breadcrumbs as BreadcrumbData | undefined;

return {
  regions: {
    ...parentRegions,
    breadcrumbs: {
      items: [
        ...(parentBreadcrumbs?.items || []),
        { label: "New", href: "/new" }
      ]
    }
  }
};`}
      />
    </KeyConcept>

    <KeyConcept variant="slate" icon={AlertCircle}>
      <p class="mb-2 font-semibold">Performance Considerations</p>
      <p class="mb-3">
        <code class="rounded bg-muted px-1.5 py-0.5">await parent()</code> waits for all parent load functions
        to complete. This is sequential by design and usually fast, but be aware of the dependency chain
        in deeply nested routes.
      </p>
      <p class="text-sm">
        For performance optimization tips, see the <a
          href="https://kit.svelte.dev/docs/performance"
          target="_blank"
          rel="noopener noreferrer"
          class="text-indigo-600 hover:underline dark:text-indigo-400"
          >SvelteKit performance guide</a
        >.
      </p>
    </KeyConcept>

    <KeyConcept variant="indigo">
      <p class="mb-2 font-semibold">Pro Tip: Null to Reset</p>
      <p class="mb-4">
        Set a region to <code class="rounded bg-muted px-1.5 py-0.5">null</code> to explicitly remove
        a parent's region (suppresses both content and fallback):
      </p>
      <CodeViewer
        language="typescript"
        code={`regions: {
  ...(parentData.regions || {}),
  sidebar: null  // Hide parent's sidebar on this page
}`}
      />
    </KeyConcept>
  </div>
</section>

<!-- Next Steps -->
<div class="prose mt-12 max-w-none dark:prose-invert">
  <h2>Next Steps</h2>
</div>

<div class="not-prose mt-6 grid gap-4 md:grid-cols-2">
  <a
    href="/docs/api-reference"
    class="group block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10"
  >
    <div class="mb-3 flex items-start justify-between">
      <div class="rounded-lg bg-indigo-500/10 p-2">
        <Code class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
      </div>
      <ArrowRight
        class="h-5 w-5 -translate-x-2 text-indigo-600 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 dark:text-indigo-400"
      />
    </div>
    <h3 class="mb-2 text-lg font-semibold">API Reference</h3>
    <p class="text-sm text-muted-foreground">
      Complete reference for all exports, types, and interfaces
    </p>
  </a>
</div>
