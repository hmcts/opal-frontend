---
name: opal-vitest-guard
description: Review, write, or fix unit tests in TypeScript repos that use Vitest, Angular TestBed, and component-driven rendering. Use this when adding tests, debugging flaky or failing tests, preventing ExpressionChangedAfterItHasBeenCheckedError, improving beforeEach setup, or standardizing safe render patterns. Do not use for end-to-end tests, backend integration tests, or broad refactors unrelated to test behavior.
---

# OPAL Vitest Guard

Use this skill when working on unit tests in frontend TypeScript repositories, especially Angular + Vitest setups. Favor small, deterministic fixes that preserve product behavior while making tests reliable.

## Goals

1. Prevent common unit-test regressions before they are introduced.
2. Diagnose failures by separating test-harness problems from real product bugs.
3. Standardize safe render/setup patterns for Angular component tests.
4. Keep tests readable, local, and minimally coupled to framework timing.

## Default stance

- Treat the test runner as correct unless there is strong evidence otherwise.
- Prefer fixing the test setup order before changing component production code.
- Prefer one explicit render point per test.
- Prefer state arrangement before the first render.
- Prefer the smallest change that makes intent clearer.
- Do not mask real bugs with excessive `tick()`, duplicate `detectChanges()`, or broad async wrappers.

## Triage workflow

Follow this order every time:

### 1) Classify the failure

Put the failure into one of these buckets:

- **Suite load / module resolution**
  - Examples: cannot resolve import, transform failed, missing file, bad alias.
  - Action: fix pathing, alias config, or moved file references before touching assertions.

- **Framework lifecycle / render timing**
  - Examples: `ExpressionChangedAfterItHasBeenCheckedError`, DOM not updated yet, child component missing because nothing rendered.
  - Action: inspect render order, `beforeEach`, input assignment timing, selectors/signals/spies, and async stabilization.

- **Real assertion / product logic failure**
  - Examples: wrong text, wrong emitted event, wrong state transition.
  - Action: verify expected behavior, then fix either the test expectation or the component logic.

### 2) Inspect shared setup first

Look at `beforeEach` before editing individual tests.

Red flags:

- `fixture.detectChanges()` in shared setup
- mutating `@Input()`-like properties after shared render
- spies returning one value in `beforeEach` and a different value inside a test after render
- store/signal values updated after component creation
- timer setup in `ngOnInit()` combined with first render in the same test

### 3) Render once, after arrangement

Default pattern:

```ts
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MyComponent],
  }).compileComponents();

  fixture = TestBed.createComponent(MyComponent);
  component = fixture.componentInstance;

  // Set defaults only. No detectChanges here.
  component.someInput = false;
  vi.spyOn(store, 'flag').mockReturnValue(false);
});

it('renders state X', () => {
  component.someInput = true;
  vi.spyOn(store, 'flag').mockReturnValue(true);

  fixture.detectChanges();

  expect(...).toBe(...);
});
```

Only deviate when the test is explicitly about multiple renders or reactive updates over time.

## Angular-specific guardrails

### Prevent `ExpressionChangedAfterItHasBeenCheckedError`

When this error appears, check for a value that changes between the initial check and the next check.

Common causes:

- shared `fixture.detectChanges()` in `beforeEach`
- flipping a template-bound field after initial render
- changing spy returns after the component already read them
- store/signal selectors emitting after the component was created when the test intended initial state
- invoking lifecycle methods manually in addition to `detectChanges()`

Preferred fixes:

1. Remove shared `fixture.detectChanges()` from `beforeEach`.
2. Arrange final test state before first render.
3. Create the fixture after mocks are ready if the component reads dependencies during construction/init.
4. Use a single, explicit async strategy per test.
5. If the test only cares about rendered state, assert state directly instead of recreating the full timing path.

### Safe patterns

**Inputs first, render second**

```ts
component.hasPermission = true;
fixture.detectChanges();
```

**Spy first, render second**

```ts
vi.spyOn(component.accountStore, 'successMessage').mockReturnValue('Saved');
fixture.detectChanges();
```

**Render child before querying it**

```ts
fixture.detectChanges();
const banner = fixture.debugElement.query(By.directive(BannerComponent));
```

### Avoid these patterns

```ts
fixture.detectChanges();
component.hasPermission = true;
fixture.detectChanges();
```

```ts
fixture.detectChanges();
vi.spyOn(store, 'flag').mockReturnValue(true);
fixture.detectChanges();
```

```ts
component.ngOnInit();
fixture.detectChanges();
```

Only call lifecycle hooks manually when the test specifically targets that hook and you are not also relying on the normal render path in a conflicting way.

## Async and timers

Use only one timing model per test where possible:

- `await fixture.whenStable()` for promise-driven stabilization
- `fakeAsync` + `tick()` for Angular fake timers
- `vi.useFakeTimers()` + timer advancement for Vitest timer-driven code

Do not stack multiple timing models unless necessary and understood.

Checklist:

- Did the component schedule work in `ngOnInit`, `ngAfterViewInit`, or an effect?
- Did the test render before the mocked async value was ready?
- Is the test asserting DOM before stabilization?
- Can the test assert state or emitted output instead of a full timer loop?

## Module-resolution guardrails

When tests fail to load:

1. Verify the imported file still exists.
2. Verify relative path depth from the importing file.
3. Check whether the repo relies on TS path aliases.
4. Ensure Vitest/Vite resolves the same aliases as TypeScript.
5. Fix the import/config issue before editing test assertions.

Never diagnose a suite-load error as a UI problem in the test explorer until the terminal runner is green.

## Review checklist for new or changed tests

Before finalizing a patch, check all of these:

- The test passes from the terminal runner.
- Shared setup does not render unless every test needs the exact same initial DOM.
- Template-bound values are not flipped after first render unless intentionally testing reactivity.
- Spies/selectors/mocks are in their final state before render.
- DOM queries happen after render.
- Async strategy is consistent and minimal.
- Console noise is not mistaken for a failing assertion.
- The test name describes behavior, not implementation details.
- Assertions are specific enough to catch regressions.
- Production code was not weakened just to satisfy the test.

## Output expectations

When using this skill, produce:

1. A short diagnosis of the failure bucket.
2. The smallest safe patch.
3. A brief explanation of why the original pattern failed.
4. A prevention note the team can reuse.

## Preferred remediation language

Use wording like:

- "Render after arranging final state."
- "Remove shared detectChanges from beforeEach."
- "This is a real assertion failure, not a Vitest Explorer failure."
- "The suite is failing to load, so fix module resolution first."
- "This test only needs the final rendered state; it does not need the full init/timer lifecycle."

## When not to apply this skill

Do not use this skill for:

- Cypress/Playwright end-to-end tests
- API integration tests
- broad test rewrites without a concrete failure or standardization goal
- changes whose main purpose is snapshot churn or stylistic renaming

## Reference files

See `references/unit-test-checklist.md` for a compact checklist teams can keep nearby.
