# Security exceptions

Follow [the dependency security process](DEPENDENCY_SECURITY.md). This register does not approve risk. A request for fixes, an audit suppression record or an approval in another repository cannot authorise an exception here.

## Approved current exceptions

No repository-specific current exception approvals have been verified. No new exception is approved by this remediation. An empty approved section does not mean the audit is clean.

The reviewed baseline and repository guidance contain no verified exception owner, tracking reference, approver, approval evidence or expiry/review date. The authorised security decision owner and procedure require human clarification; do not invent metadata.

## Outstanding decisions

All entries below are unresolved, not accepted risks. Complete version/path evidence belongs in the review pack for the relevant revision and must be refreshed before a policy decision.

| Finding                                                                                                                                                                                            | Constraint and scope                                                                                                                                                                              | Next action                                                                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [OpenTelemetry Core baggage allocation](https://github.com/advisories/GHSA-8988-4f7v-96qf)                                                                                                         | Core 1.30.1 remains under active Application Insights 2 and its SDK/resource routes. Compatible Core 2 refreshes do not repair Core 1.                                                            | Coordinate a supported common Node/telemetry migration and verify server and browser monitoring. Do not disable telemetry or force a Core major across restricted consumers.            |
| [UUID buffer bounds](https://github.com/advisories/GHSA-w5hq-g745-h8pq)                                                                                                                            | UUID 8.3.2 remains under both properties-volume/Identity/MSAL 3 paths and SockJS. Updated report-tool paths no longer need UUID 8.                                                                | Reassess maintained Azure Identity and SockJS parents, the release-age gate and current MSAL advisories. No global UUID override or automatic scope acceptance.                         |
| [Serializer RCE](https://github.com/advisories/GHSA-5c6j-r48x-rmvq), [CPU exhaustion](https://github.com/advisories/GHSA-qj8w-gfj5-8c6v), [XSS](https://github.com/advisories/GHSA-m5mm-p8h7-m29v) | Serialize JavaScript 6.0.2 persists in Mocha 11 under Cucumber and cypress-parallel. The preprocessor is currently declared as a production dependency; direct Mocha updates leave nested copies. | Coordinate Cucumber's tag/expose migration with the shared runner and functional selection tests; obtain a supported parallel-runner update. Do not force a global serializer override. |
| [FTP command injection](https://github.com/advisories/GHSA-c475-qrg2-pj4r)                                                                                                                         | Basic FTP 5.3.1 remains through OpenAPI Generator CLI, proxy-agent, PAC proxy and get-uri. The maintained parent restricts the FTP major.                                                         | Track a supported owning-parent fix. Tooling classification does not prove absence from the packaged image.                                                                             |

Assignment, tracking, approval and review/expiry remain unverified for every row. The retained OpenTelemetry baseline also names now-absent Core 2.6.1: that portion is stale while Core 1.30.1 remains. Flag the mismatch rather than rewriting it into a new acceptance. Deprecations are maintenance records; changed deprecation versions must not be automatically suppressed.

## Required evidence for an authorised exception

| Field              | Evidence                                                                            |
| ------------------ | ----------------------------------------------------------------------------------- |
| Identity           | Canonical advisory/source and affected package.                                     |
| Exact scope        | Resolved versions/ranges and every approved parent path.                            |
| Rationale/exposure | Why a supported fix is blocked; runtime, build/test and verified packaged exposure. |
| Mitigation         | Actual controls and their verification limits.                                      |
| Accountable owner  | Verified assignment, not a proposed team.                                           |
| Tracking           | Real reference and accessible review evidence.                                      |
| Approval           | Authorised approver, date and exact accepted scope.                                 |
| Review/expiry      | Policy-compliant date and reassessment trigger.                                     |

## Reassessment

Reassess when advisories, supported parents, graph or exposure change, and by any authorised review date. Capture both unfiltered recursive audits, inspect all parent constraints and attempt supported fixes. Remove resolved records only after verification. Missing, expired, incomplete or changed-scope decisions remain unresolved. Do not silently renew dates, broaden another repository's approval or regenerate the baseline.
