const pa11y = require('pa11y');

const tmpUrl = 'http://localhost:4000';

export const testUrl = process.env['TEST_URL'] || 'http://localhost:4200';

pa11y(testUrl).then((results: any) => {
  // Do something with the results
  console.log(results);
});
