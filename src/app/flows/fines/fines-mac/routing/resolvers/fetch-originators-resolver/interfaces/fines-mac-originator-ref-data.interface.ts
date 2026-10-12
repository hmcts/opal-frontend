export interface IFinesMacOriginator {
  originatorId: number;
  name: string;
  displayName: string;
}

export interface IFinesMacOriginatorRefData {
  count: number;
  refData: IFinesMacOriginator[];
}
