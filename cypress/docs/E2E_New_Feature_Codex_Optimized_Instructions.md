# E2E Feature Creation – Codex Optimized Instructions (New Features)

This document defines **how to design, write, and implement brand-new E2E feature files** using the existing Cypress framework, patterns, and constraints.

It is intended for **Codex / GPT-assisted feature creation**, driven by **Acceptance Criteria (ACs) and Jira ticket details** provided by the tester.

---

## 1. Scope & Principles

### New Feature Creation Only
- These instructions apply **only to brand-new features**.
- No legacy feature refactoring is implied or required.
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
- **Multiple scenarios** if the AC contains more than one behaviour

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
|---------------------|-------------|-------------------|

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

### Naming Conventions
Use intent-based language:

✅ *Submit task successfully with valid data*  
❌ *User fills in form and clicks submit*

---

## 4. Gherkin Style & Structure

### Imperative, Intent-Based Gherkin
- No UI verbs: *click, type, select*
- Express **what** is achieved, not **how**
- Prefer domain language over technical language

### Combining Steps Is Encouraged (Intent-Only)
We **do** want fewer, condensed steps in scenarios — but the step wording must remain **intent-only**.

✅ Good (combined intent, no UI/page mechanics):
- *When I delete the account from the review page*
- *When I remove the defendant and confirm the deletion*
- *When I submit the task with valid details*

❌ Avoid (spelling out mechanics / chained clauses):
- *When I click Delete then I am on Delete confirmation and I click Confirm*
- *When I select X then I am on Y page then I do Z*

**Rule:** combine actions and inherent navigation into **one intent step**, and keep page assertions **implicit** in the Gherkin.

### Inherent Navigation & Guarding (MANDATORY)
If an action causes navigation, the Flow/Action must **guard/assert the destination page/state internally** before continuing or returning.

This prevents repeated “Then I am on the {page} page” steps and keeps scenarios intent-focused.

Example Flow concept:
- `deleteFromReviewAndAssertConfirmation()`
  - logs intent
  - performs navigation action
  - asserts/guards the resulting page/state

### DataTables
- Preserve all values exactly as provided by the tester.
- Layout may change; values must not.

---

## 5. Composite Assertions & Tables

### Composite Assertions (Preferred)
When validating one outcome:
- Use **one composite step**
- Use **DataTables** instead of multiple assertions

**Example:**
```gherkin
Then the task summary shows:
  | Field        | Value    |
  | Status       | Complete |
  | Submitted by | User     |
```

### Review / Summary Pages
- One composite per logical section
- Do not mix capitalisation checks into summary composites

---

## 6. Steps, Flows, and Actions

### Step Definitions
- Steps must be **thin**
- Steps must call a **Flow or an Action**
- Steps must **never use selectors**
- No UI verbs in step wording

If no suitable step exists:
- Create a **new thin composite step**
- Delegate immediately to a Flow or Action

---

### Flows
Use a Flow when:
- A step requires multiple UI interactions
- A user journey spans multiple pages or actions

Rules:
- Flows orchestrate **Actions only**
- Never import selectors
- Must log high-level journey intent
- **Navigation is inherent:** if the flow triggers navigation, it must **assert/guard the destination** before proceeding (and before returning).

---

### Actions
Actions must:
- Be page-level and single-responsibility
- Use selectors only from:
  - `cypress/shared/selectors/**`
- Import shared actions:

```ts
import { CommonActions } from '../common/common.actions';
```

---

### Shared Behaviour Placement
- Shared Actions → `../common/common.actions`
- Shared Steps → `newStyleSteps/common.steps.ts`

---

### Logging
All new Flows and Actions MUST use:
```
cypress/shared/utils/log.helper
```

---

## 7. Results Pages & Pagination (MANDATORY DEFAULT)

If a page is a **set of results** (search results, lists, tables, summaries that can grow), assume **pagination exists or may exist**.

Rules:
- Steps/composites for result sets must be **pagination-aware by default**.
- Do not assume “everything is on one page” unless the AC explicitly states so.
- If validating “all results”, the implementation must iterate pages (or use a framework helper that does) until completion.
- If validating “a specific item exists”, the step must:
  - search across pages **or**
  - include explicit scoping (e.g., “on the first page of results”) only when required by ACs.

Preferred step intent patterns:
- “Then I see the following results exist:” (implementation searches across pages)
- “Then all results have:” (implementation validates across pages)
- “Then the first page of results shows:” (only when ACs require first-page scoping)

---

## 8. Selectors & DOM Rules
- Never invent selectors.
- If a selector is missing → request DOM / Angular template from the human.
- Add new selectors only under:
  - `cypress/shared/selectors/**`
- Selector names must be descriptive and stable.

---

## 9. Technical Interaction Rules

### DataTables Handling
- Always normalise with `.rowsHash()`
- Trim keys and values
- Log mapped payloads

### Hidden / Opacity Inputs
For radios or checkboxes with `opacity: 0`:
```js
should('exist')
scrollIntoView()
check({ force: true })
```
Never assert visibility.

### Typing & Field Input
- Scroll into view
- `clear()`
- `type({ force: true })`
- Assert value

### Navigation Rules
- No conditional navigation
- Navigation must occur at the **start** of a step (when navigation is the step’s purpose)
- Prefer shared navigation flows/helpers
- **If navigation happens inside a Flow/Action, it must also assert the destination page/state** (do not rely on a separate “Then I am on page” step).

### Header Assertions
Always guard with:
```js
cy.location('pathname')
```

---

## 10. Documentation & Quality

### JSDoc (MANDATORY)
All new Flows and Actions MUST include full JSDoc:
- `@fileoverview`
- `@description`
- `@param`
- `@remarks` (if needed)
- `@example`

All private methods must be documented.

---

### Code Quality
- No duplicated logic
- Clear naming
- Single-responsibility methods
- Minimal inline comments (logic-only)

---

## 11. Deliverables for New Features
Each new feature MUST include:
- New feature file(s)
- New or reused step definitions
- New or reused flows/actions
- Selector additions (if required)
- Acceptance Criteria → Scenario coverage table
- Summary including:
  - Feature implemented
  - ACs covered
  - Any assumptions made
  - Any open questions



---

## 13. Validation & Hygiene Checks (MANDATORY)

Before considering the feature complete, run the following checks:

### Step Definition Coverage
- Every Gherkin step used in the feature file(s) MUST have a corresponding step definition.
- Do not leave “new” steps in the `.feature` file that were not wired up to definitions (common when files aren’t refreshed).
- If a step text is changed, ensure the `.feature` file and step definition stay in sync.

### No Unused Step Definitions
- Do not leave unused step definitions in step files.
- If a step definition was created during development but the final `.feature` no longer uses it:
  - Remove it, **or**
  - Move it to an appropriate shared location only if it is genuinely reusable and expected to be used imminently.

### Consistency Checks
- Step wording remains intent-only (no UI verbs).
- Navigation guards are implemented inside Flows/Actions where navigation occurs.
- Result-set validations are pagination-aware by default.


---

## 14. Codex / GPT Communication Prompts

Use these when information is missing:
- “Please provide the Acceptance Criteria and Jira ticket details for this feature.”
- “Please provide the DOM/Angular template for `<page>` so selectors can be defined.”
- “This Acceptance Criterion contains multiple behaviours — should I split it?”
- “No existing composite exists for `<intent>` — should I create a new Flow or Action?”
- “This is a results page — should the step validate across pagination, or is first-page-only acceptable per ACs?”
