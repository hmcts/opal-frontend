Here is the `README.md` for the `govuk-header-navigation-item` component based on the files you provided:

---

# GOV.UK Header Navigation Item Component

This Angular component provides a navigation item styled according to GOV.UK standards, used within the header to represent a clickable link or button.

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
import { GovukHeaderNavigationItemComponent } from '@components/govuk/govuk-header-navigation-item/govuk-header-navigation-item.component';
```

## Usage

You can use the navigation item component in your template as follows:

```html
<app-govuk-header-navigation-item (click)="onClick()">
  <span linkText>Sign In</span>
</app-govuk-header-navigation-item>
```

### Example in HTML:

```html
<a
  href="#"
  class="govuk-link govuk-link--inverse sign-in-link cursor-pointer"
  (click)="handleClick($event)"
  (keyup.enter)="handleClick($event)"
  role="link"
  tabindex="0"
>
  <ng-content select="[linkText]"></ng-content>
</a>
```

This creates a clickable navigation link that responds to both clicks and keyboard events.

## Inputs

There are no specific inputs for this component.

## Outputs

There are no custom outputs for this component.

## Methods

### `handleClick(event: Event)`

This method handles the click and `Enter` key events for the navigation item, allowing you to define what happens when the link is activated.

```typescript
handleClick(event: Event): void {
  event.preventDefault();
  // Custom logic for handling click
}
```

## Testing

Unit tests for this component can be found in the `govuk-header-navigation-item.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides an overview of the `govuk-header-navigation-item` component, detailing its usage as a clickable navigation item within the GOV.UK-styled header【146†source】.
