import '@angular/compiler';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import 'zone.js';
import 'zone.js/testing';
import { GovukRadioComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';

const testBed = getTestBed();

if (!testBed.platform) {
  testBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
}

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
