# SKILL: Migrate Karma/Jasmine unit tests to Vitest (Angular 21)

**Status:** Temporary (remove once all outstanding Karma/Jasmine PRs are merged)

## When to use this skill

Use this skill when a branch/PR (often created before the Vitest migration) still contains **Karma/Jasmine-style** unit tests and the repo now runs tests with **Vitest**.

Typical symptoms:

- `Cannot find name 'jasmine'`
- `Cannot find name 'spyOn'`
- `Property 'anything' does not exist on type 'expect'`
- `Property 'mockReturnValue' does not exist on type ...` (because something is not mocked with `vi.fn()`)
- Lint errors like `@typescript-eslint/no-unused-expressions` due to old Jasmine patterns

## Scope

- **Do:** update/convert `*.spec.ts` files to work with Vitest.
- **Do:** keep Angular TestBed patterns (components/services are still tested via Angular APIs).
- **Do not:** refactor production code unless required for correctness.
- **Do not:** silence failures by removing assertions.

## Quick checklist

1. Ensure each migrated spec imports Vitest APIs (or uses repo-approved globals).
2. Replace Jasmine spies/matchers with Vitest equivalents.
3. Replace `jasmine.createSpyObj` with a `vi.fn()`-based mock object.
4. Fix timers/async tests (`fakeAsync`/`tick` → Vitest timers where appropriate).
5. Ensure mocks are reset between tests.
6. Run `yarn test` and fix remaining TypeScript/lint issues.

---

## 1) Required Vitest imports

Prefer explicit imports per file (avoids TS/editor issues):

```ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
```

Add only what you use (e.g. `beforeAll`, `afterAll`).

### Reset/cleanup

In most files:

```ts
afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
  vi.useRealTimers();
});
```

Use `restoreAllMocks()` when you used `vi.spyOn(...)`.

---

## 2) Replace Jasmine spies with Vitest

### `spyOn`

**Before (Jasmine):**

```ts
spyOn(service, 'load').and.returnValue(of(true));
```

**After (Vitest):**

```ts
vi.spyOn(service, 'load').mockReturnValue(of(true));
```

### `and.callFake`

**Before:**

```ts
spyOn(service, 'load').and.callFake(() => of(true));
```

**After:**

```ts
vi.spyOn(service, 'load').mockImplementation(() => of(true));
```

### `and.throwError`

**Before:**

```ts
spyOn(service, 'load').and.throwError('boom');
```

**After:**

```ts
vi.spyOn(service, 'load').mockImplementation(() => {
  throw new Error('boom');
});
```

### Accessing spy call args

Vitest spies are functions, so you can inspect:

```ts
const spy = vi.spyOn(obj, 'fn');
// ...
expect(spy).toHaveBeenCalledTimes(1);
expect(spy.mock.calls[0][0]).toEqual('firstArg');
```

---

## 3) Replace `jasmine.createSpyObj`

Angular tests often used `jasmine.createSpyObj` for providers. Replace with plain objects whose methods are `vi.fn()`.

**Before (Jasmine):**

```ts
const dateServiceSpy = jasmine.createSpyObj(DateService, [
  'convertMillisecondsToMinutes',
  'calculateMinutesDifference',
  'getFromIso',
  'getDateNow',
]);

TestBed.configureTestingModule({
  providers: [{ provide: DateService, useValue: dateServiceSpy }],
});
```

**After (Vitest):**

```ts
const dateServiceSpy = {
  convertMillisecondsToMinutes: vi.fn(),
  calculateMinutesDifference: vi.fn(),
  getFromIso: vi.fn(),
  getDateNow: vi.fn(),
} satisfies Partial<DateService>;

TestBed.configureTestingModule({
  providers: [{ provide: DateService, useValue: dateServiceSpy }],
});
```

Then in tests:

```ts
dateServiceSpy.convertMillisecondsToMinutes.mockReturnValue(5);
```

> If TypeScript complains about missing methods, keep `Partial<T>` and add only what the spec calls.

---

## 4) Replace Jasmine matchers

### `jasmine.anything()` / `jasmine.any(Class)`

**Before:**

```ts
expect(fn).toHaveBeenCalledWith(jasmine.anything());
expect(fn).toHaveBeenCalledWith(jasmine.any(Date));
```

**After:**

```ts
expect(fn).toHaveBeenCalledWith(expect.anything());
expect(fn).toHaveBeenCalledWith(expect.any(Date));
```

If `expect.anything()` is not available in the local Vitest/Chai setup, use:

```ts
expect(fn.mock.calls[0][0]).toBeTruthy();
```

---

## 5) Async + timers: `fakeAsync`/`tick` migration

Prefer these patterns:

### A) Use real async (recommended)

If your code returns Promises/Observables, prefer awaiting stable states:

```ts
await fixture.whenStable();
fixture.detectChanges();
```

### B) Use Vitest fake timers

For interval/polling behavior:

```ts
vi.useFakeTimers();
// run code that schedules timers
vi.advanceTimersByTime(1000);
vi.runOnlyPendingTimers();
vi.useRealTimers();
```

Avoid mixing `fakeAsync/tick` with `vi.useFakeTimers()` in the same spec unless absolutely necessary.

---

## 6) Common TypeScript issues after migration

### "Property 'mockReturnValue' does not exist on type ..."

This happens when the function isn’t a `vi.fn()`.

Fix by ensuring your provider mock uses `vi.fn()`:

```ts
const serviceSpy = { getState: vi.fn() };
serviceSpy.getState.mockReturnValue(of(...));
```

If you’re spying on a real method, ensure you use `vi.spyOn(...)` and then call `mockReturnValue` on that returned spy.

### Event typing (strict TS)

If tests create fake events, use a real `Event`:

```ts
const event = new Event('submit');
const preventDefault = vi.fn();
Object.defineProperty(event, 'preventDefault', { value: preventDefault });
```

Or cast deliberately:

```ts
const event = { preventDefault: vi.fn() } as unknown as Event;
```

Use casts sparingly.

---

## 7) Lint fixes commonly required

### `@typescript-eslint/no-unused-expressions`

Often caused by leftover Jasmine/Chai style like:

```ts
expect(x).to.be.true;
```

Convert to:

```ts
expect(x).toBe(true);
```

### `no-explicit-any`

Prefer `unknown` + narrowing, or `Partial<T>` mocks. Only use `any` when interacting with private members.

---

## 8) Workflow for Codex: what to do per PR merge

When a PR from a feature branch introduces Jasmine tests:

1. Identify changed/added `*.spec.ts` files in the merge.
2. For each failing spec:
   - Add Vitest imports
   - Replace `jasmine.*`, `spyOn`, and Jasmine matchers
   - Replace provider mocks with `vi.fn()` objects
3. Run `yarn test` until green.
4. Keep changes minimal and localized to tests.

---

## 9) Command hints

Useful commands while migrating:

```bash
# find remaining Jasmine references
rg -n "\\bjasmine\\b|\\bspyOn\\(" .

# find specs missing vitest import (heuristic)
rg -n "describe\\(|it\\(" projects src | rg "\\.spec\\.ts" -n

# run tests
yarn test
```

> Adjust paths if the repo structure differs.

---

## Definition of Done

- `yarn test` passes
- No references remain to `jasmine.*` or Karma-only APIs in migrated specs
- No broad/global config hacks added just to make tests pass
- Mocks are properly reset between tests

---

## Notes

- This skill is intended to keep the repo healthy while outstanding pre-migration work is merged.
- Once all branches/PRs are updated, delete this skill folder:
  `.codex/skills/opal-frontend/opal-frontend-migrate-karma-jasmine-tests/`
