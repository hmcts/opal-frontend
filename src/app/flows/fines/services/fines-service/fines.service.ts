import { Injectable } from '@angular/core';
import { IFinesMacState } from '../../fines-mac/interfaces/fines-mac-state.interface';
import { FINES_MAC_STATE } from '../../fines-mac/constants/fines-mac-state';
import { FINES_MAC_STATUS } from '../../fines-mac/constants/fines-mac-status';
import { IFinesMacOffenceDetailsForm } from '../../fines-mac/fines-mac-offence-details/interfaces/fines-mac-offence-details-form.interface';
import { IFinesMacEmployerDetailsForm } from '../../fines-mac/fines-mac-employer-details/interfaces/fines-mac-employer-details-form.interface';

@Injectable({
  providedIn: 'root',
})
export class FinesService {
  // Non reactive state
  public finesMacState: IFinesMacState = FINES_MAC_STATE;

  private checkEmployerDetailsStatus(employerDetails: IFinesMacEmployerDetailsForm): boolean {
    return (
      employerDetails.status === FINES_MAC_STATUS.PROVIDED || employerDetails.status === FINES_MAC_STATUS.NOT_PROVIDED
    );
  }

  private checkEachOffenceStatus(offenceDetails: IFinesMacOffenceDetailsForm[]): boolean {
    let provided!: boolean;
    offenceDetails.forEach((offence) => {
      if (offence.status === FINES_MAC_STATUS.PROVIDED) {
        provided = true;
      }
    });

    return provided;
  }

  private adultOrYouthMandatorySectionsCheck(): boolean {
    const { courtDetails, personalDetails, employerDetails, offenceDetails, paymentTerms } = this.finesMacState;

    return (
      courtDetails.status === FINES_MAC_STATUS.PROVIDED &&
      personalDetails.status === FINES_MAC_STATUS.PROVIDED &&
      paymentTerms.status === FINES_MAC_STATUS.PROVIDED &&
      this.checkEmployerDetailsStatus(employerDetails) &&
      this.checkEachOffenceStatus(offenceDetails)
    );
  }

  private adultOrYouthParentGuardianMandatorySectionsCheck(): boolean {
    const { courtDetails, personalDetails, employerDetails, parentGuardianDetails, offenceDetails, paymentTerms } =
      this.finesMacState;

    return (
      courtDetails.status === FINES_MAC_STATUS.PROVIDED &&
      personalDetails.status === FINES_MAC_STATUS.PROVIDED &&
      parentGuardianDetails.status === FINES_MAC_STATUS.PROVIDED &&
      paymentTerms.status === FINES_MAC_STATUS.PROVIDED &&
      this.checkEmployerDetailsStatus(employerDetails) &&
      this.checkEachOffenceStatus(offenceDetails)
    );
  }

  private companyMandatorySectionsCheck(): boolean {
    const { courtDetails, companyDetails, offenceDetails, paymentTerms } = this.finesMacState;

    return (
      courtDetails.status === FINES_MAC_STATUS.PROVIDED &&
      companyDetails.status === FINES_MAC_STATUS.PROVIDED &&
      paymentTerms.status === FINES_MAC_STATUS.PROVIDED &&
      this.checkEachOffenceStatus(offenceDetails)
    );
  }

  public checkMandatorySections(): boolean {
    const { accountDetails } = this.finesMacState;

    switch (accountDetails.formData.fm_create_account_defendant_type) {
      case 'adultOrYouthOnly':
        return this.adultOrYouthMandatorySectionsCheck();
      case 'parentOrGuardianToPay':
        return this.adultOrYouthParentGuardianMandatorySectionsCheck();
      default:
        return this.companyMandatorySectionsCheck();
    }
  }
}
