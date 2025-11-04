import { ChangeDetectionStrategy, Component, Input, inject, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { AbstractNestedFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-nested-form-base';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';
import { GovukSelectComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-select';
import { IGovUkSelectOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-select/interfaces';

@Component({
  selector: 'app-fines-acc-party-add-amend-convert-party-details',
  imports: [ReactiveFormsModule, GovukTextInputComponent, CapitalisationDirective, GovukSelectComponent],
  templateUrl: './fines-acc-party-add-amend-convert-party-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccPartyAddAmendConvertPartyDetails extends AbstractNestedFormBaseComponent {
  @Input({ required: true }) public override form!: FormGroup;
  @Input({ required: true }) public override formControlErrorMessages!: IAbstractFormControlErrorMessage;
  @Input({ required: true }) public isCompanyPartyType!: boolean;
  @Input({ required: true }) public isIndividualPartyType!: boolean;
  @Input({ required: true }) public titleOptions!: IGovUkSelectOptions[];
}
