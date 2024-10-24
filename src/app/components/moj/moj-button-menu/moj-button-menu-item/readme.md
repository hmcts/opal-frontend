---

# MOJ Button Menu Item Component

This Angular component represents an individual item in the MOJ button menu, typically used to display a button for an action inside a menu.

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
import { MojButtonMenuItemComponent } from '@components/moj/moj-button-menu-item/moj-button-menu-item.component';
```

## Usage

You can use the button menu item component in your template as follows:

```html
<app-moj-button-menu-item [label]="'Delete'" (action)="onDelete()"></app-moj-button-menu-item>
```

### Example in HTML:

```html
<li class="moj-button-menu-item">
  <button class="moj-button" (click)="action.emit()">{{ label }}</button>
</li>
```

## Inputs

| Input   | Type     | Description                                     |
| ------- | -------- | ----------------------------------------------- |
| `label` | `string` | The label for the button displayed in the menu. |

## Outputs

| Output   | Type                 | Description                               |
| -------- | -------------------- | ----------------------------------------- |
| `action` | `EventEmitter<void>` | Event emitted when the button is clicked. |

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `moj-button-menu-item.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` explains how to use and configure the `moj-button-menu-item` component, which represents individual buttons within a button menu.
