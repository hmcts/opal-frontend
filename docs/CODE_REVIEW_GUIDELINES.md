# Code Review Guidelines

This document defines the OPAL-specific interpretation and exceptions to apply when reviewing changes in
`opal-frontend`. Use it with the implementation standards in `docs/REPO_GUIDELINES.md` and the repository's
configured review tooling.

## Review objective

- Review the changed code and the behaviour affected by it.
- Report a finding only when the change introduces a concrete correctness, security, accessibility, operational, or
  delivery risk.
- Anchor findings to the smallest relevant changed line range and explain the triggering scenario, impact, and a
  practical correction.
- Do not report pre-existing issues unless the change makes them materially worse.
- Do not report formatting, lint, naming, or stylistic preferences that deterministic checks can enforce.
- Do not treat a preferred implementation pattern as a defect without explaining the resulting failure or risk.
- Check architectural conformance as described below, and distinguish conformance gaps from defect findings.

## Severity

- **P0 — critical:** The change could cause widespread or irreversible harm, expose sensitive data, or critically
  compromise the service. It must block merge.
- **P1 — high:** The change can break a supported journey, compromise security or accessibility, corrupt state, or
  prevent safe deployment. It should block merge.
- **P2 — medium:** The change introduces a reproducible defect or material regression with limited impact. It should
  normally be resolved before merge.
- Do not create a finding for optional improvements. Record them separately only when the review request asks for
  advisory feedback.

Severity reflects impact, not the category of the repository rule involved.

## OPAL-specific review checks

### Architecture and conformance

- Compare the final implementation with user requirements, the agreed design, and the established-pattern guidance in
  [REPO_GUIDELINES.md](REPO_GUIDELINES.md#established-patterns-and-shared-capabilities). Use comparable maintained code
  in this repository and installed shared-library contracts as the default references.
- Check that applicable shared components, base classes, utilities, and public types are reused and their supported
  contracts and states are preserved. Check custom state, orchestration, and error handling for duplicated behaviour.
- Verify that material deviations from the agreed patterns have a concrete requirement or technical justification.
  Check that the recorded design or plan reflects the final decisions.
- Check plans against user requirements and repository standards. Identify unresolved contradictions even when the
  implementation follows the plan.
- Record a material conformance gap separately when no concrete defect is established, stating the expected pattern,
  the deviation, and the missing justification. Apply the existing finding and severity rules when there is a concrete
  correctness, security, accessibility, operational, or delivery risk.

### Angular, RxJS, and state

- Flag observable composition only when it can cause stale state, duplicate requests, ordering races, leaked
  subscriptions, repeated side effects, or navigation based on incomplete data.
- Check that state derived from a selected record or route parameter is cleared when that source becomes absent or
  changes.
- Check that form submission cannot be processed more than intended and that request concurrency matches the user
  journey.
- Check new routed journeys hide primary navigation at their parent route and on initial direct or refreshed child
  URLs. Report repeated child metadata or initial-render navigation exposure when it can make a journey page appear as
  dashboard navigation.
- Check nested subscriptions, dependent requests started from `tap()`, and other imperative observable side effects
  when they can cause incomplete navigation state, unhandled failures, duplicate requests, or ordering races.
- Check that imperative subscriptions, timers, event listeners, and retained resources are released with their owner.
- Flag expensive template expressions or change-detection work only when the changed rendering path can create a
  material performance or stability problem.
- Check response caching for defined freshness and invalidation behaviour and for correct user or session isolation.
- Check changed SSR paths for unguarded browser globals or browser-only APIs.

### Security and privacy

- Flag secrets, credentials, tokens, or PII introduced in code, logs, comments, screenshots, fixtures, or tests.
- Examine changed HTML, URL, and style injection sinks, including `bypassSecurityTrust*`, `[innerHTML]`, `[srcdoc]`,
  unsafe URLs, and dynamic styles. Report them when input is insufficiently constrained, sanitised, justified, or
  tested.
- Check for weakened authentication, authorisation, route guards, security headers, or exposure of internal API data.

### Accessibility and design system

- Report changed interactions that are not keyboard operable, lose visible focus, or use non-semantic controls without
  equivalent semantics.
- Report controls without an accessible name, validation errors that are not associated with their controls, and
  state changes that are not understandable to assistive-technology users.
- Check routed pages use the application shell's single `govuk-grid-row` in `app.component.html`, with column wrappers
  for their content. Flag additional rows when their margins misalign the page with the shell. Check placeholders
  retain the intended column width of the completed or approved adjacent journey page.
- Do not require `opal-lib-govuk-button` inside a `govuk-button-group` containing one primary action and
  `opal-lib-govuk-cancel-link` when its host element breaks GOV.UK flex alignment. Check that the native-button fallback
  retains GOV.UK classes, semantic button type, accessible text, stable ID, and appropriate spacing.
- Report deviations from an established GOV.UK or HMCTS pattern when they create inconsistent behaviour,
  accessibility problems, or a demonstrable user-experience regression.

### Testing and delivery

- Apply the [component](CYPRESS_COMPONENT_TESTING.md) and [E2E](CYPRESS_E2E_TESTING.md) guides to changed tests and their
  helpers. Trace setup through the assertion: a default-state test must fail if production selects the wrong default,
  and a save/transition test must distinguish the resulting state from its seed.
- Check that E2E outcomes are explicit and that extracting actions, fixtures, or intercepts preserves every caller's
  assertions, request contracts, and live/controlled boundaries, including accessibility callers.
- For moved or consolidated tests, check before/after identities and assertion-level coverage, not just test counts.
  Treat lost coverage or setup that masks a regression as a concrete testing risk; keep reuse or speed preferences
  advisory unless a demonstrable defect or delivery impact exists.
- Check [test-maintenance evidence](CONTRIBUTING.md#test-maintenance-evidence), including complete worker results and
  disclosure of failed attempts. Do not infer that a parallel failure is fixed from a serial pass.
- Report missing tests when changed behaviour is regression-prone and the existing suite would not detect a likely
  failure. State the behaviour or scenario that needs coverage.
- Treat confirmed Sonar **Coverage on New Code** below the configured 80% Quality Gate as a delivery finding.
- Do not report coverage between 80% and 100% as a defect by itself. Check the uncovered code and report a finding when
  regression-prone behaviour is not adequately tested; otherwise ensure the PR identifies the affected behaviour,
  risk, and reason for the gap.
- Report a new or expanded coverage exclusion when it is broader than necessary, lacks a technical justification, or
  removes code from measurement without suitable alternative verification.
- Check loading, error, empty, validation, and retry behaviour when the change can reach those states.
- Treat failing required checks, TypeScript errors, and production-build failures introduced by the change as
  findings. Do not infer that a check passed without evidence.

### Reused feature-file steps

For added or modified steps, apply [Reusing feature-file steps](CYPRESS_E2E_TESTING.md#reusing-feature-file-steps).
Check for overlapping expressions across the loaded registry (Given/When/Then share matching), unconstrained or
unvalidated parameter values/DataTable columns, and callers left behind when a phrase is removed. Require unchanged
scenario names, tags, Examples rows and Zephyr identities, with before/after selection and actual affected browser
results. A duplicate-scenario scan alone does not prove that bindings are unambiguous.

Check that reuse preserves independent scenario setup, live versus controlled data, keyboard/focus behaviour and
observable assertions, including confirmation, retained state and no-write boundaries. A generic heading assertion
must not replace a richer business check. Discovery passing does not prove browser behaviour or live prerequisites.
Treat reuse preferences as advisory unless there is a concrete defect or coverage loss; do not require an unrelated
suite rewrite. Component specs continue to use their direct script/helper style.

## Acceptable exceptions

Do not report the following by themselves:

- Existing Angular modules or legacy template control flow outside the changed implementation.
- An imperative subscription that has a clear lifecycle, cleanup, and ordering model.
- A justified and tested HTML, URL, or style injection mechanism with constrained or sanitised input.
- An established integration that requires a non-preferred Angular pattern.
- A missing test for a mechanical or documentation-only change with no meaningful behavioural regression risk.
- A maintainability preference such as component size, `OnPush`, file suffixes, or container/presentational separation
  without a concrete defect.

## Review output

Order findings by severity. For each finding, include:

- the severity and a concise title;
- the affected file and smallest useful changed line range;
- the concrete triggering scenario;
- the impact; and
- a practical fix or safe alternative.

If no qualifying findings exist, say so explicitly. Keep unverified assumptions and checks that were not run separate
from findings.

Include material architectural conformance gaps in a separate part of the review output. Keep optional preferences
subject to the advisory-feedback rule above.
