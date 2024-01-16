/**
 * Adds necessary CSS classes to the document body for GDS (Government Digital Service) support.
 */
export function addGdsBodyClass() {
  if (!document.body.classList.contains('govuk-frontend-supported')) {
    document.body.classList.add('govuk-frontend-supported');
  }

  if (!document.body.classList.contains('js-enabled')) {
    document.body.classList.add('js-enabled');
  }
}
