import { IFinesAccountTypes } from '../../interfaces/fines-account-types.interface';
import { IFinesMacCourtDetailsCopy } from '../interfaces/fines-mac-court-details-copy.interface';

export const FINES_MAC_COURT_DETAILS_COPY_BY_ACCOUNT_TYPE: Record<keyof IFinesAccountTypes, IFinesMacCourtDetailsCopy> =
  {
    Fine: {
      sectionHeading: 'Court details',
      taskListLabel: 'Court details',
      reviewCardTitle: 'Court details',
      changeLinkHiddenText: 'Court details',
      originatorLabel: 'Sending area or Local Justice Area (LJA)',
      originatorHint: 'Search using the code or name of the area that sent the transfer',
      originatorRequiredError: 'Enter a sending area or Local Justice Area',
    },
    'Fixed Penalty': {
      sectionHeading: 'Court details',
      taskListLabel: 'Court details',
      reviewCardTitle: 'Issuing authority and court details',
      changeLinkHiddenText: 'Issuing authority and court details',
      originatorLabel: 'Sending area or Local Justice Area (LJA)',
      originatorHint: 'Search using the code or name of the area that sent the transfer',
      originatorRequiredError: 'Enter a sending area or Local Justice Area',
    },
    'Conditional Caution': {
      sectionHeading: 'Police and court details',
      taskListLabel: 'Police and court details',
      reviewCardTitle: 'Police and court details',
      changeLinkHiddenText: 'Police and court details',
      originatorLabel: 'Sending police force',
      originatorHint: 'Search using the code or name of the sending police force that sent the caution',
      originatorRequiredError: 'Enter a sending police force',
    },
  };
