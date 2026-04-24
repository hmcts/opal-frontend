import { mount } from 'cypress/angular';
import { provideHttpClient } from '@angular/common/http';
import { EnvironmentProviders, Provider } from '@angular/core';
import { ActivatedRoute, NavigationExtras, provideRouter, Route, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FinesSaSearchAccountComponent } from 'src/app/flows/fines/fines-sa/fines-sa-search/fines-sa-search-account/fines-sa-search-account.component';
import { IFinesSaSearchAccountState } from 'src/app/flows/fines/fines-sa/fines-sa-search/fines-sa-search-account/interfaces/fines-sa-search-account-state.interface';
import { FinesSaSearchAccountTab } from 'src/app/flows/fines/fines-sa/fines-sa-search/fines-sa-search-account/types/fines-sa-search-account-tab.type';
import { FinesSaStore } from 'src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';

/**
 * Search-and-matches-specific mount helper.
 *
 * This lives next to the `searchAndMatches` specs on purpose: it encodes the
 * route fragment, resolver, store, and router behaviour that those specs share.
 * It is not a generic Cypress helper for the wider component suite.
 */
type SearchAccountResultsResolvers = NonNullable<Route['resolve']>;

interface IMountSearchAccountOptions {
  /** Tab that should be active when the component is mounted. */
  activeTab: FinesSaSearchAccountTab;
  /** Optional component input overrides for the mounted shell. */
  componentProperties?: Record<string, unknown>;
  /** Initial fragment value to expose through `ActivatedRoute.fragment`. */
  fragment?: FinesSaSearchAccountTab | null;
  /** Reusable fragment stream for specs that need to simulate tab changes. */
  fragment$?: BehaviorSubject<string | null>;
  /** Fresh search-account store state for this test only. */
  initialState: IFinesSaSearchAccountState;
  /** Resolver map for the `/results` route when using the real router path. */
  resultsResolvers?: SearchAccountResultsResolvers;
  /** Extra resolver snapshot data needed by a specific tab, for example major creditors. */
  routeSnapshotData?: Record<string, unknown>;
  /** Use a spy router instead of `provideRouter()` when the spec wants to assert navigation calls. */
  useSpyRouter?: boolean;
}

/**
 * Build the minimal `ActivatedRoute` shape used by the search-account shell and child form.
 * The fragment observable drives tab selection and the snapshot data seeds resolver-backed ref data.
 */
const buildActivatedRouteValue = (
  fragment$: BehaviorSubject<string | null>,
  routeSnapshotData: Record<string, unknown>,
) => ({
  fragment: fragment$.asObservable(),
  snapshot: {
    data: routeSnapshotData,
    parent: {
      snapshot: {
        url: [{ path: 'search' }],
      },
    },
  },
  parent: {
    snapshot: {
      url: [{ path: 'search' }],
    },
  },
});

/**
 * Lightweight router stub for specs that care about navigation side effects rather than real routing.
 * We mirror fragment updates back into the shared `fragment$` stream so tab-switching assertions still work.
 */
const buildSpyRouter = (fragment$: BehaviorSubject<string | null>): Router =>
  ({
    navigate: cy
      .spy((commands: unknown[], extras?: NavigationExtras) => {
        if (extras?.fragment !== undefined) {
          fragment$.next(extras.fragment ?? null);
        }

        return Promise.resolve(true);
      })
      .as('routerNavigate'),
    createUrlTree: cy.spy((commands: unknown[]) => commands).as('urlTree'),
    serializeUrl: cy
      .spy((urlTree: unknown) => (Array.isArray(urlTree) ? urlTree.join('/') : String(urlTree)))
      .as('serializeUrl'),
    navigateByUrl: cy.spy(() => Promise.resolve(true)).as('navigateByUrl'),
  }) as unknown as Router;

/**
 * Mount the search-account shell with fresh per-test state.
 *
 * Key behaviours:
 * - clones `initialState` so tests cannot leak state into one another
 * - seeds the `FinesSaStore` with that cloned state and the requested active tab
 * - provides either a real router or a spy router, depending on what the spec needs to assert
 * - always exposes the same `ActivatedRoute` contract the component expects in production
 */
export const mountSearchAccount = ({
  activeTab,
  componentProperties = {},
  fragment = activeTab,
  fragment$,
  initialState,
  resultsResolvers = {},
  routeSnapshotData = {},
  useSpyRouter = false,
}: IMountSearchAccountOptions) => {
  // Reuse the supplied fragment stream when a test needs to push tab changes itself.
  const currentFragment$ = fragment$ ?? new BehaviorSubject<string | null>(fragment);

  // Each mount gets its own store payload, even if the caller reuses a shared mock constant.
  const searchState = structuredClone(initialState);

  // Business units are common to all search tabs, so we seed them by default and let callers extend.
  const activatedRoute = buildActivatedRouteValue(currentFragment$, {
    businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
    ...routeSnapshotData,
  });

  const providers: Array<Provider | EnvironmentProviders> = [
    provideHttpClient(),
    OpalFines,
    {
      provide: FinesSaStore,
      useFactory: () => {
        const store = new FinesSaStore();
        store.setSearchAccount(searchState);
        store.setActiveTab(activeTab);

        return store;
      },
    },
    {
      provide: ActivatedRoute,
      useValue: activatedRoute,
    },
  ];

  if (useSpyRouter) {
    // Major-creditor tests assert navigation/window-open behaviour, so they do not need a real router tree.
    providers.unshift({
      provide: Router,
      useValue: buildSpyRouter(currentFragment$),
    });
  } else {
    // Most tabs are simpler with a real router so their `/results` resolver wiring matches production.
    providers.unshift(
      provideRouter([
        {
          path: 'fines/search-accounts/results',
          component: FinesSaSearchAccountComponent,
          resolve: resultsResolvers,
          runGuardsAndResolvers: 'always',
        },
        {
          path: 'fines/search-accounts',
          component: FinesSaSearchAccountComponent,
        },
      ]),
    );
  }

  return mount(FinesSaSearchAccountComponent, {
    providers,
    componentProperties,
  });
};
