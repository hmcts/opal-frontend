Here is the `README.md` for the `govuk-text-area` component:

---

# GOV.UK Text Area Component

This Angular component renders a GOV.UK-styled text area, allowing users to input multi-line text with GOV.UK styling and accessibility features.

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
import { GovukTextAreaComponent } from '@components/govuk/govuk-text-area/govuk-text-area.component';
```

## Usage

You can use the text area component in your template as follows:

```html
<app-govuk-text-area
  [textAreaId]="'comments'"
  [labelText]="'Comments'"
  [hintText]="'Please enter your comments here.'"
  [rows]="5"
></app-govuk-text-area>
```

### Example in HTML:

```html
<div class="govuk-form-group">
  <label class="govuk-label" for="{{ textAreaId }}">{{ labelText }}</label>
  <span class="govuk-hint">{{ hintText }}</span>
  <textarea class="govuk-textarea" id="{{ textAreaId }}" rows="{{ rows }}"></textarea>
</div>
```

## Inputs

| Input        | Type     | Description                                   |
| ------------ | -------- | --------------------------------------------- |
| `textAreaId` | `string` | The ID for the text area element.             |
| `labelText`  | `string` | The label for the text area.                  |
| `hintText`   | `string` | Optional hint text displayed below the label. |
| `rows`       | `number` | The number of visible rows in the text area.  |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-text-area.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides an overview of how to use and configure the `govuk-text-area` component to display a multi-line text input following GOV.UK styles.
