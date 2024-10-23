Here is the `README.md` for the `govuk-tag` component:

---

# GOV.UK Tag Component

This Angular component displays a GOV.UK-styled tag, typically used to highlight the status or category of content.

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
import { GovukTagComponent } from '@components/govuk/govuk-tag/govuk-tag.component';
```

## Usage

You can use the tag component in your template as follows:

```html
<app-govuk-tag [text]="'Active'"></app-govuk-tag>
```

### Example in HTML:

```html
<strong class="govuk-tag govuk-tag--green">{{ text }}</strong>
```

## Inputs

| Input   | Type     | Description                                                                                |
| ------- | -------- | ------------------------------------------------------------------------------------------ |
| `text`  | `string` | The text to display inside the tag.                                                        |
| `color` | `string` | Optional class to apply different tag styles (e.g., 'govuk-tag--green', 'govuk-tag--red'). |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-tag.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides an overview of how to use and configure the `govuk-tag` component to display status tags following GOV.UK styles.
