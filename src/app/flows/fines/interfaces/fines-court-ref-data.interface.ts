interface IFinesCourt {
  courtId: number;
  courtCode: number;
  name: string;
  nameCy: string | null;
  nationalCourtCode: string | null;
  businessUnitId: number;
}

export interface IFinesCourtRefData {
  count: number;
  refData: IFinesCourt[];
}
