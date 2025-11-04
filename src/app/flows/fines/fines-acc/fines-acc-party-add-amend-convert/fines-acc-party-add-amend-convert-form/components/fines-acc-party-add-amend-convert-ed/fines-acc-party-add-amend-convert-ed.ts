import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { AbstractNestedFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-nested-form-base';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';

@Component({
  selector: 'app-fines-acc-party-add-amend-convert-ed',
  imports: [ReactiveFormsModule, GovukTextInputComponent, CapitalisationDirective],
  templateUrl: './fines-acc-party-add-amend-convert-ed.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
//Employer details sub-component for the fines account party add/amend/convert form.
export class FinesAccPartyAddAmendConvertEd extends AbstractNestedFormBaseComponent {
  @Input({ required: true }) public override form!: FormGroup;
  @Input({ required: true }) public override formControlErrorMessages!: IAbstractFormControlErrorMessage;
}
