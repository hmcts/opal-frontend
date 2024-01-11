export function addGdsBodyClass() {
  if (!document.body.classList.contains('govuk-frontend-supported')) {
    document.body.classList.add('govuk-frontend-supported');
  }
}
