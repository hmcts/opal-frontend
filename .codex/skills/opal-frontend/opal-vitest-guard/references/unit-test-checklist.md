# Unit Test Checklist

## Before writing the assertion

- Arrange final inputs, spies, selectors, and mock store values first.
- Do not call `fixture.detectChanges()` in shared setup unless every test truly needs the same rendered DOM.
- Decide whether the test is synchronous, promise-based, or timer-based.

## When a test fails

- If the suite does not load, fix imports or config first.
- If Angular throws `ExpressionChangedAfterItHasBeenCheckedError`, move state setup before the first render.
- If a DOM query fails, verify the component was rendered before querying.
- If logs are noisy but all tests pass, treat the logs separately from pass/fail status.

## Safe default

```ts
beforeEach(async () => {
  await TestBed.configureTestingModule({ imports: [MyComponent] }).compileComponents();
  fixture = TestBed.createComponent(MyComponent);
  component = fixture.componentInstance;
  // arrange defaults only
});

it('renders expected state', () => {
  // arrange final state
  fixture.detectChanges();
  // assert
});
```
