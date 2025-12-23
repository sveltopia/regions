import { spinner, note, log } from "@clack/prompts";
import {
  promptForStrategy,
  promptForFields,
  promptForValidator,
  promptForServerSide,
  promptForLoadFunctionPath,
  promptForExamplePath,
  type RegionStrategy,
} from "../utils/prompts.js";
import {
  generateTypeOnlySchema,
  generateValibotSchema,
  generateZodSchema,
  type FieldDefinition,
} from "../templates/schema.js";
import {
  generateWrapperComponent,
  generateLayoutConsumer,
} from "../templates/component.js";
import { generateLoadFunction } from "../templates/load-function.js";
import { generateSnippetBoilerplate } from "../templates/snippet.js";
import {
  generateExampleLayout,
  generateSnippetExampleLayout,
  generateSnippetExamplePage,
  generateWrapperExamplePage,
} from "../templates/example-files.js";
import {
  writeFile,
  toCamelCase,
  toPascalCase,
  normalizeRegionName,
} from "../utils/files.js";
import path from "path";

/**
 * The main command handler for `regions add <regionName>`.
 *
 * This orchestrates the entire flow with support for three strategies:
 * 1. Load function (SSR) - Generates schema, consumer, and load function example
 * 2. Component wrapper - Generates schema, wrapper, and consumer components
 * 3. Snippet - Outputs boilerplate template (no files)
 */
export async function addCommand(regionName: string) {
  // Normalize region name: accept both 'page-header' and 'pageHeader', always use camelCase in code
  const normalizedRegionName = normalizeRegionName(regionName);

  // Step 1: Ask which strategy to use (or use TEST_STRATEGY env var for testing)
  const strategy = process.env.TEST_STRATEGY
    ? (process.env.TEST_STRATEGY as RegionStrategy)
    : await promptForStrategy();

  // Step 2: For snippet strategy, generate example files only
  // Snippets don't need field definitions or consumer components - LayoutRegion handles them directly!
  if (strategy === "snippet") {
    // Ask where to generate example files
    const examplePath = process.env.TEST_EXAMPLE_PATH
      ? process.env.TEST_EXAMPLE_PATH
      : await promptForExamplePath('snippet', normalizedRegionName);

    const s = spinner();
    s.start("Generating files...");

    const createdFiles: string[] = [];

    // Generate +layout.svelte with LayoutRegion (no consumer component needed!)
    const layoutPath = path.join(examplePath, "+layout.svelte");
    const layoutContent = generateSnippetExampleLayout(normalizedRegionName);
    await writeFile(layoutPath, layoutContent);
    createdFiles.push(layoutPath);

    // Generate +page.svelte with snippet usage
    const pagePath = path.join(examplePath, "+page.svelte");
    const pageContent = generateSnippetExamplePage(normalizedRegionName);
    await writeFile(pagePath, pageContent);
    createdFiles.push(pagePath);

    s.stop("Files created!");

    note(createdFiles.map((f) => `  ✓ ${f}`).join("\n"), "Created files");

    note(
      `1. Customize your snippet in:\n` +
        `     ${pagePath}\n` +
        `   - Add any HTML/UI you need\n` +
        `   - Use page state, props, and context freely\n\n` +
        `2. Test the example:\n` +
        `   - Visit /${examplePath.replace(/^src\/routes\//, '')} in your browser\n` +
        `   - The snippet has reactive state you can interact with\n\n` +
        `3. Add more regions:\n` +
        `   - Add <LayoutRegion name="regionName" /> to:\n` +
        `     ${layoutPath}\n` +
        `   - Create snippets and register with useLayoutRegions()`,
      "Next steps"
    );

    return; // Done
  }

  // Step 3: Gather field definitions (for load-function and page-component)
  const fields = process.env.TEST_FIELDS
    ? JSON.parse(process.env.TEST_FIELDS)
    : await promptForFields();

  let validator: "valibot" | "zod" | undefined;
  if ("TEST_VALIDATOR" in process.env && process.env.TEST_VALIDATOR) {
    // In test mode: 'valibot', 'zod', or 'none' for no validator
    const testValidator = process.env.TEST_VALIDATOR;
    if (testValidator === "none") {
      validator = undefined;
    } else if (testValidator === "valibot" || testValidator === "zod") {
      validator = testValidator;
    }
  } else {
    // Interactive mode
    const selectedValidator = await promptForValidator();
    validator = selectedValidator === "none" ? undefined : selectedValidator;
  }

  // Step 4: Ask about example path for all strategies
  let serverOnly = true;
  let examplePath = "src/routes/example";

  if (strategy === "load-function") {
    serverOnly = process.env.TEST_SERVER_ONLY
      ? process.env.TEST_SERVER_ONLY === "true"
      : await promptForServerSide();
    examplePath = process.env.TEST_EXAMPLE_PATH
      ? process.env.TEST_EXAMPLE_PATH
      : await promptForLoadFunctionPath(normalizedRegionName);
  } else if (strategy === "page-component") {
    examplePath = process.env.TEST_EXAMPLE_PATH
      ? process.env.TEST_EXAMPLE_PATH
      : await promptForExamplePath('page-component', normalizedRegionName);
  }

  // Step 5: Show spinner while generating files
  const s = spinner();
  s.start("Generating files...");

  try {
    const createdFiles: string[] = [];

    // Step 6: Generate schema/type file (both strategies need this)
    let schemaContent: string;
    let schemaFileName: string;

    if (validator === undefined) {
      // TypeScript-only: generate just a type file (no schema)
      schemaContent = generateTypeOnlySchema(normalizedRegionName, fields);
      schemaFileName = toPascalCase(normalizedRegionName) + "Data";
    } else if (validator === "valibot") {
      schemaContent = generateValibotSchema(normalizedRegionName, fields);
      schemaFileName = toCamelCase(normalizedRegionName) + "Schema";
    } else {
      schemaContent = generateZodSchema(normalizedRegionName, fields);
      schemaFileName = toCamelCase(normalizedRegionName) + "Schema";
    }

    const schemaPath = path.join(
      process.cwd(),
      `src/lib/regions/${normalizedRegionName}/${schemaFileName}.ts`
    );
    await writeFile(schemaPath, schemaContent);
    createdFiles.push(
      `src/lib/regions/${normalizedRegionName}/${schemaFileName}.ts`
    );

    // Step 7: Generate layout consumer component (both strategies need this)
    const consumerContent = generateLayoutConsumer(
      normalizedRegionName,
      fields,
      strategy,
      validator
    );
    const consumerName = `${toPascalCase(normalizedRegionName)}Region`;
    const consumerPath = path.join(
      process.cwd(),
      `src/lib/regions/${normalizedRegionName}/${consumerName}.svelte`
    );
    await writeFile(consumerPath, consumerContent);
    createdFiles.push(
      `src/lib/regions/${normalizedRegionName}/${consumerName}.svelte`
    );

    // Step 8: Strategy-specific generation
    if (strategy === "page-component") {
      // Generate wrapper component
      const wrapperContent = generateWrapperComponent(
        normalizedRegionName,
        fields
      );
      const wrapperName = toPascalCase(normalizedRegionName);
      const wrapperPath = path.join(
        process.cwd(),
        `src/lib/regions/${normalizedRegionName}/${wrapperName}.svelte`
      );
      await writeFile(wrapperPath, wrapperContent);
      createdFiles.push(
        `src/lib/regions/${normalizedRegionName}/${wrapperName}.svelte`
      );

      // Generate +layout.svelte with consumer import
      const layoutPath = path.join(examplePath, "+layout.svelte");
      const layoutContent = generateExampleLayout(normalizedRegionName);
      await writeFile(layoutPath, layoutContent);
      createdFiles.push(`${examplePath}/+layout.svelte`);

      // Generate +page.svelte with wrapper usage
      const pagePath = path.join(examplePath, "+page.svelte");
      const pageContent = generateWrapperExamplePage(normalizedRegionName, fields);
      await writeFile(pagePath, pageContent);
      createdFiles.push(`${examplePath}/+page.svelte`);
    } else if (strategy === "load-function") {
      // Generate load function example
      const loadContent = generateLoadFunction(
        normalizedRegionName,
        fields,
        serverOnly
      );
      const loadFile = serverOnly ? "+page.server.ts" : "+page.ts";
      const loadPath = path.join(process.cwd(), examplePath, loadFile);
      await writeFile(loadPath, loadContent);
      createdFiles.push(`${examplePath}/${loadFile}`);

      // Generate +layout.svelte with consumer import
      const layoutPath = path.join(examplePath, "+layout.svelte");
      const layoutContent = generateExampleLayout(normalizedRegionName);
      await writeFile(layoutPath, layoutContent);
      createdFiles.push(`${examplePath}/+layout.svelte`);
    }

    s.stop("Files created!");

    // Step 9: Show created files
    note(createdFiles.map((f) => `  ✓ ${f}`).join("\n"), "Created files");

    // Step 10: Show next steps based on strategy
    if (strategy === "load-function") {
      const isExampleRoute = examplePath === "src/routes/example";

      note(
        `1. Customize the region UI in ${consumerName}.svelte:\n` +
          `   - Wrap your data properties with your desired HTML/UI\n` +
          `   - The data properties (${fields
            .map((f: FieldDefinition) => f.name)
            .join(", ")}) are already inserted\n\n` +
          `2. Test the example:\n` +
          `   - Visit /${examplePath.replace(/^src\/routes\//, '')} in your browser\n` +
          `   - See the generated layout and load function in:\n` +
          `     ${examplePath}/+layout.svelte\n\n` +
          (isExampleRoute
            ? `3. Move files to your actual page route(s):\n` +
              `   - Copy the load function and layout to your route\n` +
              `     (e.g., src/routes/products/)\n` +
              `   - Update the TODO placeholders with real data`
            : `3. Customize the load function:\n` +
              `   - Update the TODO placeholders in:\n` +
              `     ${examplePath}/+page${
                serverOnly ? ".server" : ""
              }.ts\n` +
              `   - Add any additional logic needed`),
        "Next steps"
      );
    } else if (strategy === "page-component") {
      const wrapperName = toPascalCase(normalizedRegionName);
      note(
        `1. Customize the region UI in ${consumerName}.svelte:\n` +
          `   - Wrap your data properties with your desired HTML/UI\n` +
          `   - The data properties (${fields
            .map((f: FieldDefinition) => f.name)
            .join(", ")}) are already inserted\n\n` +
          `2. Test the example:\n` +
          `   - Visit /${examplePath.replace(/^src\/routes\//, '')} in your browser\n` +
          `   - See the wrapper component in action in:\n` +
          `     ${examplePath}/+page.svelte\n\n` +
          `3. Use in your pages:\n` +
          `   - Copy the wrapper pattern from:\n` +
          `     ${examplePath}/+page.svelte\n` +
          `   - Import ${wrapperName} and pass your data as props`,
        "Next steps"
      );
    }
  } catch (error) {
    s.stop("Failed to generate files");
    throw error;
  }
}
