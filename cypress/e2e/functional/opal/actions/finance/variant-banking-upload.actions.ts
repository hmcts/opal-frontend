import { VariantBankingUploadLocators as L } from '../../../../../shared/selectors/variant-banking-upload.locators';

const FILE_NAMES = ['a121_261027_VB_077_01.dat', 'a121_261027_VB_077_02.dat'];

/** Cypress actions for the Variant Banking file upload page. */
export class VariantBankingUploadActions {
  /** Asserts the upload page starts with an empty file list and the expected controls. */
  public assertInitialUploadScreen(): void {
    cy.get(L.heading).should('be.visible').and('have.text', 'Upload variant banking files');
    cy.get(L.emptyState).should('be.visible').and('have.text', 'No files uploaded.');
    cy.get(L.fileList).should('not.exist');
    cy.get(L.fileInput).should('have.attr', 'accept', '.dat');
    cy.contains('label', 'Add files').should('be.visible');
    cy.get(L.dropZone).should('be.visible');
  }

  /** Selects two valid files and verifies each mocked upload request and resulting success state. */
  public uploadMultipleFilesAndAssertSuccess(): void {
    cy.intercept('POST', '**/opal-file-handling-service/interface-files', {
      statusCode: 201,
      body: {
        interface_file_id: 9001,
        source: 'VARIANT_BANKING',
        target: 'OPAL',
        type: 'SOURCE',
        domain: 'FINES',
        status: 'SUCCESS',
        errors: null,
      },
    }).as('variantBankingUpload');

    cy.get(L.fileInput).selectFile(
      FILE_NAMES.map((fileName) => ({
        contents: Cypress.Buffer.from(`Variant Banking content for ${fileName}`),
        fileName,
      })),
      { force: true },
    );

    cy.wait('@variantBankingUpload').then(({ request }) => {
      expect(request.method).to.equal('POST');
      expect(request.headers['content-type']).to.include('multipart/form-data');
    });
    cy.wait('@variantBankingUpload');

    cy.get(L.fileName).should('have.length', 2);
    FILE_NAMES.forEach((fileName, index) => cy.get(L.fileName).eq(index).should('have.text', fileName));
    cy.get(L.successIcon).should('have.length', 2);
    cy.get(L.errorIcon).should('not.exist');
  }

  /** Asserts the route's link to the independently permission-protected inbound viewer. */
  public assertInboundFilesLink(): void {
    cy.get(L.viewInboundFiles)
      .should('be.visible')
      .and('have.text', 'files you upload here')
      .and('have.attr', 'href', '/fines/finance/inbound-files/search');
  }
}
