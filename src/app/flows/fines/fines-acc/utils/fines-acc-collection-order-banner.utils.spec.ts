import { describe, expect, it } from 'vitest';
import { FINES_ACCOUNT_TYPES } from '../../constants/fines-account-types.constant';
import { FINES_ACC_DEBTOR_TYPES } from '../constants/fines-acc-debtor-types.constant';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { getFinesAccCollectionOrderBannerMessage } from './fines-acc-collection-order-banner.utils';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { FINES_ACC_COLLECTION_ORDER_BANNER_MESSAGES } from '../constants/fines-acc-collection-order-banner-messages.constant';

/**
 * Builds a defendant account header test fixture with adult account defaults.
 *
 * @param overrides - Header fields to override for a specific rule branch.
 * @returns A defendant account header fixture for Collection Order banner tests.
 */
const buildHeader = (
  overrides: Partial<IOpalFinesAccountDefendantDetailsHeader> = {},
): IOpalFinesAccountDefendantDetailsHeader => {
  return {
    ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
    debtor_type: FINES_ACC_DEBTOR_TYPES.defendant,
    is_youth: false,
    collection_order: true,
    party_details: {
      ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.party_details),
      organisation_flag: false,
    },
    ...overrides,
  };
};

describe('getFinesAccCollectionOrderBannerMessage', () => {
  it('should return B09 when an adult account has no Collection Order', () => {
    const header = buildHeader({ collection_order: false });

    expect(getFinesAccCollectionOrderBannerMessage(header)).toBe(
      FINES_ACC_COLLECTION_ORDER_BANNER_MESSAGES.noCollectionOrder,
    );
  });

  it('should return B09 when a Parent or Guardian to pay account has no Collection Order', () => {
    const header = buildHeader({
      collection_order: false,
      debtor_type: FINES_ACC_DEBTOR_TYPES.parentGuardian,
      is_youth: true,
    });

    expect(getFinesAccCollectionOrderBannerMessage(header)).toBe(
      FINES_ACC_COLLECTION_ORDER_BANNER_MESSAGES.noCollectionOrder,
    );
  });

  it('should return B10 when a youth account has a Collection Order', () => {
    const header = buildHeader({
      collection_order: true,
      is_youth: true,
    });

    expect(getFinesAccCollectionOrderBannerMessage(header)).toBe(
      FINES_ACC_COLLECTION_ORDER_BANNER_MESSAGES.youthWithCollectionOrder,
    );
  });

  it('should return B10 when a company account has a Collection Order', () => {
    const header = buildHeader({
      collection_order: true,
      party_details: {
        ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.party_details),
        organisation_flag: true,
      },
    });

    expect(getFinesAccCollectionOrderBannerMessage(header)).toBe(
      FINES_ACC_COLLECTION_ORDER_BANNER_MESSAGES.companyWithCollectionOrder,
    );
  });

  it('should return B10 when a Conditional Caution account has a Collection Order', () => {
    const header = buildHeader({
      collection_order: true,
      account_type: FINES_ACCOUNT_TYPES['Conditional Caution'],
    });

    expect(getFinesAccCollectionOrderBannerMessage(header)).toBe(
      FINES_ACC_COLLECTION_ORDER_BANNER_MESSAGES.conditionalCautionWithCollectionOrder,
    );
  });

  it('should not return a banner when an adult account has a Collection Order', () => {
    const header = buildHeader({ collection_order: true });

    expect(getFinesAccCollectionOrderBannerMessage(header)).toBeNull();
  });

  it('should not return a banner when a youth account has no Collection Order', () => {
    const header = buildHeader({
      collection_order: false,
      is_youth: true,
    });

    expect(getFinesAccCollectionOrderBannerMessage(header)).toBeNull();
  });

  it('should not return a banner when collection_order is unavailable', () => {
    const header = buildHeader({ collection_order: null });

    expect(getFinesAccCollectionOrderBannerMessage(header)).toBeNull();
  });
});
