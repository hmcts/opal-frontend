export interface IAccountEnquiryStateSearch {
  court: string | null;
  surname: string | null;
  forename: string | null;
  initials: string | null;
  dateOfBirth: {
    dayOfMonth: string | null;
    monthOfYear: string | null;
    year: string | null;
  };
  addressLineOne: string | null;
  niNumber: string | null;
  pcr: string | null;
}
export interface IAccountEnquiryState {
  search: IAccountEnquiryStateSearch;
}
