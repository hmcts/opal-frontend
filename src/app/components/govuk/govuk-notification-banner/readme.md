---

# GOV.UK Notification Banner Component

This Angular component displays a GOV.UK-styled notification banner, typically used for important messages or status updates.

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
import { GovukNotificationBannerComponent } from '@components/govuk/govuk-notification-banner/govuk-notification-banner.component';
```

## Usage

You can use the notification banner component in your template as follows:

```html
<app-govuk-notification-banner
  [type]="'success'"
  [titleText]="'Success notification'"
  [headingText]="'Operation Successful'"
  [messageText]="'Your changes have been saved successfully.'"
></app-govuk-notification-banner>
```

### Example in HTML:

```html
<div
  class="govuk-notification-banner govuk-notification-banner--{{ type }}"
  role="alert"
  aria-labelledby="govuk-notification-banner-title"
  data-module="govuk-notification-banner"
>
  <div class="govuk-notification-banner__header">
    <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">{{ titleText }}</h2>
  </div>
  <div class="govuk-notification-banner__content">
    <h3 class="govuk-notification-banner__heading">{{ headingText }}</h3>
    <p class="govuk-body">{{ messageText }}</p>
  </div>
</div>
```

This component creates a banner that can be used to display important notifications like success messages or warnings.

## Inputs

| Input         | Type     | Description                                            |
| ------------- | -------- | ------------------------------------------------------ |
| `type`        | `string` | The type of notification (e.g., 'success', 'warning'). |
| `titleText`   | `string` | The title text for the notification banner.            |
| `headingText` | `string` | The main heading displayed in the banner.              |
| `messageText` | `string` | The message body displayed in the notification banner. |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-notification-banner.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides an overview of how to use and configure the `govuk-notification-banner` component to display important messages or alerts in your application.
