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

  /**
   * Checks if the employer details status is valid.
   *
   * @param employerDetails - The employer details form object.
   * @returns `true` if the status is either `PROVIDED` or `NOT_PROVIDED`, otherwise `false`.
   */
  private checkEmployerDetailsStatus(employerDetails: IFinesMacEmployerDetailsForm): boolean {
    const validStatuses = [FINES_MAC_STATUS.PROVIDED, FINES_MAC_STATUS.NOT_PROVIDED];
    return validStatuses.includes(employerDetails.status!);
  }

  /**
   * Checks if the status of each offence in the provided offence details array is 'PROVIDED'.
   *
   * @param offenceDetails - An array of offence details to check.
   * @returns `true` if all offence statuses are 'PROVIDED', otherwise `false`.
   */
  private checkEachOffenceStatus(offenceDetails: IFinesMacOffenceDetailsForm[]): boolean {
    return offenceDetails.every((offence) => offence.status === FINES_MAC_STATUS.PROVIDED);
  }

  /**
   * Checks if all mandatory sections for adult or youth are provided.
   *
   * This method verifies the status of various sections including court details,
   * personal details, employer details, offence details, and payment terms. It
   * ensures that each section's status is either `FINES_MAC_STATUS.PROVIDED` or `true`.
   *
   * @returns {boolean} - Returns `true` if all mandatory sections are provided, otherwise `false`.
   */
  private adultOrYouthMandatorySectionsCheck(): boolean {
    const { courtDetails, personalDetails, employerDetails, offenceDetails, paymentTerms } = this.finesMacState;

    const statusesToCheck = [
      courtDetails.status,
      personalDetails.status,
      paymentTerms.status,
      this.checkEmployerDetailsStatus(employerDetails),
      this.checkEachOffenceStatus(offenceDetails),
    ];

    return statusesToCheck.every((status) => status === FINES_MAC_STATUS.PROVIDED || status === true);
  }

  /**
   * Checks if all mandatory sections for adult or youth parent/guardian are provided.
   *
   * This method verifies the statuses of various sections including court details,
   * personal details, employer details, parent/guardian details, offence details,
   * and payment terms. It ensures that each section's status is either `PROVIDED`
   * or `true`.
   *
   * @returns {boolean} - Returns `true` if all mandatory sections are provided, otherwise `false`.
   */
  private adultOrYouthParentGuardianMandatorySectionsCheck(): boolean {
    const { courtDetails, personalDetails, employerDetails, parentGuardianDetails, offenceDetails, paymentTerms } =
      this.finesMacState;

    const statusesToCheck = [
      courtDetails.status,
      parentGuardianDetails.status,
      personalDetails.status,
      paymentTerms.status,
      this.checkEmployerDetailsStatus(employerDetails),
      this.checkEachOffenceStatus(offenceDetails),
    ];

    return statusesToCheck.every((status) => status === FINES_MAC_STATUS.PROVIDED || status === true);
  }

  /**
   * Checks if all mandatory sections for a company are provided.
   *
   * This method verifies the statuses of the court details, company details,
   * offence details, and payment terms within the `finesMacState` object.
   * It ensures that each status is either `FINES_MAC_STATUS.PROVIDED` or `true`.
   *
   * @returns {boolean} - Returns `true` if all mandatory sections are provided, otherwise `false`.
   */
  private companyMandatorySectionsCheck(): boolean {
    const { courtDetails, companyDetails, offenceDetails, paymentTerms } = this.finesMacState;

    const statusesToCheck = [
      courtDetails.status,
      companyDetails.status,
      paymentTerms.status,
      this.checkEachOffenceStatus(offenceDetails),
    ];

    return statusesToCheck.every((status) => status === FINES_MAC_STATUS.PROVIDED || status === true);
  }

  /**
   * Checks if the mandatory sections for the current defendant type are completed.
   *
   * This method determines the defendant type from the `finesMacState` and calls the appropriate
   * function to check if all mandatory sections for that defendant type are completed.
   *
   * @returns {boolean} - Returns `true` if all mandatory sections are completed, otherwise `false`.
   */
  public checkMandatorySections(): boolean {
    const { accountDetails } = this.finesMacState;
    const defendantType = accountDetails.formData.fm_create_account_defendant_type!;

    const checkFunctions: { [key: string]: () => boolean } = {
      adultOrYouthOnly: this.adultOrYouthMandatorySectionsCheck.bind(this),
      parentOrGuardianToPay: this.adultOrYouthParentGuardianMandatorySectionsCheck.bind(this),
      company: this.companyMandatorySectionsCheck.bind(this),
    };

    return checkFunctions[defendantType]();
  }
}
