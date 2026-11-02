export interface IFinesAccAprErrorContext {
  accountId: number;
  action: 'add' | 'change';
  referenceId?: number;
  text: string;
  message: string;
}
