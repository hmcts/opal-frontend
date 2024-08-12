interface IGovUkCheckboxInputConditional {
  inputName: string;
  inputClasses: string;
  inputId: string;
  inputLabel: string;
}
export interface IGovUkCheckboxInput {
  inputName: string;
  inputClasses?: string | null;
  inputId: string;
  inputValue: string;
  inputLabel: string;
  inputTextDivider?: string | null;
  inputHint?: string | null;
  conditional?: IGovUkCheckboxInputConditional;
}
