<div class="prose dark:prose-invert max-w-none">
	<p>
		Server-side rendering with SvelteKit load functions. Learn more in the
		<a href="/docs/strategy-comparison">Strategy Comparison docs</a>.
	</p>

	<h2>Validator Options</h2>
	<p>
		Each example below shows the load function strategy with a different validator.
		See the <a href="/examples#validator-comparison">validator comparison table</a> for details.
	</p>

	<div class="not-prose grid gap-4 md:grid-cols-3 mt-6">
		<a
			href="/examples/load-function/valibot"
			class="block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10"
		>
			<h3 class="text-lg font-semibold mb-2">Valibot</h3>
			<p class="text-sm text-muted-foreground mb-4">
				Smallest validator library (~1kb). Recommended for most projects.
			</p>
			<div class="text-xs text-primary font-medium">View Example →</div>
		</a>

		<a
			href="/examples/load-function/zod"
			class="block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10"
		>
			<h3 class="text-lg font-semibold mb-2">Zod</h3>
			<p class="text-sm text-muted-foreground mb-4">
				Popular, feature-rich validator. Great if you're already using Zod.
			</p>
			<div class="text-xs text-primary font-medium">View Example →</div>
		</a>

		<a
			href="/examples/load-function/typescript-only"
			class="block rounded-lg bg-indigo-500/5 p-6 transition-all hover:bg-indigo-500/10"
		>
			<h3 class="text-lg font-semibold mb-2">TypeScript Only</h3>
			<p class="text-sm text-muted-foreground mb-4">
				No runtime validation. Smallest bundle, best performance.
			</p>
			<div class="text-xs text-primary font-medium">View Example →</div>
		</a>
	</div>
</div>
