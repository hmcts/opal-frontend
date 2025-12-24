# Flow LLD Template (Reusable)

Use this template to draft a low-level design for any Opal flow. Replace placeholders and remove sections that are not applicable. Keep references and links to related LLDs (audit, logging, Dynatrace) when relevant.

## Version History
- <version> - <date> - <author> - <notes>

## References
- Code repo path(es): `<path to feature>`
- Related backend service(s): `<service name>` (proxy base path: `<path>`)
- Routing: `<path to routes file>`
- Other LLDs: `<links to audit/logging/observability/etc>`

## Business Overview
- Problem statement and where the flow fits in the wider process.
- Key users and entry points (dashboard link, deep link, hand-off).

## Business Requirements
- Bullets for the main outcomes/behaviours.
- Include variations (roles, defendant types, account types, etc.) if relevant.

## NFR Details
- Security: auth/permissions, data handling, concurrency.
- Accessibility: components, labels, keyboard paths.
- Performance: caching, change detection, pagination limits.
- Resilience: retries, timeouts, cache invalidation, state reset.

## Development Details
- Commands to run/build/test (`yarn start`, `yarn ng lint`, `yarn test`, `yarn cypress ...`).
- Pipeline links if needed.
- Backend API docs location (Swagger/OpenAPI).

## Dependencies
- Dependent on: `<services/data/feature stores/guards>`.
- Is dependency of: `<downstream features/flows>`.

## Technical Solution
- High-level flow (screens/steps), navigation rules, and guards.
- State management approach (store slices, computed flags, unsaved/state change handling).
- Key components/services and how they interact.
- Any shortcuts/alternate paths relevant to this flow.

## API Definitions and Processes
- Base path: `<base proxy path>`.
- Endpoints (new or consumed): list with method, path, purpose.
- Concurrency/versioning (ETag/If-Match) if used.
- Sequencing/diagrams if helpful.

## Client/Server Validation
- Client-side validation rules and gating (guards, control flow).
- Server-side validation expectations and error handling.

## External Services
- Services integrated, entry/exit points, auth considerations.

## Data Model
- UI state shape (store slices, flags).
- Payloads/contracts (request/response) with key fields.
- Derived/computed values worth noting.

## State Model
- Initial state prerequisites.
- Transitions and flags (e.g., unsavedChanges/stateChanges).
- Special cases (delete, amend, read-only modes).

## Configuration Settings
- Environment variables/Helm values.
- Feature toggles, default limits (e.g., max results).
- Routing constants/paths.

## Error Handling
- How API errors surface (banners, toasts), navigation safety (beforeunload/canDeactivate).
- Cache reset/cleanup expectations.

## Testing Approach
- Unit/component/E2E scope and target specs to add/update.
- Commands to run.
- Accessibility (axe) coverage expectations.

## Security
- Auth/permission model per route.
- Unsafe binding avoidance, PII handling, logging/audit expectations.
- Concurrency controls if applicable.

## User Interface
- Components/pages, layout notes, edit vs read-only behaviour.
- Selector strategy (stable hooks) and navigation affordances.

## Further Considerations
- Open questions, pending decisions, or follow-up work.
- Observability/logging/tagging additions.
- Risks or likely future changes.
