import { IGovUkSelectOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-select/interfaces';

export interface IFinesAccEnfActionAddResultParam {
  name: string;
  prompt: string;
  type: string;
  mandatory?: boolean | string;
  min?: number | string;
  max?: number | string;
  hint?: string;
  options?: string[] | IGovUkSelectOptions[] | Record<string, string>;
  apidata?: string;
  language_dependent?: boolean | string;
}
