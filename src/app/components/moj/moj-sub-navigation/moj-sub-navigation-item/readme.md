Here is the `README.md` for the `moj-sub-navigation-item` component:

---

# MOJ Sub Navigation Item Component

This Angular component represents an individual item in the MOJ sub-navigation, used to create links within a sub-navigation bar for secondary navigation.

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
import { MojSubNavigationItemComponent } from '@components/moj/moj-sub-navigation-item/moj-sub-navigation-item.component';
```

## Usage

You can use the sub-navigation item component in your template as follows:

```html
<app-moj-sub-navigation-item [label]="'Settings'" [link]="'/settings'"></app-moj-sub-navigation-item>
```

### Example in HTML:

```html
<li class="moj-sub-navigation__item">
  <a class="moj-sub-navigation__link" href="{{ link }}">{{ label }}</a>
</li>
```

## Inputs

| Input   | Type     | Description                                 |
| ------- | -------- | ------------------------------------------- |
| `label` | `string` | The text displayed for the navigation item. |
| `link`  | `string` | The URL or route the item links to.         |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `moj-sub-navigation-item.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` explains how to use and configure the `moj-sub-navigation-item` component to create links for secondary navigation in an MOJ application.
