import type { IFinesFinanceInterfaceFilesForm } from '../../interfaces/fines-finance-interface-files-form.interface';

export interface IFinesFinanceInboundFilesForm extends IFinesFinanceInterfaceFilesForm {
  fileType: string | null;
  source: string | null;
}
