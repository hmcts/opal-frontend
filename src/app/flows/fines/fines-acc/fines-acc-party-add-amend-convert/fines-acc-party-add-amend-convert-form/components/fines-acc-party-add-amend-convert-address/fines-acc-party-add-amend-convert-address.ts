import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { AbstractNestedFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-nested-form-base';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';

@Component({
  selector: 'app-fines-acc-party-add-amend-convert-address',
  imports: [ReactiveFormsModule, GovukTextInputComponent, CapitalisationDirective],
  templateUrl: './fines-acc-party-add-amend-convert-address.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccPartyAddAmendConvertAddress extends AbstractNestedFormBaseComponent {
  @Input({ required: true }) public override form!: FormGroup;
  @Input({ required: true }) public override formControlErrorMessages!: IAbstractFormControlErrorMessage;
}
