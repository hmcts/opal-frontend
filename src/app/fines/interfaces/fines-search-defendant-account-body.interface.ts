export interface IFinesSearchDefendantAccountBody {
  court: string | null;
  surname: string | null;
  forename: string | null;
  initials: string | null;
  dateOfBirth: {
    dayOfMonth: string | null;
    monthOfYear: string | null;
    year: string | null;
  };
  addressLine: string | null;
  niNumber: string | null;
  pcr: string | null;
}
