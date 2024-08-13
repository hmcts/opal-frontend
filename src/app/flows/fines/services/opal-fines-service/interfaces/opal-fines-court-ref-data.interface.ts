interface IOpalFinesCourt {
  courtId: number;
  courtCode: number;
  name: string;
  nameCy: string | null;
  nationalCourtCode: string | null;
  businessUnitId: number;
}

export interface IOpalFinesCourtRefData {
  count: number;
  refData: IOpalFinesCourt[];
}
