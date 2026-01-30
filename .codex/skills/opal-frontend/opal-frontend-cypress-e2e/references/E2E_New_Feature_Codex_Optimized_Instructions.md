# E2E Feature Creation – Codex Optimized Instructions (New Features)

This document defines **how to design, write, and implement brand-new E2E feature files** using the existing Cypress framework, patterns, and constraints.

It is intended for **Codex / GPT-assisted feature creation**, driven by **Acceptance Criteria (ACs) and Jira ticket details** provided by the tester.

---

## 1. Scope & Principles

### New Feature Creation and Updates

- These instructions apply to **brand-new features** and **updates to existing features/scenarios**.
- The tester **must provide**:
  - Jira ticket reference
  - Acceptance Criteria
  - Any relevant business rules or edge cases

### Behaviour Safety

- Do not invent business logic.
- Do not infer rules beyond the provided ACs.
- If behaviour is unclear → **ask the human** before proceeding.

---

## 2. Acceptance Criteria → Scenarios Mapping

### Mandatory AC Breakdown

Each Acceptance Criterion MUST map to:

- **One scenario**, or
- **Multiple scenarios** if it contains more than one behaviour

If an AC describes more than one behaviour, **split it**.

### Distinct Behaviours (Always Separate)

- Create vs Edit vs Review journeys
- Different task/state transitions
- Cancel vs Confirm branches
- Validation/error vs successful submission
- Persistence vs clearing of data
- Summary/review behaviour
- Submission/confirmation outcomes

### Coverage Mapping (Required)

For every feature, provide a mapping:

| Acceptance Criteria | Scenario(s) | Behaviour Covered |
| ------------------- | ----------- | ----------------- |

---

## 3. Scenario Design Rules

### Scenario Intent (MANDATORY)

Each scenario MUST:

- Test **one behaviour only**
- Start at the **correct entry point**
- Finish at the **natural completion point**
- Have a **clear, intent-based name**
- Stay **≤25 steps**

If a scenario grows beyond 25 steps → split it **without changing data**.

---

## 4. Gherkin Structure: Background + Rule Blocks (RECOMMENDED)

Use `Background` and `Rule` to reduce duplication **without bloating scenarios**.

### Feature-level Background (global setup)

Use for setup that applies to all scenarios in the feature, such as:

- Login
- Global cleanup/reset

Example intent:

- “Given I am logged in …”
- “And I clear all approved accounts …”

### Rule blocks (group scenarios by baseline)

Use `Rule:` to group scenarios that share a common **baseline** (data setup + entry point), e.g.:

- Adult/youth account baseline
- Company account baseline
- Non-paying defendant baseline
- Parent/guardian baseline

Each `Rule:` may have its own `Background:` to establish:

- Test data creation for that baseline
- Shared navigation to the relevant area/section
- Shared “entry point” checks needed to ensure the baseline is valid

**Why this is important:** it keeps scenarios focused on behaviour, while preventing repeated setup steps.

### Rule Background: guardrails

A Rule Background must:

- Be idempotent and safe to run for every scenario in that Rule
- Contain only baseline setup + navigation to the start point
- Avoid turning into an extra scenario (keep it minimal and stable)

✅ Good in Rule Background:

- Create the baseline data
- Open the record/details page
- Navigate to the relevant tab/section

❌ Avoid in Rule Background:

- Behaviour-specific assertions that only apply to one scenario
- Branching logic or multiple “mini-behaviours”

---

## 5. Gherkin Style & Step Design

### Imperative, Intent-Based Gherkin

- No UI verbs: _click, type, select_
- Express **what** is achieved, not **how**
- Prefer domain language over technical language

### Combining Steps Is Encouraged (Intent-Only)

We **do** want fewer, condensed steps — but the wording must remain **intent-only**.

✅ Good:

- “When I delete the account from the review page”
- “When I submit the task with valid details”

❌ Avoid:

- “When I click Delete then I am on confirmation page then I click Confirm”

**Rule:** combine actions and inherent navigation into **one intent step**.  
Keep page assertions **implicit** in Gherkin.

### Inherent Navigation & Guarding (MANDATORY)

If an action causes navigation, the Flow/Action must **guard/assert the destination page/state internally** before continuing or returning.

---

## 6. Composite Assertions & Tables

### Composite Assertions (Preferred)

When validating one outcome:

- Use **one composite step**
- Use **DataTables** instead of multiple assertions

### Review / Summary Pages

- One composite per logical section
- Do not mix capitalisation checks into summary composites

---

## 7. Steps, Flows, and Actions

### Step Definitions

- Steps must be **thin**
- Steps must call a **Flow or an Action**
- Steps must **never use selectors**
- No UI verbs in step wording

### Flows

Rules:

- Flows orchestrate **Actions only**
- Never import selectors
- Must log high-level journey intent
- If the flow triggers navigation, it must **assert/guard the destination**

### Actions

Actions must:

- Be page-level and single-responsibility
- Use selectors only from `cypress/shared/selectors/**`
- Import shared actions:

```ts
import { CommonActions } from '../common/common.actions';
```

### Shared Behaviour Placement

- Shared Actions → `../common/common.actions`
- Shared Steps → `/common.steps.ts`

### Logging

All new Flows and Actions MUST use:

```
cypress/shared/utils/log.helper
```

---

## 8. Results Pages & Pagination (MANDATORY DEFAULT)

If a page is a **set of results** (search results, lists, tables), assume **pagination exists or may exist**.

Rules:

- Result-set composites must be pagination-aware by default
- Do not assume “everything is on one page” unless AC explicitly states so
- “All results” validations must iterate pages (or use a helper that does)

---

## 9. Selectors & DOM Rules

- Never invent selectors.
- If a selector is missing → request DOM / Angular template from the human.
- Add new selectors only under `cypress/shared/selectors/**`.

---

## 10. Technical Interaction Rules

### DataTables Handling

- Always normalise with `.rowsHash()`
- Trim keys and values
- Log mapped payloads

### Hidden / Opacity Inputs

For radios or checkboxes with `opacity: 0`:

```js
should('exist');
scrollIntoView();
check({ force: true });
```

Never assert visibility.

### Navigation Rules

- No conditional navigation
- Navigation must occur at the **start** of a step (when navigation is the step’s purpose)
- If navigation happens inside a Flow/Action, it must also assert the destination

### Header Assertions

Always guard with:

```js
cy.location('pathname');
```

---

## 11. Documentation & Quality

### JSDoc (MANDATORY)

All new Flows and Actions MUST include full JSDoc:

- `@fileoverview`
- `@description`
- `@param`
- `@remarks` (if needed)
- `@example`

---

## 12. Deliverables for New Features

Each new feature MUST include:

- New feature file(s)
- New or reused step definitions
- New or reused flows/actions
- Selector additions (if required)
- Acceptance Criteria → Scenario coverage table
- Summary including: ACs covered, assumptions, open questions

---

## 13. Validation & Hygiene Checks (MANDATORY)

### Step Definition Coverage

- Every Gherkin step used in the feature file(s) MUST have a corresponding step definition.
- This includes steps inside: **Feature Backgrounds** and **Rule Backgrounds**.

### No Unused Step Definitions

- Do not leave unused step definitions in step files.
- If a step definition was created but is not used by the final feature(s), remove it or move it only if genuinely reusable.

### Consistency Checks

- Step wording remains intent-only
- Navigation guards exist inside flows/actions where navigation occurs
- Result-set validations are pagination-aware by default

---

## 14. Codex / GPT Communication Prompts

- “Please provide the Acceptance Criteria and Jira ticket details for this feature.”
- “Please provide the DOM/Angular template for `<page>` so selectors can be defined.”
- “This AC contains multiple behaviours — should I split it?”
- “This is a results page — should validation be across pagination, or first-page-only per ACs?”
