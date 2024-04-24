/**
 * Adds necessary CSS classes to the document body for GDS (Government Digital Service) support.
 */
export function addGdsBodyClass() {
  const bodyClassList = document.body.classList;

  if (!bodyClassList.contains('govuk-frontend-supported')) {
    bodyClassList.add('govuk-frontend-supported');
  }

  if (!bodyClassList.contains('js-enabled')) {
    bodyClassList.add('js-enabled');
  }
}
