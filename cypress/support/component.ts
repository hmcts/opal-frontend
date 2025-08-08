import '@cypress/grep';
import 'cypress-mochawesome-reporter/register';
import { addGdsBodyClass } from '@hmcts/opal-frontend-common/components/govuk/helpers';

beforeEach(function () {
  const test = this.currentTest;

  // @ts-ignore
  const tags = test?._testConfig.unverifiedTestConfig.tags;

  if (tags && tags.length > 0) {
    test.title = `${test.title} [${tags.join(', ')}]`;
  }

  addGdsBodyClass();
});
