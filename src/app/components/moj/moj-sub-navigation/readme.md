Here is the `README.md` for the `moj-sub-navigation` component:

---

# MOJ Sub Navigation Component

This Angular component provides a Ministry of Justice (MOJ)-styled sub-navigation, typically used for secondary navigation links within a section.

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
import { MojSubNavigationComponent } from '@components/moj/moj-sub-navigation/moj-sub-navigation.component';
```

## Usage

You can use the sub-navigation component in your template as follows:

```html
<app-moj-sub-navigation [navigationItems]="subNavItems"></app-moj-sub-navigation>
```

### Example in HTML:

```html
<nav class="moj-sub-navigation">
  <ul class="moj-sub-navigation__list">
    <li *ngFor="let item of navigationItems" class="moj-sub-navigation__item">
      <a class="moj-sub-navigation__link" href="{{ item.link }}">{{ item.label }}</a>
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

Unit tests for this component can be found in the `moj-sub-navigation.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides guidance on how to use and configure the `moj-sub-navigation` component to display secondary navigation links in an MOJ application.
