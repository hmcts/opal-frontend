Here is the `README.md` for the `govuk-error-summary` component based on the files you provided:

---

# GOV.UK Error Summary Component

This Angular component implements the GOV.UK-styled error summary, providing a way to display a list of errors with clickable links that take the user to the respective form fields.

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
import { GovukErrorSummaryComponent } from '@components/govuk/govuk-error-summary/govuk-error-summary.component';
```

## Usage

You can use the error summary component in your template as follows:

```html
<app-govuk-error-summary [errors]="formErrors"></app-govuk-error-summary>
```

### Example in HTML:

```html
<div class="govuk-error-summary">
  <div role="alert">
    <h2 class="govuk-error-summary__title">There is a problem</h2>
    <div class="govuk-error-summary__body">
      <ul class="govuk-list govuk-error-summary__list">
        <li *ngFor="let error of errors">
          <a href="#" (click)="handleErrorClick($event, error.fieldId)">{{ error.message }}</a>
        </li>
      </ul>
    </div>
  </div>
</div>
```

## Inputs

| Input    | Type    | Description                                                           |
| -------- | ------- | --------------------------------------------------------------------- |
| `errors` | `Array` | An array of error objects, each containing a `message` and `fieldId`. |

## Outputs

There are no custom outputs for this component.

## Methods

### `handleErrorClick(event: Event, fieldId: string)`

This method handles the click event on the error message links. When a user clicks an error, the page scrolls to the relevant form field.

```typescript
handleErrorClick(event: Event, fieldId: string): void {
  event.preventDefault();
  // Scroll to the form field with the specified fieldId
}
```

## Testing

Unit tests for this component can be found in the `govuk-error-summary.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides an overview of how to use and configure the `govuk-error-summary` component, detailing the error handling and the clickable error messages that link to specific form fields【117†source】.
