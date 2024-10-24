---

# MOJ Primary Navigation Item Component

This Angular component represents an individual item in the MOJ primary navigation, typically used to create navigation links inside a primary navigation bar.

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
import { MojPrimaryNavigationItemComponent } from '@components/moj/moj-primary-navigation-item/moj-primary-navigation-item.component';
```

## Usage

You can use the primary navigation item component in your template as follows:

```html
<app-moj-primary-navigation-item [label]="'Home'" [link]="'/home'"></app-moj-primary-navigation-item>
```

### Example in HTML:

```html
<li class="moj-primary-navigation__item">
  <a class="moj-primary-navigation__link" href="{{ link }}">{{ label }}</a>
</li>
```

## Inputs

| Input   | Type     | Description                                       |
| ------- | -------- | ------------------------------------------------- |
| `label` | `string` | The label text displayed for the navigation item. |
| `link`  | `string` | The URL or route the navigation item links to.    |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `moj-primary-navigation-item.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` explains how to use the `moj-primary-navigation-item` component to create individual navigation links in the MOJ primary navigation bar.
