import { IGovUkSelectOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-select/interfaces';
import { TFinesAccEnfActionAddFieldType } from '../types/fines-acc-enf-action-add-field-type.type';

export interface IFinesAccEnfActionAddFormField {
  controlName: string;
  parameterName: string;
  label: string;
  type: TFinesAccEnfActionAddFieldType;
  required: boolean;
  min?: number | string;
  max?: number | string;
  hint?: string;
  options: IGovUkSelectOptions[];
  checkboxControls?: { controlName: string; option: IGovUkSelectOptions }[];
  apidata?: string;
  welshControlName?: string;
  welshLabel?: string;
}
