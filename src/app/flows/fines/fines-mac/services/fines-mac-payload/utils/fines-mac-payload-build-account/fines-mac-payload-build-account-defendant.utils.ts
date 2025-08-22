import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../../../constants/fines-mac-defendant-types-keys';
import { IFinesMacAccountDetailsState } from '../../../../fines-mac-account-details/interfaces/fines-mac-account-details-state.interface';
import { IFinesMacCompanyDetailsState } from '../../../../fines-mac-company-details/interfaces/fines-mac-company-details-state.interface';
import { IFinesMacContactDetailsState } from '../../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacEmployerDetailsState } from '../../../../fines-mac-employer-details/interfaces/fines-mac-employer-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { IFinesMacParentGuardianDetailsState } from '../../../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-state.interface';
import { IFinesMacPersonalDetailsState } from '../../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_DEBTOR_DETAILS_ALIAS } from '../../constants/fines-mac-payload-account-defendant-debtor-details-alias.constant';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_DEBTOR_DETAILS } from '../../constants/fines-mac-payload-account-defendant-debtor-details.constant';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN } from '../../constants/fines-mac-payload-account-defendant-parent-guardian.constant';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT } from '../../constants/fines-mac-payload-account-defendant.constant';
import { IFinesMacPayloadAccountDefendantCompany } from '../interfaces/fines-mac-payload-account-defendant-company.interface';
import { IFinesMacPayloadAccountDefendantComplete } from '../interfaces/fines-mac-payload-account-defendant-complete.interface';
import { IFinesMacPayloadAccountDefendantDebtorDetailAliasComplete } from '../interfaces/fines-mac-payload-account-defendant-debtor-detail-alias-complete.interface';
import { IFinesMacPayloadAccountDefendantDebtorDetailComplete } from '../interfaces/fines-mac-payload-account-defendant-debtor-detail-complete.interface';
import { IFinesMacPayloadAccountDefendantParentGuardian } from '../interfaces/fines-mac-payload-account-defendant-parent-guardian.interface';
import { IFinesMacPayloadAccountDefendantIndividual } from '../interfaces/fines-mac-payload-account-individual-defendant.interface';
import { finesMacPayloadBuildAccountDefendantCompany } from './fines-mac-payload-build-account-defendant-company.utils';
import { finesMacPayloadBuildAccountDefendantIndividual } from './fines-mac-payload-build-account-defendant-individual.utils';
import { finesMacPayloadBuildAccountDefendantParentGuardian } from './fines-mac-payload-build-account-defendant-parent-guardian.utils';

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
  defendant: IFinesMacPayloadAccountDefendantIndividual | IFinesMacPayloadAccountDefendantCompany,
): IFinesMacPayloadAccountDefendantComplete => {
  const aliases: IFinesMacPayloadAccountDefendantDebtorDetailAliasComplete[] | null =
    defendant.debtor_detail.aliases?.map((alias) => ({
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_DEBTOR_DETAILS_ALIAS,
      ...alias,
    })) || null;

  const debtorDetail: IFinesMacPayloadAccountDefendantDebtorDetailComplete = {
    ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_DEBTOR_DETAILS,
    ...defendant.debtor_detail,
    aliases: aliases,
  };

  return {
    ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT,
    ...defendant,
    debtor_detail: debtorDetail,
    parent_guardian: null,
  };
};

/**
 * Applies base payloads to the parent guardian defendant.
 *
 * This method takes a `IFinesMacPayloadAccountDefendantParentGuardian` object and merges it with predefined
 * payload constants to create a new `IFinesMacPayloadAccountDefendantComplete` object. It ensures that the
 * `debtor_detail` and its `aliases` are properly merged with their respective payload constants.
 *
 * @param defendant - The parent guardian defendant object to which the base payloads will be applied.
 * @returns A new `IFinesMacPayloadAccountDefendantComplete` object with the base payloads applied.
 */
const applyBasePayloadsToParentGuardianDefendant = (
  defendant: IFinesMacPayloadAccountDefendantParentGuardian,
): IFinesMacPayloadAccountDefendantComplete => {
  const parentGuardianDebtorAliases: IFinesMacPayloadAccountDefendantDebtorDetailAliasComplete[] | null =
    defendant.parent_guardian.debtor_detail.aliases?.map((alias) => ({
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_DEBTOR_DETAILS_ALIAS,
      ...alias,
    })) ?? null;

  const parentGuardianDebtorDetail: IFinesMacPayloadAccountDefendantDebtorDetailComplete = {
    ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_DEBTOR_DETAILS,
    ...defendant.parent_guardian.debtor_detail,
    aliases: parentGuardianDebtorAliases,
  };

  return {
    ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT,
    ...defendant,
    debtor_detail: null,
    parent_guardian: {
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN,
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
export const finesMacPayloadBuildAccountDefendant = (
  accountDetailsState: IFinesMacAccountDetailsState,
  personalDetailsState: IFinesMacPersonalDetailsState,
  contactDetailsState: IFinesMacContactDetailsState,
  employerDetailsState: IFinesMacEmployerDetailsState,
  languageDetailsState: IFinesMacLanguagePreferencesState,
  companyDetailsState: IFinesMacCompanyDetailsState,
  parentGuardianDetailsState: IFinesMacParentGuardianDetailsState,
): IFinesMacPayloadAccountDefendantComplete => {
  const defendantType = accountDetailsState['fm_create_account_defendant_type'];

  // We want to start by building the defendant object based on the type of defendant we have
  // Then we want to apply the base payloads to the defendant object
  // This is so we have all fields present in the payload, even if they are null

  switch (defendantType) {
    case FINES_MAC_DEFENDANT_TYPES_KEYS.pgToPay:
      return applyBasePayloadsToParentGuardianDefendant(
        finesMacPayloadBuildAccountDefendantParentGuardian(
          personalDetailsState,
          contactDetailsState,
          employerDetailsState,
          parentGuardianDetailsState,
          languageDetailsState,
        ),
      );
    case FINES_MAC_DEFENDANT_TYPES_KEYS.company:
      return applyBasePayloadsToIndividualOrCompanyDefendant(
        finesMacPayloadBuildAccountDefendantCompany(companyDetailsState, contactDetailsState, languageDetailsState),
      );
    default:
      return applyBasePayloadsToIndividualOrCompanyDefendant(
        finesMacPayloadBuildAccountDefendantIndividual(
          personalDetailsState,
          contactDetailsState,
          employerDetailsState,
          languageDetailsState,
        ),
      );
  }
};
