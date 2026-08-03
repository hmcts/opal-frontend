import { Observable, tap } from 'rxjs';

/**
 * Preserves the initial resolver cache and clears it on later draft tab changes.
 *
 * @param fragment$ - The active draft tab stream.
 * @param clearCache - The callback that clears the draft accounts cache.
 * @returns The active draft tab stream with cache invalidation applied.
 */
export function createDraftFragmentStream(fragment$: Observable<string>, clearCache: () => void): Observable<string> {
  let isInitialFragment = true;

  return fragment$.pipe(
    tap(() => {
      if (isInitialFragment) {
        isInitialFragment = false;
        return;
      }

      clearCache();
    }),
  );
}
