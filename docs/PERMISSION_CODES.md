# Permission codes (PO-5761)

Frontend authorization uses `permission_code` from each business unit's permissions.
`permission_name` is display/debug metadata and must never determine access.
The common UI library accepts string codes; the fines app derives `FinesPermissionCode`
from `FINES_PERMISSIONS` to validate its configured permission requirements.

Routes declare `routePermissionCodes`. Dashboard links and report configurations declare
`permissionCodes`. There is no numeric permission compatibility layer. Account IDs,
business-unit IDs and report IDs retain their existing types.

## Preserved empty-role behavior

`PermissionsService.hasPermissionAccess` and `hasBusinessUnitPermissionAccess` continue
returning `true` when supplied an empty role list. This is existing, tested behavior,
explicitly preserved for PO-5761. Reviewing whether those methods should deny access
instead is separate authorization work; no follow-up Jira key has been assigned here.
The business-unit route guard continues denying access when the user has no roles.

## Coordinated release

1. Validate and publish the migrated common UI library, then pin the application's
   dependency and lockfile to that published version. Local tarball dependencies are
   for development validation only and must not enter the release PR.
2. Complete PO-5762 backend QA and CI, and run integrated frontend tests against its
   common-lib, user-service and fines-service branches.
3. Coordinate frontend/backend merges and deployment so incompatible versions do not
   serve requests together. Merging at similar times alone does not guarantee this.
4. Refresh the affected user-state cache entries through the agreed operational
   process and ensure existing browser sessions reload or reauthenticate. Do not
   change permission comparisons to accept old numeric data.
5. Verify fresh login, `/api/user-state` cache hits and cache repopulation, permitted
   and denied routes, navigation/dashboard visibility and business-unit-scoped actions.

The backend draft-account code is `CREATE_MANAGE_DRAFT_ACCOUNTS`, rather than
`CREATE_AND_MANAGE_DRAFT_ACCOUNTS` shown in the original ticket example.
