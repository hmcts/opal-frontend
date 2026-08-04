import {IFinesExternalBankingRoutingPaths} from '@app/flows/fines/interfaces/fines-external-banking.interface'

export const FINES_EXTERNAL_BANKING_PATHS: IFinesExternalBankingRoutingPaths = {
  root: 'fines',
  children: {
    search: 'search',
    finance: 'finance',
    inbound: 'inbound-files',
    outbound: 'outbound-files',
    variantbankingfiles: 'variant-banking-files',
    upload: 'upload',
  },
};