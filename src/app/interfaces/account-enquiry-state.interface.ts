export interface IAccountEnquiryState {
  search: {
    courts: string;
    surname: string;
    forename: string;
    initials: string;
    dateOfBirth: {
      dayOfBirth: string;
      monthOfBirth: string;
      yearOfBirth: string;
    };
    addressLineOne: string;
    niNumber: string;
    pcr: string;
  } | null;
}
