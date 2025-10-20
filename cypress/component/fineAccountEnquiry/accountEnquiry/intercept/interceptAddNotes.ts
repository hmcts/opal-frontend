/**
 * Intercepts the POST request to the `/opal-fines-service/notes/add` endpoint during Cypress tests.
 *
 * This function mocks the network request by returning a 201 status code with an empty response body.
 * No response data is needed, as there is no behavior based on the response content.
 * The intercepted request is aliased as `postAddNotes` for use in assertions or waiting within tests.
 */
export function interceptAddNotes() {
  return cy
    .intercept('POST', '/opal-fines-service/notes/add', {
      statusCode: 201,
      body: {},
    })
    .as('postAddNotes');
}
