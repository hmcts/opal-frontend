# Fines MAC Form Parent Base

Shared parent-form helper used by Fines MAC pages that need nested-route navigation and unsaved-change tracking.

## Contents

- `fines-mac-form-parent-base.component.ts`: shared navigation and unsaved-change helpers for MAC parent pages
- `types/`: local type definitions used by the base component and its tests

## Why it exists

The MAC parent pages repeat the same control flow around:

- updating the MAC store after submit
- navigating to a nested route when the flow is nested
- falling back to account details when the flow is not nested
- syncing unsaved change state into the store and `canDeactivate`

Keeping that logic here avoids repeating it across each MAC page component while keeping MAC-specific behaviour out of the shared `opal-frontend-common` library.
