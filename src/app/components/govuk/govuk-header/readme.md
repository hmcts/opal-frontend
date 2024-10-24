---

# GOV.UK Header Component

This Angular component provides a GOV.UK-styled header, including links to the GOV.UK homepage, service name, and additional content slots for service and organizational details.

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
import { GovukHeaderComponent } from '@components/govuk/govuk-header/govuk-header.component';
```

## Usage

You can use the header component in your template as follows:

```html
<app-govuk-header
  [headerLinks]="{
    govukLink: 'https://www.gov.uk',
    serviceLink: '/my-service'
  }"
>
  <span organisationName>HM Government</span>
  <span serviceName>Service Name</span>
  <!-- Additional header content can go here -->
</app-govuk-header>
```

### Example in HTML:

```html
<header class="govuk-header" role="banner" data-module="govuk-header">
  <div class="govuk-header__container govuk-width-container">
    <div class="govuk-header__logo">
      <a href="https://www.gov.uk" class="govuk-header__link govuk-header__link--homepage">
        <span class="govuk-header__logotype">
          <svg
            aria-hidden="true"
            focusable="false"
            class="govuk-header__logotype-crown"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 132 97"
            height="30"
            width="36"
          >
            <!-- SVG content for Crown logo -->
          </svg>
          <span class="govuk-header__logotype-text">
            <ng-content select="[organisationName]"></ng-content>
          </span>
        </span>
      </a>
    </div>
    <div class="govuk-header__content">
      <a routerLink="/my-service" class="govuk-header__link govuk-header__service-name">
        <ng-content select="[serviceName]"></ng-content>
      </a>
    </div>
  </div>
</header>
```

## Inputs

| Input         | Type     | Description                                                                                        |
| ------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `headerLinks` | `object` | Contains links such as `govukLink` for the GOV.UK homepage and `serviceLink` for the service name. |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-header.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` explains how to use and configure the `govuk-header` component, including the inputs for linking to the GOV.UK homepage and service page.
