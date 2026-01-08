/**
 * Forces any `window.open()` calls to stay in the same Cypress runner tab.
 */
export function ForceSingleTabNavigation(): void {
  cy.window().then((win) => {
    cy.stub(win, 'open').callsFake((url) => {
      win.location.href = url as string;
    });
  });
}
