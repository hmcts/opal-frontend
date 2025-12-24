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

## Write the LLD
- Fill each section with concise, implementation-ready details.
- Prefer bullets over long paragraphs.
- Add a version history entry with date and author.
- Call out open questions or risks in Further Considerations.

## Output expectations
- Return a Markdown LLD ready for review and save it under `docs/` in the project root.
- Avoid secrets, tokens, or PII in the document.
