---

# GOV.UK Cancel Link Component

This Angular component implements a GOV.UK-styled cancel link, allowing users to navigate or cancel an action by clicking the link.

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
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
```

## Usage

You can use the cancel link component in your template as follows:

```html
<app-govuk-cancel-link [cancelLinkText]="'Cancel Action'" (click)="onCancel()"></app-govuk-cancel-link>
```

### Example in HTML:
```html
<a (keyup.enter)="handleClick()" (click)="handleClick()" class="govuk-link button-link" role="link" tabindex="0">
  {{ cancelLinkText }}
</a>
```

## Inputs

| Input           | Type     | Default       | Description                                      |
| --------------- | -------- | ------------- | ------------------------------------------------ |
| `cancelLinkText`| `string` | 'Cancel'      | The text displayed inside the cancel link.        |

## Outputs

There are no custom outputs for this component.

## Methods

### `handleClick()`

This method handles the click and Enter key events.

## Testing

Unit tests for this component can be found in the `govuk-cancel-link.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This updated version includes a "Default" column, highlighting the default value of the `cancelLinkText` input, which is 'Cancel'. This allows developers to easily understand how to override the default behavior.
