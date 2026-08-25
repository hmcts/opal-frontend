import { TestBed } from '@angular/core/testing';
import { ROUTER_CONFIGURATION } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppInitializerService } from '@hmcts/opal-frontend-common/services/app-initializer-service';
import { appConfig } from './app.config';

type ProviderRecord = {
  provide?: {
    toString?: () => string;
  };
  useFactory?: () => unknown;
  ɵproviders?: unknown;
};

const findProvider = (value: unknown, matcher: (provider: ProviderRecord) => boolean): ProviderRecord | null => {
  if (Array.isArray(value)) {
    for (const item of value) {
      const match = findProvider(item, matcher);
      if (match) {
        return match;
      }
    }
    return null;
  }

  if (!value || typeof value !== 'object') {
    return null;
  }

  const provider = value as ProviderRecord;
  if (matcher(provider)) {
    return provider;
  }

  if ('ɵproviders' in provider) {
    return findProvider(provider.ɵproviders, matcher);
  }

  return null;
};

describe('appConfig', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    TestBed.configureTestingModule({
      providers: [
        ...appConfig.providers,
        {
          provide: AppInitializerService,
          useValue: {
            initializeApp: vi.fn(),
          },
        },
      ],
    });
  });

  it('should configure router scrolling to reset new navigations to the top', () => {
    const routerScrollerProvider = findProvider(appConfig.providers, (provider) => {
      const providerLabel = provider.provide?.toString?.() ?? '';
      return providerLabel.includes('Router Scroller');
    });

    if (!routerScrollerProvider?.useFactory) {
      throw new Error('Expected appConfig to include the Router Scroller provider.');
    }

    const routerScroller = TestBed.runInInjectionContext(
      () =>
        routerScrollerProvider.useFactory?.() as {
          options: {
            anchorScrolling: string;
            scrollPositionRestoration: string;
          };
        },
    );

    expect(routerScroller.options).toMatchObject({
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'top',
    });
  });

  it('should preserve the router config used by the app shell', () => {
    const routerConfiguration = TestBed.inject(ROUTER_CONFIGURATION);

    expect(routerConfiguration).toMatchObject({
      canceledNavigationResolution: 'computed',
    });
  });
});
