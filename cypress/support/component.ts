import '@cypress/grep';
import { addGdsBodyClass } from '@hmcts/opal-frontend-common/components/govuk/helpers';

beforeEach(function () {
  const test = this.currentTest;
  const tags = test?._testConfig.unverifiedTestConfig.tags;

  if (tags && tags.length > 0) {
    test.title = `${test.title} [${tags.join(', ')}]`;
  }

  addGdsBodyClass();
});
