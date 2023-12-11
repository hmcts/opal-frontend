export interface IAccountEnquiryStateSearch {
  court: string | null;
  surname: string | null;
  forename: string | null;
  initials: string | null;
  dateOfBirth: {
    dayOfBirth: string | null;
    monthOfBirth: string | null;
    yearOfBirth: string | null;
  };
  addressLineOne: string | null;
  niNumber: string | null;
  pcr: string | null;
}
export interface IAccountEnquiryState {
  search: IAccountEnquiryStateSearch | null;
}
