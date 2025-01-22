import { GlobalStore } from './global.store';
import { SESSION_USER_STATE_MOCK } from '@services/session-service/mocks/session-user-state.mock';
import { LAUNCH_DARKLY_CHANGE_FLAGS_MOCK } from '@services/launch-darkly/mocks/launch-darkly-change-flags.mock';
import { LAUNCH_DARKLY_FLAGS_MOCK } from '@services/launch-darkly/mocks/launch-darkly-flags.mock';
import { SESSION_TOKEN_EXPIRY_MOCK } from '@services/session-service/mocks/session-token-expiry.mock';
import { TestBed } from '@angular/core/testing';

describe('GlobalStore', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let store: any;

  beforeEach(() => {
    store = TestBed.inject(GlobalStore);
  });

  it('should initialise with the default state', () => {
    expect(store.authenticated()).toBeFalse();
    expect(store.error()).toEqual({ error: false, message: '' });
    expect(store.featureFlags()).toEqual({});
    expect(store.userState()).toEqual({});
    expect(store.ssoEnabled()).toBeFalse();
    expect(store.launchDarklyConfig()).toEqual({});
    expect(store.tokenExpiry()).toEqual({});
  });

  it('should update authenticated state', () => {
    store.setAuthenticated(true);
    expect(store.authenticated()).toBeTrue();
  });

  it('should update error state', () => {
    const errorState = { error: true, message: 'Test Error' };
    store.setError(errorState);
    expect(store.error()).toEqual(errorState);
  });

  it('should update feature flags', () => {
    const featureFlags = LAUNCH_DARKLY_CHANGE_FLAGS_MOCK;
    store.setFeatureFlags(featureFlags);
    expect(store.featureFlags()).toEqual(featureFlags);
  });

  it('should update user state', () => {
    const userState = SESSION_USER_STATE_MOCK;
    store.setUserState(userState);
    expect(store.userState()).toEqual(userState);
  });

  it('should update SSO enabled state', () => {
    store.setSsoEnabled(true);
    expect(store.ssoEnabled()).toBeTrue();
  });

  it('should update LaunchDarkly config', () => {
    const config = LAUNCH_DARKLY_FLAGS_MOCK;
    store.setLaunchDarklyConfig(config);
    expect(store.launchDarklyConfig()).toEqual(config);
  });

  it('should update token expiry', () => {
    const tokenExpiry = SESSION_TOKEN_EXPIRY_MOCK;
    store.setTokenExpiry(tokenExpiry);
    expect(store.tokenExpiry()).toEqual(tokenExpiry);
  });
});
