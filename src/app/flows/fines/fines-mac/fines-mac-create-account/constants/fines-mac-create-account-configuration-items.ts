import { OPAL_FINES_CONFIGURATION_ITEMS } from '@services/fines/opal-fines-service/constants/opal-fines-configuration-items.constant';
import { IOpalFinesConfigurationItems } from '@services/fines/opal-fines-service/interfaces/opal-fines-configuration-items.interface';

export const FINES_MAC_CREATE_ACCOUNT_CONFIGURATION_ITEMS: IOpalFinesConfigurationItems =
  structuredClone(OPAL_FINES_CONFIGURATION_ITEMS);
