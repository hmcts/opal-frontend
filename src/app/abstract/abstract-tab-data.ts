import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, switchMap, map, shareReplay } from 'rxjs';

export abstract class AbstractTabData {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  public activeTab!: string;

  /**
   * Creates an observable stream that conditionally fetches and transforms data based on the current tab.
   *
   * If the current tab matches the `initialTab`, the stream emits the provided `initialValue`.
   * Otherwise, it fetches data using the `fetchData` function with parameters obtained from `getParams`,
   * transforms the result using the `transform` function, and shares the result among subscribers.
   *
   * @template T The type of data returned by the fetchData observable.
   * @template U The type of the value emitted by the resulting observable.
   * @param initialTab - The tab identifier that triggers emission of the initial value.
   * @param fragment$ - An observable emitting the current tab identifier.
   * @param initialValue - The value to emit when the current tab matches `initialTab`.
   * @param getParams - A function that returns parameters for data fetching based on the tab.
   * @param fetchData - A function that fetches data as an observable, given the parameters.
   * @param transform - A function to transform the fetched data before emission.
   * @returns An observable emitting either the initial value or the transformed fetched data, depending on the current tab.
   */
  private createConditionalStream<T, U>(
    initialTab: string,
    fragment$: Observable<string>,
    initialValue: U,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getParams: (tab?: string) => any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchData: (params: any) => Observable<T>,
    transform: (data: T) => U,
  ): Observable<U> {
    return fragment$.pipe(
      switchMap((tab) =>
        tab === initialTab ? of(initialValue) : fetchData(getParams(tab)).pipe(map(transform), shareReplay(1)),
      ),
    );
  }

  /**
   * Creates an observable data stream for a tab, transforming the fetched data as needed.
   *
   * @template T The type of the data fetched.
   * @template R The type of the transformed data.
   * @param initialData The initial data to use before fetching.
   * @param initialTab The initial tab identifier.
   * @param fragment$ An observable emitting the current tab fragment.
   * @param getParams A function that returns fetch parameters based on the tab.
   * @param fetchData A function that fetches data given the parameters.
   * @param transform A function to transform the fetched data.
   * @returns An observable emitting the transformed data for the current tab.
   */
  public createTabDataStream<T, R>(
    initialData: T,
    initialTab: string,
    fragment$: Observable<string>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getParams: (tab?: string) => any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchData: (params: any) => Observable<T>,
    transform: (data: T) => R,
  ): Observable<R> {
    return this.createConditionalStream<T, R>(
      initialTab,
      fragment$,
      transform(initialData),
      getParams,
      fetchData,
      transform,
    );
  }

  /**
   * Creates an observable stream that emits a formatted count string based on the current tab and fragment.
   *
   * @template T - The type of the data returned by the fetchCount observable.
   * @param initialTab - The initial tab identifier.
   * @param initialCount - The initial count value to display before fetching.
   * @param fragment$ - An observable emitting the current fragment or tab identifier.
   * @param getParams - A function that returns the parameters required for fetching the count.
   * @param fetchCount - A function that takes the parameters and returns an observable emitting the count data.
   * @param extractCount - A function that extracts the numeric count from the fetched data.
   * @param formatFn - (Optional) A function to format the count as a string. Defaults to a simple string conversion.
   * @returns An observable that emits the formatted count string whenever the fragment or parameters change.
   */
  public createCountStream<T>(
    initialTab: string,
    initialCount: number,
    fragment$: Observable<string>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getParams: () => any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchCount: (params: any) => Observable<T>,
    extractCount: (data: T) => number,
    formatFn: (count: number) => string = (c) => `${c}`,
  ): Observable<string> {
    return this.createConditionalStream<T, string>(
      initialTab,
      fragment$,
      formatFn(initialCount),
      () => getParams(),
      fetchCount,
      (data) => formatFn(extractCount(data)),
    );
  }

  /**
   * Handles the tab switch by updating the active tab and triggering a router fragment update.
   *
   * @param fragment - The identifier of the tab to activate.
   */
  public handleTabSwitch(fragment: string): void {
    this.activeTab = fragment;
    this.router.navigate([], {
      relativeTo: this.activatedRoute.parent,
      fragment,
    });
  }

  /**
   * Formats a count value, capping it at a specified maximum.
   *
   * If the count exceeds the cap, returns a string in the format "{cap}+".
   * Otherwise, returns the count as a string.
   *
   * @param count - The number to format.
   * @param cap - The maximum value to display before capping.
   * @returns A string representing the count, capped if necessary.
   */
  public formatCountWithCap(count: number, cap: number): string {
    return count > cap ? `${cap}+` : `${count}`;
  }
}
