Based on the provided files for the `govuk-accordion` component, here is a `README.md` that explains the component, following the structure you requested:

---

# GOV.UK Accordion Component

This Angular component wraps the GOV.UK Accordion element, allowing you to display collapsible content sections in your application.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Methods](#methods)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

```typescript
import { GovukAccordionComponent } from '@components/govuk/govuk-accordion/govuk-accordion.component';
```

## Usage

You can use the accordion component in your template as follows:

```html
<app-govuk-accordion [accordionId]="myAccordionId" [sections]="accordionSections"> </app-govuk-accordion>
```

### Example in HTML:

```html
<app-govuk-accordion [accordionId]="'accordion-default'" [sections]="accordionSections"></app-govuk-accordion>
```

This will render an accordion with multiple sections, similar to:

```html
<div class="govuk-accordion" data-module="govuk-accordion" id="accordion-default">
  <div class="govuk-accordion__section">
    <div class="govuk-accordion__section-header">
      <h2 class="govuk-accordion__section-heading">
        <span class="govuk-accordion__section-button" id="accordion-default-heading-1"> Writing well for the web </span>
      </h2>
    </div>
    <div
      id="accordion-default-content-1"
      class="govuk-accordion__section-content"
      aria-labelledby="accordion-default-heading-1"
    >
      <p class="govuk-body">This is the content for Writing well for the web.</p>
    </div>
  </div>
</div>
```

## Inputs

| Input         | Type                 | Description                                                                   |
| ------------- | -------------------- | ----------------------------------------------------------------------------- |
| `accordionId` | `string`             | The ID of the accordion element. This should be unique for accessibility.     |
| `sections`    | `AccordionSection[]` | An array of objects representing each section, including heading and content. |

## Outputs

| Output     | Description                                           |
| ---------- | ----------------------------------------------------- |
| `expand`   | Event emitted when an accordion section is expanded.  |
| `collapse` | Event emitted when an accordion section is collapsed. |

## Methods

### `toggleSection(sectionId: string)`

This method allows toggling of the visibility of a specific section by its `sectionId`.

### `expandAllSections()`

Expands all sections in the accordion.

### `collapseAllSections()`

Collapses all sections in the accordion.

## Testing

Unit tests for this component can be found in the `govuk-accordion.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides a detailed explanation of the `govuk-accordion` component based on the provided files, including how to install, use, and test the component, along with descriptions of inputs, outputs, and methods.
