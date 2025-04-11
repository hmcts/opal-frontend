import '@cypress/grep';
import { addGdsBodyClass } from 'src/app/components/govuk/helpers/add-gds-body-class';

beforeEach(function () {
  const test = this.currentTest;
  const tags = test?._testConfig.unverifiedTestConfig.tags;

  if (tags && tags.length > 0) {
    test.title = `${test.title} [${tags.join(', ')}]`;
  }

  addGdsBodyClass();
});
