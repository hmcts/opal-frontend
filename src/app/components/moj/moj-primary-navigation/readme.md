Here is the `README.md` for the `moj-primary-navigation` component:

---

# MOJ Primary Navigation Component

This Angular component provides a Ministry of Justice (MOJ)-styled primary navigation bar, typically used for the main navigation links of a web application.

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
import { MojPrimaryNavigationComponent } from '@components/moj/moj-primary-navigation/moj-primary-navigation.component';
```

## Usage

You can use the primary navigation component in your template as follows:

```html
<app-moj-primary-navigation [navigationItems]="navItems"></app-moj-primary-navigation>
```

### Example in HTML:

```html
<nav class="moj-primary-navigation">
  <ul class="moj-primary-navigation__list">
    <li *ngFor="let item of navigationItems" class="moj-primary-navigation__item">
      <a class="moj-primary-navigation__link" href="{{ item.link }}">{{ item.label }}</a>
    </li>
  </ul>
</nav>
```

## Inputs

| Input             | Type    | Description                                                    |
| ----------------- | ------- | -------------------------------------------------------------- |
| `navigationItems` | `Array` | Array of navigation items, each containing `label` and `link`. |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `moj-primary-navigation.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides guidance on how to use and configure the `moj-primary-navigation` component to display a primary navigation bar for MOJ applications.
