import { FINES_PERMISSIONS } from 'src/app/constants/fines-permissions.constant';
import { VariantBankingUploadLocators as L } from '../../../shared/selectors/variant-banking-upload.locators';
import { setupVariantBankingUploadComponent } from './setup/SetupVariantBankingUploadComponent';

const JIRA_TAGS = ['@JIRA-STORY:PO-8684', '@JIRA-EPIC:PO-3952', '@JIRA-LABEL:finance', '@R1CBankingInterfaces'];

const contents = (value: string) => Cypress.Buffer.from(value);

const validFile = (sequence: string) => ({
  contents: contents(`Variant Banking file ${sequence}`),
  fileName: `a121_261027_VB_077_${sequence}.dat`,
  mimeType: 'application/octet-stream',
});

describe('Variant Banking file upload', () => {
  it(
    'shows the empty upload screen and an inbound-files link for a user with both permissions',
    { tags: JIRA_TAGS },
    () => {
      setupVariantBankingUploadComponent();

      cy.get(L.heading).should('have.text', 'Upload variant banking files');
      cy.get(L.emptyState).should('be.visible').and('have.text', 'No files uploaded.');
      cy.get(L.fileList).should('not.exist');
      cy.get(L.fileInput).should('have.attr', 'accept', '.dat');
      cy.contains('label', 'Add files').should('be.visible');
      cy.get(L.dropZone).should('be.visible');
      cy.get(L.viewInboundFiles)
        .should('have.text', 'files you upload here')
        .and('have.attr', 'href', '/fines/finance/inbound-files/search');
    },
  );

  it('uploads multiple selected files and shows successful rows', { tags: JIRA_TAGS }, () => {
    setupVariantBankingUploadComponent();

    cy.get(L.fileInput).selectFile([validFile('01'), validFile('02')], { force: true });

    cy.get(L.fileName).should('have.length', 2);
    cy.get(L.fileName).eq(0).should('have.text', 'a121_261027_VB_077_01.dat');
    cy.get(L.fileName).eq(1).should('have.text', 'a121_261027_VB_077_02.dat');
    cy.get(L.successIcon).should('have.length', 2).and('have.attr', 'aria-label', 'Uploaded');
    cy.get(L.errorIcon).should('not.exist');
  });

  it('uploads a file dropped onto the drop zone', { tags: JIRA_TAGS }, () => {
    setupVariantBankingUploadComponent();

    cy.get(L.dropZone).selectFile(validFile('05'), { action: 'drag-drop' });

    cy.get(L.fileName).should('have.text', 'a121_261027_VB_077_05.dat');
    cy.get(L.successIcon).should('be.visible');
  });

  it(
    'rejects an unsupported file with a row-level error and does not show a success state',
    { tags: JIRA_TAGS },
    () => {
      setupVariantBankingUploadComponent();

      cy.get(L.fileInput).selectFile(
        {
          contents: contents('not a banking file'),
          fileName: 'unsupported.csv',
          mimeType: 'text/csv',
        },
        { force: true },
      );

      cy.get(L.fileName).should('have.text', 'unsupported.csv');
      cy.contains('The selected file must be a .DAT.').should('be.visible');
      cy.get(L.errorIcon).should('have.attr', 'aria-label', 'File rejected');
      cy.get(L.successIcon).should('not.exist');
    },
  );

  it('rejects a DAT file whose name does not follow the Variant Banking format', { tags: JIRA_TAGS }, () => {
    setupVariantBankingUploadComponent();

    cy.get(L.fileInput).selectFile(
      {
        contents: contents('banking data'),
        fileName: 'not-a-variant-banking-file.dat',
        mimeType: 'application/octet-stream',
      },
      { force: true },
    );

    cy.contains('The selected file name must follow the format a121_yymmdd_VB_XXX_nn.dat.').should('be.visible');
    cy.get(L.errorIcon).should('be.visible');
    cy.get(L.successIcon).should('not.exist');
  });

  it('rejects a file larger than 2 MB', { tags: JIRA_TAGS }, () => {
    setupVariantBankingUploadComponent();

    cy.get(L.fileInput).selectFile(
      {
        contents: Cypress.Buffer.alloc(2 * 1024 * 1024 + 1),
        fileName: 'a121_261027_VB_077_06.dat',
        mimeType: 'application/octet-stream',
      },
      { force: true },
    );

    cy.contains('The selected file must be smaller than 2MB.').should('be.visible');
    cy.get(L.errorIcon).should('be.visible');
    cy.get(L.successIcon).should('not.exist');
  });

  it('shows a page error when more than six files are selected at once', { tags: JIRA_TAGS }, () => {
    setupVariantBankingUploadComponent();

    cy.get(L.fileInput).selectFile(
      Array.from({ length: 7 }, (_, index) => validFile(String(index + 1).padStart(2, '0'))),
      { force: true },
    );

    cy.get(L.errorSummary)
      .should('be.visible')
      .and('contain.text', 'You can only select up to 6 files at the same time.');
    cy.get(L.fileList).should('not.exist');
  });

  it(
    'shows the server error beside the failed file while allowing a later file to succeed',
    { tags: JIRA_TAGS },
    () => {
      setupVariantBankingUploadComponent();

      cy.get(L.fileInput).selectFile([validFile('03'), validFile('04')], { force: true });

      cy.get(L.fileName).should('have.length', 2);
      cy.contains('The banking file is invalid.').should('be.visible');
      cy.get(L.errorIcon).should('have.length', 1).and('have.attr', 'aria-label', 'Upload failed');
      cy.get(L.successIcon).should('have.length', 1);
    },
  );

  it('hides the inbound-files link when the user has upload permission only', { tags: JIRA_TAGS }, () => {
    setupVariantBankingUploadComponent({ permissionIds: [FINES_PERMISSIONS['upload-variant-banking-files']] });

    cy.get(L.viewInboundFiles).should('not.exist');
  });
});
