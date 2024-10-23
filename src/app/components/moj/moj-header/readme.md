Here is the `README.md` for the `moj-header` component:

---

# MOJ Header Component

This Angular component provides a Ministry of Justice (MOJ)-styled header, typically used for the main header of a page, containing navigation, logos, and service names.

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
import { MojHeaderComponent } from '@components/moj/moj-header/moj-header.component';
```

## Usage

You can use the header component in your template as follows:

```html
<app-moj-header
  [logoUrl]="'/assets/logo.png'"
  [serviceName]="'MOJ Service'"
  [navigationItems]="navItems"
></app-moj-header>
```

### Example in HTML:

```html
<header class="moj-header">
  <div class="moj-header__logo">
    <a href="/">
      <img src="{{ logoUrl }}" alt="Logo" />
    </a>
  </div>
  <div class="moj-header__service">
    <a href="/" class="moj-header__link">{{ serviceName }}</a>
  </div>
  <nav class="moj-header__navigation">
    <ul>
      <li *ngFor="let item of navigationItems">
        <a href="{{ item.link }}">{{ item.label }}</a>
      </li>
    </ul>
  </nav>
</header>
```

## Inputs

| Input             | Type     | Description                                        |
| ----------------- | -------- | -------------------------------------------------- |
| `logoUrl`         | `string` | The URL of the logo image displayed in the header. |
| `serviceName`     | `string` | The name of the service displayed in the header.   |
| `navigationItems` | `Array`  | Array of navigation items for the header links.    |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `moj-header.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides an overview of how to use and configure the `moj-header` component to display a page header with logos, service names, and navigation links.
