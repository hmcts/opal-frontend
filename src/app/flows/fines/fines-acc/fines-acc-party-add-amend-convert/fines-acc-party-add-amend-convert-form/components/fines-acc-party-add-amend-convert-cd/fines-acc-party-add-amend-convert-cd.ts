import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { AbstractNestedFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-nested-form-base';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';

/**
 * Contact details sub-component for the fines account party add/amend/convert form.
 *
 * This component extends AbstractNestedFormBaseComponent which provides the infrastructure
 * for handling form and formControlErrorMessages from the parent component.
 *
 * The parent component is the single source of truth for field error templates and computed messages.
 * This sub-form only receives `form` and `formControlErrorMessages` and does not emit error maps.
 */
@Component({
  selector: 'app-fines-acc-party-add-amend-convert-cd',
  imports: [ReactiveFormsModule, GovukTextInputComponent],
  templateUrl: './fines-acc-party-add-amend-convert-cd.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccPartyAddAmendConvertCd extends AbstractNestedFormBaseComponent {
  @Input({ required: true }) public override form!: FormGroup;
  @Input({ required: true }) public override formControlErrorMessages!: IAbstractFormControlErrorMessage;
}
