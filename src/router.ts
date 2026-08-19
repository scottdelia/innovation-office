import { useSyncExternalStore } from 'react';

/**
 * A hash router in thirty lines.
 *
 * The site is a landing page and three one-pagers. Adding `react-router` for
 * that would be the largest dependency in the project by an order of magnitude,
 * and it would break the claim this codebase makes elsewhere about shipping no
 * libraries it does not need.
 *
 * Hash routing rather than the History API because the deploy target is GitHub
 * Pages, which serves static files and cannot rewrite `/bet/underwriting` back
 * to `index.html`. A deep link under the History API would 404 on refresh; a
 * hash route cannot, because the server never sees the part after the `#`.
 *
 * `useSyncExternalStore` rather than an effect and a state pair: the hash is an
 * external store, React has a hook whose entire purpose is subscribing to one,
 * and it gets tearing-free reads during concurrent rendering for free.
 */

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

/** The current route: `''` for the portfolio, or a bet id. */
function getSnapshot(): string {
  return window.location.hash.replace(/^#\/?/, '');
}

/** Server snapshot. No SSR here, but the hook requires one to be safe. */
function getServerSnapshot(): string {
  return '';
}

export function useRoute(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Navigate, and put the reader at the top of the new page.
 *
 * Without the scroll, following a link from halfway down the portfolio opens a
 * one-pager already scrolled past its own heading, which reads as a broken page
 * rather than as a new one.
 */
export function navigate(route: string): void {
  window.location.hash = route ? `/${route}` : '/';
  window.scrollTo({ top: 0 });
}
