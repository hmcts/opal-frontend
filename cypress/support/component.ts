/// <reference types="@cypress/grep" />
import { register as registerCypressGrep } from '@cypress/grep';
import 'cypress-axe';
import 'cypress-mochawesome-reporter/register';
import { addGdsBodyClass } from '@hmcts/opal-frontend-common/components/govuk/helpers';

registerCypressGrep();

beforeEach(function () {
  addGdsBodyClass();
});
