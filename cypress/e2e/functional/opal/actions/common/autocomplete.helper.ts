/**
 * Shared helpers for autocomplete-style inputs used across Cypress action classes.
 */

type TimeoutOptions = Partial<Cypress.Timeoutable>;

type AutocompleteOptions = {
  inputSelector: string;
  listboxSelector: string;
  value: string;
  label: string;
  timeoutOptions: TimeoutOptions;
  typeDelay?: number;
};

type FirstOptionAutocompleteOptions = {
  inputSelector: string;
  listboxSelector: string;
  label: string;
  timeoutOptions: TimeoutOptions;
};

/**
 * Types a value into an autocomplete input and selects the best matching option.
 * Falls back to keyboard selection when no direct text match is present.
 * @param options - Autocomplete input and listbox configuration.
 * @param options.inputSelector - Selector for the autocomplete input.
 * @param options.listboxSelector - Selector for the autocomplete listbox.
 * @param options.value - Value to type into the autocomplete.
 * @param options.label - Logical field label used in assertion messages.
 * @param options.timeoutOptions - Cypress timeout options used for each lookup.
 * @param options.typeDelay - Optional typing delay override.
 */
export const typeAndSelectAutocompleteOption = ({
  inputSelector,
  listboxSelector,
  value,
  label,
  timeoutOptions,
  typeDelay = 0,
}: AutocompleteOptions): void => {
  const input = cy.get(inputSelector, timeoutOptions).should('exist');
  input.scrollIntoView().clear({ force: true });

  if (value === '') {
    input.should('have.value', '');
    return;
  }

  input.type(value, { force: true, delay: typeDelay }).should('have.value', value);
  cy.get(listboxSelector, timeoutOptions).should('exist');

  cy.get(`${listboxSelector} li`, timeoutOptions).then(($options) => {
    const expected = value.toLowerCase();
    const matchedOption = Array.from($options).find((option) =>
      (option.textContent ?? '').toLowerCase().includes(expected),
    );

    if (matchedOption) {
      cy.wrap(matchedOption).click({ force: true });
      return;
    }

    cy.get(inputSelector, timeoutOptions).type('{downarrow}{enter}', { force: true });
  });

  cy.get(inputSelector, timeoutOptions).should(($input) => {
    const actual = ($input.val() ?? '').toString().trim();
    expect(actual, `${label} autocomplete selected value`).to.not.equal('');
  });
};

/**
 * Selects the first available option in an autocomplete without typing a search term.
 * @param options - Autocomplete input and listbox configuration.
 * @param options.inputSelector - Selector for the autocomplete input.
 * @param options.listboxSelector - Selector for the autocomplete listbox.
 * @param options.label - Logical field label used in log output.
 * @param options.timeoutOptions - Cypress timeout options used for each lookup.
 */
export const selectFirstAutocompleteOption = ({
  inputSelector,
  listboxSelector,
  label,
  timeoutOptions,
}: FirstOptionAutocompleteOptions): void => {
  const input = cy.get(inputSelector, timeoutOptions).should('exist');
  input.scrollIntoView().clear({ force: true }).type('{downarrow}{enter}', { force: true });
  cy.get(listboxSelector, timeoutOptions).should('exist');
  cy.get(inputSelector, timeoutOptions).invoke('val').should('not.be.empty');
  Cypress.log({ name: 'select', message: `Selected first autocomplete option for ${label}` });
};
