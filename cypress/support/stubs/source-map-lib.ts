// cypress/support/stubs/source-map-lib.ts

/**
 * Minimal stub for any direct `source-map` usage that might be pulled in.
 * Everything is a no-op; we just need the module to exist so webpack
 * doesn't blow up trying to resolve it.
 */

export class SourceMapConsumer {
  constructor(..._args: unknown[]) {
    // no-op
  }
}

export const parse = (..._args: unknown[]) => undefined;
export const generate = (..._args: unknown[]) => undefined;
