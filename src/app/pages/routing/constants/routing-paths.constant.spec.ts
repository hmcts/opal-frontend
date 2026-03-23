import { describe, expect, it } from 'vitest';
import { PAGES_ROUTING_PATHS } from './routing-paths.constant';

describe('PAGES_ROUTING_PATHS', () => {
  it('should set the default dashboard landing path to /fines/dashboard', () => {
    expect(PAGES_ROUTING_PATHS.children.dashboard).toBe('/fines/dashboard');
  });
});
