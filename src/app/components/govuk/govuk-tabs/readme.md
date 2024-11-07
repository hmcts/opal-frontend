---

# GOV.UK Tabs Component

This Angular component renders GOV.UK-styled tabs, allowing users to switch between different sections of content.

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
import { GovukTabsComponent } from '@components/govuk/govuk-tabs/govuk-tabs.component';
```

## Usage

You can use the tabs component in your template as follows:

```html
<app-govuk-tabs [tabs]="tabsData"></app-govuk-tabs>
```

### Example in HTML:

```html
<div class="govuk-tabs" data-module="govuk-tabs">
  <h2 class="govuk-tabs__title">Contents</h2>
  <ul class="govuk-tabs__list">
    <li *ngFor="let tab of tabs" class="govuk-tabs__list-item">
      <a class="govuk-tabs__tab" href="#">{{ tab.title }}</a>
    </li>
  </ul>
  <div class="govuk-tabs__panel" *ngFor="let tab of tabs">{{ tab.content }}</div>
</div>
```

## Inputs

| Input  | Type    | Description                                                           |
| ------ | ------- | --------------------------------------------------------------------- |
| `tabs` | `Array` | Array of tab objects where each tab contains a `title` and `content`. |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-tabs.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` explains how to use the `govuk-tabs` component to display tabbed content in a GOV.UK-styled layout.
