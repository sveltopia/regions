import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Prevent Chrome DevTools request from triggering page reload in dev
  if (event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
    return new Response('{}', {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return resolve(event);
};
