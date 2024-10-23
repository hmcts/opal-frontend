Here is the `README.md` for the `govuk-tab-list-item` component:

---

# GOV.UK Tab List Item Component

This Angular component represents an individual item in the tab navigation for GOV.UK-styled tabs, allowing users to switch between different content panels.

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
import { GovukTabListItemComponent } from '@components/govuk/govuk-tab-list-item/govuk-tab-list-item.component';
```

## Usage

You can use the tab list item component in your template as follows:

```html
<app-govuk-tab-list-item [tabTitle]="'Tab 1'"></app-govuk-tab-list-item>
```

### Example in HTML:

```html
<li class="govuk-tabs__list-item">
  <a class="govuk-tabs__tab" href="#tab-1">{{ tabTitle }}</a>
</li>
```

## Inputs

| Input      | Type     | Description                                     |
| ---------- | -------- | ----------------------------------------------- |
| `tabTitle` | `string` | The title of the tab displayed in the tab list. |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-tab-list-item.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides guidance on how to use the `govuk-tab-list-item` component to create individual tabs for navigation in a GOV.UK-styled tab set.
