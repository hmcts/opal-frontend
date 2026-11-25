import { IOpalFinesMapping } from '@services/fines/opal-fines-service/interfaces/opal-fines-mapping.interface';

export interface IFinesMciPaymentMappings {
  methods: IOpalFinesMapping[];
  sources: IOpalFinesMapping[];
}
