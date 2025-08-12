import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';

@Component({
  selector: 'app-fines-sa-search-account-form-companies',
  imports: [GovukTextInputComponent, GovukCheckboxesComponent, GovukCheckboxesItemComponent],
  templateUrl: './fines-sa-search-account-form-companies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchAccountFormCompaniesComponent extends AbstractFormBaseComponent {
  @Input({ required: true }) public override form!: FormGroup;
  @Input({ required: true }) public override formControlErrorMessages!: IAbstractFormControlErrorMessage;
}
