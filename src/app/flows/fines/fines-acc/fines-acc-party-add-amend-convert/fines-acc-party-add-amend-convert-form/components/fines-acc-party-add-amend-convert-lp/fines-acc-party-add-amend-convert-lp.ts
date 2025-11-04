import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AbstractNestedFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-nested-form-base';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';

@Component({
  selector: 'app-fines-acc-party-add-amend-convert-lp',
  imports: [ReactiveFormsModule, GovukRadioComponent, GovukRadiosItemComponent],
  templateUrl: './fines-acc-party-add-amend-convert-lp.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccPartyAddAmendConvertLp extends AbstractNestedFormBaseComponent {
  @Input({ required: true }) public override form!: FormGroup;
  @Input({ required: true }) public override formControlErrorMessages!: IAbstractFormControlErrorMessage;
  @Input({ required: true }) public languageOptions!: { key: string; value: string }[];
}
