# Agent Definition of Done – Frontend UI Tickets

This is the authoritative frontend Definition of Done for this repository.

A frontend UI ticket is **Ready for human review** when all applicable criteria below are satisfied.

## Scope and correctness

- [ ] Every applicable ticket Acceptance Criterion is implemented.
- [ ] Every Acceptance Criterion is mapped to its implementation and verification evidence.
- [ ] The implemented behaviour matches the approved ticket scope.
- [ ] Applicable success, validation, loading, empty, error, permission, and navigation states are handled.
- [ ] No known blocking functional defect remains.

## Code and supporting artefacts

- [ ] The final change contains only intended, ticket-related modifications.
- [ ] Unrelated pre-existing changes have been preserved.
- [ ] Required automated tests are present and updated for the changed behaviour.
- [ ] Documentation, configuration, and feature-flag definitions affected by the change are current.
- [ ] No temporary code, debugging output, obsolete comments, or unintended generated files remain.

## Verification

- [ ] All agent-executable checks required by the target repository pass against the final change.
- [ ] Verification evidence records the commands executed and their results.
- [ ] Every applicable Acceptance Criterion has automated or manual verification evidence.
- [ ] Evidence from the externally configured Sonar Quality Gate confirms **Coverage on New Code** meets the configured
      80% threshold for new and materially changed executable code.
- [ ] Every remaining new-code coverage gap below 100% records the affected behaviour, risk, and reason it is not
      covered.
- [ ] Every new or expanded coverage exclusion is narrowly scoped and records its technical reason, affected code,
      risk, and alternative verification.
- [ ] No failed required check remains unresolved.
- [ ] Checks that require a human, unavailable environment, specialist tooling, account, or permission are listed with:
  - the scenario to verify;
  - the required setup;
  - the expected result.

## Accessibility

- [ ] All agent-executable accessibility checks applicable to the changed UI pass.
- [ ] No known blocking accessibility issue remains.
- [ ] Accessibility checks not executable by the agent are included in the human verification instructions.
- [ ] Automated accessibility results are identified as partial evidence and are not represented as proof of full WCAG 2.2 AA compliance.

## Security and privacy

- [ ] The final change contains no exposed secret, credential, token, PII, or unintended sensitive information.
- [ ] No unjustified unsafe HTML, URL, dynamic-content, or logging mechanism has been introduced.
- [ ] Applicable dependency and vulnerability checks pass.
- [ ] Every security exception or vulnerability suppression is documented with its reason and mitigating controls.
- [ ] No known blocking security or privacy issue remains.

## Review readiness

- [ ] The final change has completed the repository-required agent review.
- [ ] All blocking review findings are resolved.
- [ ] Verification affected by review changes has been repeated.
- [ ] Remaining non-blocking findings, limitations, assumptions, and follow-up work are disclosed.
- [ ] Before-and-after screenshots are available for applicable visible UI changes.

## Handoff package

- [ ] A change summary is provided.
- [ ] Materially changed files and their purposes are identified.
- [ ] Acceptance Criteria-to-evidence mapping is provided.
- [ ] Verification commands and results are provided.
- [ ] Accessibility and security evidence is provided.
- [ ] Human-only verification instructions are provided.
- [ ] Known limitations and non-blocking follow-ups are provided.
- [ ] Required draft PR content and Security Vulnerability Assessment are prepared.

## Completion condition

The agent may report **Ready for human review** only when every applicable item above is satisfied.

An item may be marked **Not applicable** only with a recorded reason. An agent-executable requirement cannot be deferred to a human.

If any applicable item is unsatisfied, the work is **not Agent Complete**. The handoff must identify the unmet criterion and what is required to resolve it.
