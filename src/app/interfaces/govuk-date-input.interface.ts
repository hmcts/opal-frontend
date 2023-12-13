interface IDateInput {
  inputName: string;
  inputClasses: string;
  inputId: string;
  inputLabel: string;
}
export interface IGovUkDateInput {
  day: IDateInput;
  month: IDateInput;
  year: IDateInput;
}
