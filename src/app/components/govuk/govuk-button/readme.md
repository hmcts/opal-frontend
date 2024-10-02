# GOV.UK Button Component

This Angular component wraps the GOV.UK Button element, providing flexibility to customise its appearance and behaviour.

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
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
```

## Usage

You can use the button component in your template as follows:

```html
<app-govuk-button [buttonId]="myButtonId" [type]="'submit'" [buttonClasses]="'extra-class'" (click)="onButtonClick()">
  Click Me
</app-govuk-button>
```

## Inputs

| Input           | Type     | Description                                                  |
| --------------- | -------- | ------------------------------------------------------------ |
| `buttonId`      | `string` | The ID of the button element.                                |
| `type`          | `string` | The type attribute of the button (e.g., 'button', 'submit'). |
| `buttonClasses` | `string` | Additional CSS classes to apply to the button.               |

## Outputs

| Output  | Description                               |
| ------- | ----------------------------------------- |
| `click` | Event emitted when the button is clicked. |

## Methods

### `handleButtonClick()`

This method handles the button click event and triggers any associated logic.

## Testing

Unit tests for this component can be found in the `govuk-button.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
