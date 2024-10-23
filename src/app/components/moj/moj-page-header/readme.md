Here is the `README.md` for the `moj-page-header` component:

---

# MOJ Page Header Component

This Angular component provides a Ministry of Justice (MOJ)-styled page header, typically used for the main header of a page that includes a title, breadcrumbs, and optional actions.

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
import { MojPageHeaderComponent } from '@components/moj/moj-page-header/moj-page-header.component';
```

## Usage

You can use the page header component in your template as follows:

```html
<app-moj-page-header
  [pageTitle]="'Dashboard'"
  [breadcrumbs]="breadcrumbItems"
  [actions]="actionButtons"
></app-moj-page-header>
```

### Example in HTML:

```html
<header class="moj-page-header">
  <nav class="moj-page-header__breadcrumbs">
    <ul>
      <li *ngFor="let crumb of breadcrumbs">
        <a href="{{ crumb.link }}">{{ crumb.label }}</a>
      </li>
    </ul>
  </nav>
  <h1 class="moj-page-header__title">{{ pageTitle }}</h1>
  <div class="moj-page-header__actions">
    <ng-content></ng-content>
  </div>
</header>
```

## Inputs

| Input         | Type     | Description                                          |
| ------------- | -------- | ---------------------------------------------------- |
| `pageTitle`   | `string` | The main title displayed in the page header.         |
| `breadcrumbs` | `Array`  | Array of breadcrumb objects with `label` and `link`. |
| `actions`     | `Array`  | Array of action buttons or links for page actions.   |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `moj-page-header.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides guidance on how to use and configure the `moj-page-header` component for displaying a page title, breadcrumbs, and optional actions.
