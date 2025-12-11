# Fines OpenAPI Interface Migration Plan

## Scope & Current State
- Manual fines interfaces: `src/app/flows/fines/services/opal-fines-service/interfaces` (≈30 files).
- Generated wrappers from the OpenAPI spec: `src/app/flows/fines/services/opal-fines-service/interfaces/generated` (≈50 files) plus the global client at `src/app/generated/api-client`.
- Primary consumers: `opal-fines.service.ts`, fines UI components, payload mappers, mocks in `src/app/flows/fines/services/opal-fines-service/mocks`, and Cypress intercepts under `cypress/component/fineAccountEnquiry`.

## Target Import Surface
- Prefer importing generated models via `@app/api-client` when the schema matches UI needs.
- Use `interfaces/generated/*` wrappers where they provide stable naming; avoid re-forking schemas in new files.
- Add thin adapters when the UI needs extra display-only fields (e.g., `language_display_name`, formatted dates) rather than duplicating entire interfaces.

## Migration Waves (status)
1) **Reference data & enums** — Done. Generated models swapped into services/components; mocks updated.
2) **Defendant account party/details** — Done. Party/address/contact/employer/enforcement status now generated-aligned; adapters only for UI display fields.
3) **Account summaries** — Done. Header/at-a-glance/enforcement overview/status responses aligned and mocks refreshed.
4) **Creditor flows** — Done. Major/minor creditor account responses, payment details, and SA results mapping use generated shapes; Cypress intercepts remain valid.
5) **Payload builders** — Done. Add/patch payloads and MAC offence/imposition builders emit generated-aligned minor creditor address/payment/party details; tests updated.

## Execution Summary
- Manual → generated type swaps completed across fines services/components/mappers.
- Services, payload mappers, and tests updated; mocks/fixtures aligned to generated schemas.
- Legacy fields retained only where UI requires display-only adapters; candidates for removal are now documented inline.
- Quality gates: `yarn ng lint` and full `yarn test --watch=false --progress=false --browsers=ChromeHeadless --code-coverage=false` passing in this workspace.

## Follow-ups
- Prune any UI-only legacy fields once backend confirms generated schemas are the single source of truth.
- Keep Cypress fixtures in sync with regenerated clients on future spec bumps.
