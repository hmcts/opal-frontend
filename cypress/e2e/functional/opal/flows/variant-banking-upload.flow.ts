import { VariantBankingUploadActions } from '../actions/finance/variant-banking-upload.actions';

/** Business journeys for uploading Variant Banking files from Finance. */
export class VariantBankingUploadFlow {
  private readonly actions = new VariantBankingUploadActions();

  /** Verifies the first-load state, selection journey, success feedback and inbound-files navigation. */
  public verifySuccessfulMultiFileUpload(): void {
    this.actions.assertInitialUploadScreen();
    this.actions.uploadMultipleFilesAndAssertSuccess();
    this.actions.assertInboundFilesLink();
  }
}
