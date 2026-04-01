---
name: opal-flow-lld
description: Create low-level design (LLD) documents for Opal frontend flows using the Flow LLD template. Use when asked to draft, fill out, or update a flow LLD for Opal.
---

# Opal Flow LLD

## Use the template
- Use `flow-lld-template.md` in this folder as the base template.
- Copy the template into the target LLD file and replace placeholders.
- Remove sections that are not applicable to the flow.
- Keep references and links to related LLDs (audit/logging/observability) when relevant.

## Gather missing inputs
- Ask for the flow name, repo path(s), routes file, and any related services.
- Ask for entry points, key users, and any known dependencies or downstream flows.
- Ask for API base path(s), endpoints, and validation rules if not provided.

- Ask for the relevant **TDIA (Tech Design Impact Assessment) NFR section(s)** for the area/flow:
  - Preferred: user pastes the approved TDIA NFR excerpt(s) into the chat.
  - Alternative: user provides path(s) to `.codex-docs/` (or a subfolder), e.g. `.codex-docs/tdia/<area>-nfr.md`.
  - Capture TDIA metadata if known: document name, version, approval date, and any agreed waivers/deviations.
  - If TDIA NFR content cannot be provided, proceed but mark NFRs as **Assumptions / needs client confirmation**.
  - Do **not** invent SYS-NFR IDs or imply TDIA approval when it has not been provided.
  - Remind the user to include only the relevant TDIA NFR excerpt(s) and avoid sensitive/unrelated content.

## Write the LLD
- Fill each section with concise, implementation-ready details.
- Prefer bullets over long paragraphs.
- Add a version history entry with date and author.
- Call out open questions or risks in Further Considerations.

- **NFR Details must be TDIA-aligned** when TDIA input is available:
  - Include “TDIA sources used” (doc path/name + version/approval date if provided).
  - Preserve SYS-NFR references exactly as written in TDIA (e.g. `SYS-NFR-036`).
  - Where TDIA classifies operations (e.g. Response Time Targets), explicitly list the operations under the same classification (e.g. Simple vs Complex).
  - If the LLD deviates from TDIA, call it out explicitly as a deviation/waiver and track it in Further Considerations.

## TDIA NFR prompting snippet (ask verbatim)
To produce the NFR section, please provide the TDIA-approved NFR excerpt(s) for this area/flow:
- Paste the “Non-Functional Requirements” section(s) here, OR
- Tell me which `.codex-docs/...` TDIA markdown files to use (paths + doc names).

If there are any client-approved waivers/deviations to the TDIA NFRs for this flow, include them too.

## Output expectations
- Return a Markdown LLD ready for review and save it under `.codex-docs/` in the project root.
- Avoid secrets, tokens, or PII in the document.
