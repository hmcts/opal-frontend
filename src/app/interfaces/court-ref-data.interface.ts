interface Court {
  courtId: number;
  courtCode: number;
  name: string;
  nameCy: string | null;
  nationalCourtCode: string | null;
  businessUnitId: number;
}

export interface ICourtRefData {
  count: number;
  refData: Court[];
}
