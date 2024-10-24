---

# GOV.UK Heading with Caption Component

This Angular component displays a heading with an optional caption, styled according to GOV.UK standards.

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
import { GovukHeadingWithCaptionComponent } from '@components/govuk/govuk-heading-with-caption/govuk-heading-with-caption.component';
```

## Usage

You can use the heading with caption component in your template as follows:

```html
<app-govuk-heading-with-caption
  [captionText]="'Page subtitle'"
  [headingText]="'Main heading'"
></app-govuk-heading-with-caption>
```

### Example in HTML:

```html
<span class="govuk-caption-l">{{ captionText }}</span>
<h1 class="govuk-heading-l">{{ headingText }}</h1>
```

This component renders a GOV.UK-styled large heading (`h1`) along with an optional caption displayed above the heading.

## Inputs

| Input         | Type     | Description                                              |
| ------------- | -------- | -------------------------------------------------------- |
| `captionText` | `string` | The caption text displayed above the heading (optional). |
| `headingText` | `string` | The main heading text.                                   |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-heading-with-caption.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

If there are additional features in the new version of the component, let me know and I can modify the `README.md` accordingly.
