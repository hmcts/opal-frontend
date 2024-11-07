---

# GOV.UK Details Component

This Angular component implements the GOV.UK-styled details element, which allows users to expand and collapse content sections.

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
import { GovukDetailsComponent } from '@components/govuk/govuk-details/govuk-details.component';
```

## Usage

You can use the details component in your template as follows:

```html
<app-govuk-details [summaryText]="'More information'">
  <!-- Content inside the details block -->
  <p>This is the hidden content that will be revealed when the user expands the details.</p>
</app-govuk-details>
```

### Example in HTML:

```html
<details class="govuk-details">
  <summary class="govuk-details__summary">
    <span class="govuk-details__summary-text">{{ summaryText }}</span>
  </summary>
  <div class="govuk-details__text">
    <ng-content></ng-content>
  </div>
</details>
```

## Inputs

| Input         | Type     | Description                                                                                         |
| ------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `summaryText` | `string` | The text displayed in the summary element, which the user clicks to expand or collapse the details. |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-details.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides information on how to use and configure the `govuk-details` component, including the `summaryText` input, which controls the text displayed in the expandable summary.
