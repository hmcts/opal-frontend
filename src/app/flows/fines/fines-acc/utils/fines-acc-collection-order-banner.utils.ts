import { FINES_ACCOUNT_TYPES } from '../../constants/fines-account-types.constant';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { FINES_ACC_DEBTOR_TYPES } from '../constants/fines-acc-debtor-types.constant';
import { FINES_ACC_COLLECTION_ORDER_BANNER_MESSAGES } from '../constants/fines-acc-collection-order-banner-messages.constant';

/**
 * Gets the Collection Order warning banner message for a defendant account header.
 *
 * @param header - Defendant account header summary data.
 * @returns The warning banner message when the Collection Order state does not align with the account type; otherwise null.
 */
export const getFinesAccCollectionOrderBannerMessage = (
  header: IOpalFinesAccountDefendantDetailsHeader,
): string | null => {
  const hasCollectionOrder = header.collection_order === true;
  const hasNoCollectionOrder = header.collection_order === false;
  const isConditionalCaution = header.account_type === FINES_ACCOUNT_TYPES['Conditional Caution'];
  const isCompany = header.party_details.organisation_flag;
  const isParentOrGuardianToPay = header.debtor_type === FINES_ACC_DEBTOR_TYPES.parentGuardian;
  const isYouth = !isCompany && !isParentOrGuardianToPay && header.is_youth;
  const isAdult = !isCompany && !isConditionalCaution && (isParentOrGuardianToPay || !header.is_youth);

  if (hasNoCollectionOrder && isAdult) {
    return FINES_ACC_COLLECTION_ORDER_BANNER_MESSAGES.noCollectionOrder;
  }

  if (!hasCollectionOrder) {
    return null;
  }

  if (isConditionalCaution) {
    return FINES_ACC_COLLECTION_ORDER_BANNER_MESSAGES.conditionalCautionWithCollectionOrder;
  }

  if (isCompany) {
    return FINES_ACC_COLLECTION_ORDER_BANNER_MESSAGES.companyWithCollectionOrder;
  }

  if (isYouth) {
    return FINES_ACC_COLLECTION_ORDER_BANNER_MESSAGES.youthWithCollectionOrder;
  }

  return null;
};
