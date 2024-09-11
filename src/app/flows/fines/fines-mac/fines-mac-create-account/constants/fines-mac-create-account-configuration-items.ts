import { OPAL_FINES_CONFIGURATION_ITEMS } from '@services/fines/opal-fines-service/constants/opal-fines-configuration-items.constant';
import { IFinesMacCreateAccountConfigurationItems } from '../interfaces/fines-mac-create-account-configuration-items.interface';

export const FINES_MAC_CREATE_ACCOUNT_CONFIGURATION_ITEMS: IFinesMacCreateAccountConfigurationItems = {
  ...OPAL_FINES_CONFIGURATION_ITEMS,
};
