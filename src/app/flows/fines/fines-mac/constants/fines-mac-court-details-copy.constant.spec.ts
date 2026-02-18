import { describe, expect, it } from 'vitest';
import { FINES_ACCOUNT_TYPES } from '../../constants/fines-account-types.constant';
import { FINES_MAC_COURT_DETAILS_COPY_BY_ACCOUNT_TYPE } from './fines-mac-court-details-copy.constant';

describe('FINES_MAC_COURT_DETAILS_COPY_BY_ACCOUNT_TYPE', () => {
  it('should return the default fine copy values', () => {
    const copy =
      FINES_MAC_COURT_DETAILS_COPY_BY_ACCOUNT_TYPE[FINES_ACCOUNT_TYPES.Fine as keyof typeof FINES_ACCOUNT_TYPES];

    expect(copy.sectionHeading).toBe('Court details');
    expect(copy.reviewCardTitle).toBe('Court details');
    expect(copy.originatorLabel).toBe('Sending area or Local Justice Area (LJA)');
    expect(copy.originatorRequiredError).toBe('Enter a sending area or Local Justice Area');
  });

  it('should return the fixed penalty review card title override', () => {
    const copy =
      FINES_MAC_COURT_DETAILS_COPY_BY_ACCOUNT_TYPE[
        FINES_ACCOUNT_TYPES['Fixed Penalty'] as keyof typeof FINES_ACCOUNT_TYPES
      ];

    expect(copy.reviewCardTitle).toBe('Issuing authority and court details');
    expect(copy.changeLinkHiddenText).toBe('Issuing authority and court details');
    expect(copy.originatorLabel).toBe('Sending area or Local Justice Area (LJA)');
  });

  it('should return the conditional caution copy values', () => {
    const copy =
      FINES_MAC_COURT_DETAILS_COPY_BY_ACCOUNT_TYPE[
        FINES_ACCOUNT_TYPES['Conditional Caution'] as keyof typeof FINES_ACCOUNT_TYPES
      ];

    expect(copy.sectionHeading).toBe('Police and court details');
    expect(copy.taskListLabel).toBe('Police and court details');
    expect(copy.reviewCardTitle).toBe('Police and court details');
    expect(copy.originatorLabel).toBe('Sending police force');
    expect(copy.originatorHint).toBe('Search using the code or name of the sending police force that sent the caution');
    expect(copy.originatorRequiredError).toBe('Enter a sending police force');
  });
});
