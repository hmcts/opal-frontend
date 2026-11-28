export interface IFinesMacOriginator {
  originatorId: string | number;
  name: string;
  displayName: string;
}

export interface IFinesMacOriginatorRefData {
  count: number;
  refData: IFinesMacOriginator[];
}
