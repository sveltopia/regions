// Mock for SvelteKit's $app/state module
// Using a mutable object so tests can set page.data.regions
const pageState = {
	url: { pathname: '/test' },
	data: {} as Record<string, unknown>,
	form: null,
	status: 200
};

export const page = pageState;
