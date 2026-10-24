# Contributing

This document is the authoritative workflow for branches, commits, pull requests, evidence, review, and QA.

## Branches

- Create or reuse a dedicated branch for the Jira ticket.
- Use the Jira key as the branch identifier, for example `PO-1234`.
- If the execution environment requires a namespace, prefix the Jira key, for example `codex/PO-1234`.
- Do not add a description suffix unless the team or automation requires one.
- For non-ticketed maintenance, use a short kebab-case description, with any namespace required by the execution environment.
- Automated dependency and environment branches may follow their tool's established naming convention.
- If work starts on the wrong branch, preserve the changes and move them to a correctly named branch before raising a PR.

## Commits

- Use Conventional Commits: `<type>(<optional-scope>): <imperative summary>`.
- A Jira key may be used as the scope for ticketed work, for example `feat(PO-1234): add defendant validation`.
- Use an established type such as `feat`, `fix`, `test`, `docs`, `refactor`, `chore`, or `ci`.
- Keep the subject meaningful, related to the change, and at or below 72 characters.
- Reference the Jira ticket and related PR in the commit body when the branch or PR does not provide sufficient context.
- Do not include secrets, tokens, credentials, PII, or sensitive environment details in commit messages.

## Pull requests

A pull request must include:

- The Jira ticket number in the title when the change is ticketed.
- A completed Jira link when the change is ticketed.
- A clear change description tied to the Acceptance Criteria.
- Testing evidence.
- A completed Security Vulnerability Assessment.
- A reviewed and updated checklist.

Keep the PR focused. Separate unrelated changes rather than expanding the ticket's scope.

## Testing evidence

Record:

- What was tested.
- Where it was tested, including the environment where relevant.
- The exact automated commands run and their results.
- Manual scenarios covered where automation did not execute the changed behaviour.
- Checks that were not run and why.
- Before-and-after screenshots for UI changes, with secrets, credentials, tokens, and PII removed.

A successful pipeline is not evidence that every changed line or scenario was executed. Explain the applicable automated or manual coverage.

## Review and QA

- Obtain approval from at least two reviewers before merge.
- Run or apply agent review using `AGENTS.md`, `docs/CODE_REVIEW_GUIDELINES.md`, and the applicable repository testing guides.
- Validate review feedback technically; resolve validated blocking findings before merge.
- Reviewers confirm that the Acceptance Criteria are met, evidence is adequate, the UI is accessible and consistent with project patterns, and avoidable regressions have not been introduced.
- Obtain QA sign-off where the ticket or release process requires it.

## Pull request template

```md
### Jira link

<!-- Replace PROJ-XXXXXX and JIRA_LINK. Remove this section when not applicable. -->

See [PROJ-XXXXXX](JIRA_LINK)

### Change description

<!-- Summarise the change and how it satisfies the Acceptance Criteria. -->

### Testing done

<!--
Include:
- what was tested
- where it was tested
- exact automated commands and results
- manual scenarios
- checks not run and why
- before-and-after screenshots for UI changes
-->

### Security Vulnerability Assessment

**CVE Suppression:** Are any newly introduced or pre-existing CVEs intentionally suppressed or ignored by this change?

- [ ] Yes
- [ ] No

<!--
If Yes, include:
- CVE IDs
- reason for suppression or acceptance
- mitigating factors or compensating controls
-->

### Checklist

- [ ] The change meets the ticket Acceptance Criteria.
- [ ] Commit messages follow the repository convention.
- [ ] Documentation has been updated where required.
- [ ] Relevant tests have been added or updated.
- [ ] Testing evidence is complete.
- [ ] Accessibility has been considered for changed UI.
- [ ] The Security Vulnerability Assessment is complete.
- [ ] Breaking changes are identified and documented.
```
