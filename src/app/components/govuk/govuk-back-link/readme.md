---

# GOV.UK Back Link Component

This Angular component wraps the GOV.UK Back Link element, allowing users to navigate back to a previous page.

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
import { GovukBackLinkComponent } from '@components/govuk/govuk-back-link/govuk-back-link.component';
```

## Usage

You can use the back link component in your template as follows:

```html
<app-govuk-back-link href="/previous-page">Go Back</app-govuk-back-link>
```

Alternatively, you can rely on the default behavior:

```html
<app-govuk-back-link>Back</app-govuk-back-link>
```

### Example in HTML:

```html
<a href="#" class="govuk-back-link" (click)="onBack($event)">Back</a>
```

This will create a back link that, when clicked, navigates to the previous page using the browser's history.

## Inputs

| Input  | Type     | Description                                                               |
| ------ | -------- | ------------------------------------------------------------------------- |
| `href` | `string` | The URL the back link should point to. Defaults to `'#'` if not provided. |

## Outputs

There are no outputs for this component.

## Methods

### `onBack(event: Event)`

This method handles the click event and prevents the default behavior of the anchor element, navigating the user back to the previous page using the browser's history API.

```typescript
onBack(event: Event): void {
  event.preventDefault();
  window.history.back();
}
```

## Testing

Unit tests for this component can be found in the `govuk-back-link.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides complete information about the installation, usage, and testing of the `govuk-back-link` component, helping developers integrate it into their projects
