import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { AbstractNestedFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-nested-form-base';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';
import { GovukSelectComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-select';
import { IGovUkSelectOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-select/interfaces';

/**
 * Party Details sub-component for the fines account party add/amend/convert form.
 *
 * This component extends AbstractNestedFormBaseComponent which provides the infrastructure
 * for handling form and formControlErrorMessages from the parent component.
 *
 * The parent component is the single source of truth for field error templates and computed messages.
 * This sub-form only receives `form` and `formControlErrorMessages` and does not emit error maps.
 */
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
