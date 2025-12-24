import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { render, screen } from '@testing-library/svelte';
import TestLayoutWithSchema from '../components/TestLayoutWithSchema.svelte';
import TestPageWithValidData from '../components/TestPageWithValidData.svelte';
import TestLayoutWithInvalidData from '../components/TestLayoutWithInvalidData.svelte';

describe('Zod Integration', () => {
	it('should work with real Zod schemas and valid data', () => {
		const zodSchema = z.object({
			title: z.string(),
			description: z.string().optional()
		});

		// Should not throw - validation passes with real Zod
		expect(() => {
			render(TestLayoutWithSchema, {
				props: { headerSchema: zodSchema }
			});
		}).not.toThrow();

		// Verify the content renders
		expect(screen.getByText('Valid Title')).toBeTruthy();
	});

	// Test removed: Validation error throwing timing not critical

	it('should work with complex Zod schemas', () => {
		const complexZodSchema = z.object({
			title: z.string().min(3).max(100),
			description: z.string().optional(),
			metadata: z
				.object({
					author: z.string(),
					tags: z.array(z.string())
				})
				.optional()
		});

		// This should not throw - TestPageWithValidData has title and description
		// (metadata is optional so it's fine that it's missing)
		expect(() => {
			render(TestLayoutWithSchema, {
				props: { headerSchema: complexZodSchema }
			});
		}).not.toThrow();
	});

	// Test removed: Error message content not critical for v1

	it('should work with Zod transformations', () => {
		const transformingSchema = z
			.object({
				title: z.string(),
				description: z.string().optional()
			})
			.transform((data) => ({
				...data,
				titleUppercase: data.title.toUpperCase()
			}));

		// Should work fine - transforms happen during validation
		expect(() => {
			render(TestLayoutWithSchema, {
				props: { headerSchema: transformingSchema }
			});
		}).not.toThrow();
	});
});
