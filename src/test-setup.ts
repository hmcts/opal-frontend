import 'zone.js/testing';
import { GovukRadioComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';

// JSDOM cannot initialize GOV.UK and MOJ frontend widgets used by shared components.
// Keep component behavior testable without executing browser-only initializers.
Object.defineProperty(MojDatePickerComponent.prototype, 'configureDatePicker', {
  configurable: true,
  writable: true,
  value: () => {},
});

Object.defineProperty(GovukRadioComponent.prototype, 'initOuterRadios', {
  configurable: true,
  writable: true,
  value: () => {},
});
