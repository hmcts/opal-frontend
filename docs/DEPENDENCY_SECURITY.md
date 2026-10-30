# Dependency security

Use this process for the Angular browser application, Node SSR server and their build/test dependencies. Read [repository guidance](REPO_GUIDELINES.md), [contribution guidance](CONTRIBUTING.md) and [the exception register](SECURITY_EXCEPTIONS.md). This document grants no security approval.

## Repository sources of truth

- Use `.nvmrc`, `package.json#packageManager` and `.yarnrc.yml#yarnPath` for Node/Yarn. Older prose examples can be stale. Use Corepack and the declared toolchain; do not change the runtime floor to accommodate a dependency.
- `package.json`, `yarn.lock` and `.yarnrc.yml` define the single workspace, dependency ranges, resolutions, node-modules linker and lifecycle settings. Inspect effective audit filters and release-age controls.
- `server.ts`, `server-setup.ts`, `angular.json` and `config/` define SSR, proxy, session and monitoring behaviour. The SSR target explicitly externalises `@hmcts/nodejs-healthcheck`; a successful bundle alone does not verify installed runtime modules.
- `Dockerfile` installs the full graph for compilation, focuses a separate stage on production dependencies, then copies the compiled application, runtime configuration and focused modules into a fresh runtime image. Packages still declared in `dependencies` remain eligible for inclusion even when used only by build/test tools. Verify the actual image and its external runtime modules; production audit classification alone does not establish image contents.
- `Jenkinsfile_CNP` and `Jenkinsfile_nightly` select shared-pipeline revisions. Inspect the selected revision's scanner, transformer and suppression matching. `yarn-audit-known-issues` is a baseline input, not an approval register. `.github/renovate.json` controls proposals; it does not prove account-level alert settings.

## Establish evidence before edits

Preserve unrelated changes and use an isolated checkout when requested. Record the starting revision, branch, dirty-file/diff hashes, toolchain, timestamps, skill resource hashes and exposed model/settings. Mark unavailable values unknown. Keep raw output and case-specific review material in a retained external review pack unless the repository has an established review location.

```sh
node --version
corepack yarn --version
corepack yarn install --immutable
corepack yarn config get npmAuditExcludePackages
corepack yarn config get npmAuditIgnoreAdvisories
corepack yarn npm audit --all --recursive --environment production --json
corepack yarn npm audit --all --recursive --json
```

Capture stdout, stderr and child exit status separately. Inspect the pinned Yarn report schema: tree-shaped NDJSON is distinct from older advisory maps. Separate deprecations from security advisories. A nonzero exit can mean findings or execution failure; empty, malformed, incomplete or error-only output is not clean. Corroborate an empty JSON result with the same scope in human-readable mode and a recognised successful completion. See [Yarn audit](https://yarnpkg.com/cli/npm/audit).

Use equivalent registry, workspace and filter coverage before/after. Count distinct canonical GHSA identifiers in the complete graph; report raw record/version counts separately and production independently. Do not add production to complete totals. A production-only reduction caused by reclassification is not a fix. Failed snapshots have unknown counts.

For every advisory, retain authoritative affected/patched ranges, resolved versions, all recursive `yarn why` paths and each owning parent's declared constraint. Account for duplicate copies and existing overrides. Inspect runtime imports and build/test use; distinguish potential packaged exposure from verified image contents and exploitability.

## Choose supported remediation

Prefer maintained parent/direct releases, then targeted refreshes allowed by existing ranges. `corepack yarn up --recursive <package>` re-resolves matching descriptors without rewriting manifest ranges; inspect its resulting graph and churn. See [Yarn up](https://yarnpkg.com/cli/up). Honour the configured release-age gate, engines, peers and migration requirements.

Inspect bot proposal diffs, exact bases/heads and available CI diagnostics. A red aggregate check does not identify its failing stage. Re-resolve combined fixes against this application's graph rather than blindly copying another lockfile or transferring approval.

A major-version resolution needs compatibility evidence for every affected consumer, verified ownership, tracking and a removal condition. Prefer a supported parent update; do not add a global override merely to lower counts. Existing overrides also require review.

Keep active browser and server telemetry intact. Test shared-runner configuration, tag selection and report generation before upgrading test-tool majors. Peer compatibility alone does not verify these contracts. Inspect `postinstall` and `patches/`; preserve patch-package and verify patched content after installation. Do not disable lifecycle scripts or regenerate suppressions to obtain a pass.

## Verification and review

```sh
corepack yarn install --immutable
corepack yarn lint
corepack yarn test
corepack yarn build:ssr
corepack yarn npm audit --all --recursive --environment production --json
corepack yarn npm audit --all --recursive --json
```

Repeat recursive path checks and corroborate target removal against authoritative ranges. Exercise changed consumers: SSR startup, health, static assets, external modules, proxies, trust/session/cookie behaviour, telemetry and test reporting. Run heavy checks sequentially and use disposable loopback ports to avoid disrupting local services. Compiler diagnostics remain failures even if a runner exits zero. Full functional and accessibility coverage needs the relevant environment; `test:a11y` is informational and does not execute accessibility tests.

Delete only baseline records whose affected occurrences are verified absent. Retain unresolved records unchanged and flag stale scope or missing approval metadata for a decision. Never add remaining findings, roll forward dates or run `audit:save` as remediation. Test the audit wrapper with recognised findings and scanner failures; report enforcement defects separately when CI changes are excluded.

Produce the finding ledger, comparable counts, exact manifest/lockfile/baseline deltas, compatibility decisions, verification command/status ledger and proposed PR text in the review pack. Record failures, new advisories and unavailable checks. Preserve raw evidence before temporary/worktree cleanup. Human review, CI, image and deployment verification are separate states; do not imply completion without their own evidence. No repository-specific security approval authority is established here: unresolved exceptions need the actual authorised policy decision.
