import { IFinesMacAccountDetailsState } from '../../../fines-mac-account-details/interfaces/fines-mac-account-details-state.interface';
import { IFinesMacCompanyDetailsState } from '../../../fines-mac-company-details/interfaces/fines-mac-company-details-state.interface';
import { IFinesMacContactDetailsState } from '../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacEmployerDetailsState } from '../../../fines-mac-employer-details/interfaces/fines-mac-employer-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { IFinesMacParentGuardianDetailsState } from '../../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-state.interface';
import { IFinesMacPersonalDetailsState } from '../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';
import { FINES_MAC_DEFENDANT_DEBTOR_DETAILS_ALIAS_PAYLOAD } from '../constants/fines-mac-defendant-debtor-details-alias-payload.constant';
import { FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD } from '../constants/fines-mac-defendant-debtor-details-payload.constant';
import { FINES_MAC_DEFENDANT_PARENT_GUARDIAN_PAYLOAD } from '../constants/fines-mac-defendant-parent-guardian-payload.constant';
import { FINES_MAC_DEFENDANT_PAYLOAD } from '../constants/fines-mac-defendant-payload.constant';
import { IFinesMacDefendantCompanyPayload } from '../interfaces/fines-mac-defendant-company.interface';
import { IFinesMacDefendantCompletePayload } from '../interfaces/fines-mac-defendant-complete-payload.interface';
import { IFinesMacDefendantDebtorDetailAliasCompletePayload } from '../interfaces/fines-mac-defendant-debtor-detail-alias-complete-payload.interface';
import { IFinesMacDefendantDebtorDetailCompletePayload } from '../interfaces/fines-mac-defendant-debtor-detail-complete-payload.interface';
import { IFinesMacDefendantParentGuardianPayload } from '../interfaces/fines-mac-defendant-parent-guardian-payload.interface';
import { IFinesMacDefendantIndividualPayload } from '../interfaces/fines-mac-individual-defendant.interface';
import { buildDefendantCompanyPayload } from './fines-mac-payload-defendant-company.utils';
import { buildDefendantIndividualPayload } from './fines-mac-payload-defendant-individual.utils';
import { buildDefendantParentGuardianPayload } from './fines-mac-payload-defendant-parent-guardian.utils';

/**
 * Applies base payloads to an individual or company defendant.
 *
 * This method takes a defendant object, which can be either an individual or a company,
 * and merges it with predefined payload templates to create a complete defendant payload.
 *
 * @param defendant - The defendant object, which can be either an individual or a company.
 * @returns The complete defendant payload with base payloads applied.
 */
const applyBasePayloadsToIndividualOrCompanyDefendant = (
  defendant: IFinesMacDefendantIndividualPayload | IFinesMacDefendantCompanyPayload,
): IFinesMacDefendantCompletePayload => {
  const aliases: IFinesMacDefendantDebtorDetailAliasCompletePayload[] | null =
    defendant.debtor_detail.aliases?.map((alias) => ({
      ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_ALIAS_PAYLOAD,
      ...alias,
    })) || null;

  const debtorDetail: IFinesMacDefendantDebtorDetailCompletePayload = {
    ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD,
    ...defendant.debtor_detail,
    aliases: aliases,
  };

  return {
    ...FINES_MAC_DEFENDANT_PAYLOAD,
    ...defendant,
    debtor_detail: debtorDetail,
  };
};

/**
 * Applies base payloads to the parent guardian defendant.
 *
 * This method takes a `IFinesMacDefendantParentGuardianPayload` object and merges it with predefined
 * payload constants to create a new `IFinesMacDefendantCompletePayload` object. It ensures that the
 * `debtor_detail` and its `aliases` are properly merged with their respective payload constants.
 *
 * @param defendant - The parent guardian defendant object to which the base payloads will be applied.
 * @returns A new `IFinesMacDefendantCompletePayload` object with the base payloads applied.
 */
const applyBasePayloadsToParentGuardianDefendant = (
  defendant: IFinesMacDefendantParentGuardianPayload,
): IFinesMacDefendantCompletePayload => {
  const parentGuardianDebtorAliases: IFinesMacDefendantDebtorDetailAliasCompletePayload[] | null =
    defendant.parent_guardian.debtor_detail.aliases?.map((alias) => ({
      ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_ALIAS_PAYLOAD,
      ...alias,
    })) || null;

  const parentGuardianDebtorDetail: IFinesMacDefendantDebtorDetailCompletePayload = {
    ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD,
    ...defendant.parent_guardian.debtor_detail,
    aliases: parentGuardianDebtorAliases,
  };

  return {
    ...FINES_MAC_DEFENDANT_PAYLOAD,
    ...defendant,
    parent_guardian: {
      ...FINES_MAC_DEFENDANT_PARENT_GUARDIAN_PAYLOAD,
      ...defendant.parent_guardian,
      debtor_detail: parentGuardianDebtorDetail,
    },
  };
};

/**
 * Builds the defendant payload based on the provided state details.
 *
 * @param accountDetailsState - The state containing account details.
 * @param personalDetailsState - The state containing personal details.
 * @param contactDetailsState - The state containing contact details.
 * @param employerDetailsState - The state containing employer details.
 * @param languageDetailsState - The state containing language preferences.
 * @param companyDetailsState - The state containing company details.
 * @param parentGuardianDetailsState - The state containing parent or guardian details.
 * @returns The constructed generic defendant payload.
 */
export const buildDefendantPayload = (
  accountDetailsState: IFinesMacAccountDetailsState,
  personalDetailsState: IFinesMacPersonalDetailsState,
  contactDetailsState: IFinesMacContactDetailsState,
  employerDetailsState: IFinesMacEmployerDetailsState,
  languageDetailsState: IFinesMacLanguagePreferencesState,
  companyDetailsState: IFinesMacCompanyDetailsState,
  parentGuardianDetailsState: IFinesMacParentGuardianDetailsState,
): IFinesMacDefendantCompletePayload => {
  const defendantType = accountDetailsState['fm_create_account_defendant_type'];

  // We want to start by building the defendant object based on the type of defendant we have
  // Then we want to apply the base payloads to the defendant object
  // This is so we have all fields present in the payload, even if they are null

  switch (defendantType) {
    case 'parentOrGuardianToPay':
      return applyBasePayloadsToParentGuardianDefendant(
        buildDefendantParentGuardianPayload(
          personalDetailsState,
          contactDetailsState,
          employerDetailsState,
          parentGuardianDetailsState,
          languageDetailsState,
        ),
      );
    case 'company':
      return applyBasePayloadsToIndividualOrCompanyDefendant(
        buildDefendantCompanyPayload(companyDetailsState, contactDetailsState, languageDetailsState),
      );
    default:
      return applyBasePayloadsToIndividualOrCompanyDefendant(
        buildDefendantIndividualPayload(
          personalDetailsState,
          contactDetailsState,
          employerDetailsState,
          languageDetailsState,
        ),
      );
  }
};
