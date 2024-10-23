Here is the `README.md` for the `moj-button-menu` component:

---

# MOJ Button Menu Component

This Angular component provides a Ministry of Justice (MOJ)-styled button menu, typically used to display a list of actions in a menu format.

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
import { MojButtonMenuComponent } from '@components/moj/moj-button-menu/moj-button-menu.component';
```

## Usage

You can use the button menu component in your template as follows:

```html
<app-moj-button-menu [menuItems]="menuItems"></app-moj-button-menu>
```

### Example in HTML:

```html
<div class="moj-button-menu">
  <ul>
    <li *ngFor="let item of menuItems">
      <button class="moj-button">{{ item.label }}</button>
    </li>
  </ul>
</div>
```

## Inputs

| Input       | Type    | Description                                             |
| ----------- | ------- | ------------------------------------------------------- |
| `menuItems` | `Array` | An array of menu items, each with a `label` and action. |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `moj-button-menu.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides an overview of how to use the `moj-button-menu` component for displaying a list of buttons in a menu layout following MOJ standards.
