---

# GOV.UK Footer Component

This Angular component provides a GOV.UK-styled footer, including meta information such as the Open Government Licence and Crown copyright link.

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
import { GovukFooterComponent } from '@components/govuk/govuk-footer/govuk-footer.component';
```

## Usage

You can use the footer component in your template as follows:

```html
<app-govuk-footer
  [footer]="{
    licenseLink: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
    licenseVersion: '3.0',
    copyrightLink: 'https://www.gov.uk/government/organisations/hm-government'
  }"
></app-govuk-footer>
```

### Example in HTML:

```html
<footer class="govuk-footer" role="contentinfo">
  <div class="govuk-width-container">
    <div class="govuk-footer__meta">
      <div class="govuk-footer__meta-item govuk-footer__meta-item--grow">
        <svg
          aria-hidden="true"
          focusable="false"
          class="govuk-footer__licence-logo"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 483.2 195.7"
          height="17"
          width="41"
        >
          <!-- SVG content -->
        </svg>
        <span class="govuk-footer__licence-description">
          All content is available under the
          <a class="govuk-footer__link" [href]="footer.licenseLink" rel="license"
            >Open Government Licence v{{ footer.licenseVersion }}</a
          >, except where otherwise stated.
        </span>
      </div>
      <div class="govuk-footer__meta-item">
        <a class="govuk-footer__link govuk-footer__copyright-logo" [href]="footer.copyrightLink">© Crown copyright</a>
      </div>
    </div>
  </div>
</footer>
```

## Inputs

| Input    | Type     | Description                                                                       |
| -------- | -------- | --------------------------------------------------------------------------------- |
| `footer` | `object` | Contains `licenseLink`, `licenseVersion`, and `copyrightLink` for footer content. |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-footer.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` explains how to use and configure the `govuk-footer` component, including its inputs for the license and copyright information.
