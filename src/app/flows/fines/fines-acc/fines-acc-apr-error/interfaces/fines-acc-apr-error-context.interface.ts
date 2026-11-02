export interface IFinesAccAprErrorContext {
  accountId: number;
  action: 'add' | 'edit';
  referenceId?: number;
  text: string;
  message: string;
}
