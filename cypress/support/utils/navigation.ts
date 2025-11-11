// Forces any window.open() to navigate in the same tab (Cypress runner)
export function forceSingleTabNavigation(): void {
  cy.window().then((win) => {
    cy.stub(win, 'open').callsFake((url) => {
      win.location.href = url as string;
    });
  });
}
