interface IGovUkRadioDataConditional {
  inputName: string;
  inputClasses: string;
  inputId: string;
  inputLabel: string;
}
export interface IGovUkRadioData {
  inputName: string;
  inputClasses?: string | null;
  inputId: string;
  inputValue: string;
  inputLabel: string;
  inputTextDivider?: string | null;
  inputHint?: string | null;
  conditional: IGovUkRadioDataConditional;
}
