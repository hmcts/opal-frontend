import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';

export type IFinesMacPaymentTermsPermissions = Record<(typeof FINES_PERMISSIONS)['collection-order'], boolean>;
