Here is the `README.md` for the `moj-banner` component based on the previous examples:

---

# MOJ Banner Component

This Angular component provides a Ministry of Justice (MOJ)-styled banner, typically used to display important announcements or notifications.

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
import { MojBannerComponent } from '@components/moj/moj-banner/moj-banner.component';
```

## Usage

You can use the banner component in your template as follows:

```html
<app-moj-banner [bannerText]="'Service will be unavailable during maintenance'" [type]="'warning'"></app-moj-banner>
```

### Example in HTML:

```html
<div class="moj-banner moj-banner--{{ type }}">
  <p>{{ bannerText }}</p>
</div>
```

## Inputs

| Input        | Type     | Description                                      |
| ------------ | -------- | ------------------------------------------------ |
| `bannerText` | `string` | The text displayed in the banner.                |
| `type`       | `string` | Optional style for the banner (e.g., 'warning'). |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `moj-banner.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides guidance on how to use and configure the `moj-banner` component for displaying notifications styled for MOJ services.
