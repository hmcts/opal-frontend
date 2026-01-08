# E2E Refactor – Codex Optimized Instructions

This document defines **how to refactor existing E2E feature files** while preserving business behaviour, coverage, and framework conventions.

---

## 1. Scope & General Rules

### Feature-by-feature workflow
- Only refactor the feature explicitly specified by the human.
- Never modify business behaviour or data.

### Reuse-first strategy
Reuse existing:
- **Actions** → `cypress/e2e/functional/opal/actions/**`
- **Flows** → `cypress/e2e/functional/opal/flows/**`
- **Selectors** → `cypress/shared/selectors/**`
- **Step definitions** → `cypress/support/step_definitions/newStyleSteps/**`

Only create new composites/steps/flows/actions when no suitable one exists.

### Legacy rules
- Do not remove legacy step definition files.
- Do not use any old steps outside `newStyleSteps/**`.

### E2E vs Integration
**E2E tests should only:**
- Validate task-level flows, state transitions, summaries, final submission.

**Prefer integration tests for:**
- Capitalisation, formatting, normalisation, and field-mapping rules.  
(E2E may include only a small representative check where needed.)

---

## 2. Scenario Rules

### Scenario Shaping (MANDATORY)
Any scenario containing more than one distinct behaviour **MUST** be split.

Each new scenario MUST:
- Have one clear intent.
- Test one behaviour only from start to end.
- Have a descriptive, intent-based name.
- Stay ≤25 steps — otherwise split while preserving the same data.

### Preservation rules
- All DataTables and values must be preserved.
- If a scenario changes intent mid-flow → **Split**.
- Coverage mapping must be provided:  
  *Original scenario → New scenario(s) → Behaviours/ACs covered*

---

## 3. Gherkin Structure: Background + Rule Blocks (RECOMMENDED)

When refactoring a feature with multiple baselines, prefer grouping with `Rule:` rather than duplicating setup in every scenario.

### Feature-level Background
Use for setup that applies to all scenarios (e.g., login, global cleanup).

### Rule blocks for baselines
Use `Rule:` to group scenarios that share a common baseline (data setup + entry point), such as:
- adult/youth baseline
- company baseline
- non-paying baseline
- parent/guardian baseline

Each `Rule:` may include a `Background:` that:
- creates baseline data
- navigates to the correct entry point
- performs minimal guards required to ensure the baseline is valid

**Guardrails:** keep Rule Background minimal; do not embed behaviour-specific assertions that only apply to one scenario.

---

## 4. Gherkin Style & Step Design

### Imperative, Intent-Based Gherkin
- No UI verbs (*click, type, select*).
- Express **what** is achieved, not **how**.
- Prefer domain language over technical language.

### Combined Steps (Intent-Only)
Steps **should be combined** where it improves readability, **without spelling out mechanics**.

✅ Good:
- “When I delete the account from the review page”
- “When I remove the defendant and confirm deletion”

❌ Avoid:
- “When I click Delete then I am on confirmation page then I click Confirm”

**Rule:** combine actions + inherent navigation into **one intent step**.  
Page assertions must be **implicit** and handled inside flows/actions.

### Inherent Navigation & Guarding (MANDATORY)
If an action causes navigation:
- The Flow/Action must **assert/guard the destination page or state internally**
- Do not rely on repeated “Then I am on the X page” steps

---

## 5. Composite Assertions & Deduplication

### Composite Assertions
Where several assertions verify one outcome, replace them with one composite using a DataTable.

### Review / Summary Pages
- One composite per logical section.
- Do not mix capitalisation checks into review composites.

### Step deduplication
- If multiple steps do the same thing → replace with one shared composite.
- Never keep multiple aliases.

### Field-level generalisation
Single-field steps must be converted to table-driven steps.

---

## 6. Steps, Flows, and Actions

### Step Definitions
- Steps must be thin.
- Steps must call a Flow or an Action — never selectors.
- No UI verbs in step wording.

### Flows
- Use a Flow when a step requires multiple UI actions.
- Flows orchestrate Actions only (never selectors).
- Must log high-level journey intent.
- If navigation occurs, the flow must guard/assert the destination.

### Actions
- Page-level, single-responsibility.
- Use selectors only from `cypress/shared/selectors/**`.
- Import shared actions:
```ts
import { CommonActions } from '../common/common.actions';
```

### Logging
All new Flows and Actions must use:
```
cypress/shared/utils/log.helper
```

---

## 7. Results Pages & Pagination (MANDATORY DEFAULT)

If a page represents a **set of results**, assume pagination exists.

Rules:
- Result validation steps must be pagination-aware by default.
- Do not assume a single page unless explicitly stated.
- “All results” assertions must validate across pages.

---

## 8. Selectors & DOM
- Never invent selectors.
- If a selector is missing → request DOM/Angular markup.
- Add new selectors only in `cypress/shared/selectors/**`.

---

## 9. Documentation & Quality

### JSDoc
All new Flows and Actions MUST include full JSDoc:
- `@fileoverview`
- `@description`
- `@param`
- `@remarks`
- `@example`

---

## 10. Deliverables per Feature
- Updated feature file(s)
- Updated or new step definitions
- Updated or new flows/actions
- Selector updates if required
- Coverage mapping table
- Summary of work completed

---

## 11. Validation & Hygiene Checks (MANDATORY)

### Step Definition Coverage
- Every Gherkin step in the feature file MUST have a corresponding step definition.
- This includes steps inside: **Feature Backgrounds** and **Rule Backgrounds**.

### No Unused Step Definitions
- Remove unused step definitions.
- Only keep shared steps if they are genuinely reusable.

### Consistency Checks
- Steps remain intent-only.
- Navigation guards exist inside flows/actions.
- Result-set assertions are pagination-aware.

---

## 12. Communication Prompts for Codex/GPT
- “Please provide the DOM/Angular template for `<page>` so I can define selectors accurately.”
- “Which feature should I refactor next?”
- “No composite exists for `<intent>` — should I create a new flow/action?”
