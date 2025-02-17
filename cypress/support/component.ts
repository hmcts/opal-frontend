import '@cypress/grep';

beforeEach(function () {
  const test = this.currentTest;
  console.log('test:   ', test);
  console.log('tags:  ', test._testConfig.unverifiedTestConfig.tags);
  const tags = test?._testConfig.unverifiedTestConfig.tags;

  if (tags && tags.length > 0) {
    test.title = `${test.title} [${tags.join(', ')}]`;
  }
});
