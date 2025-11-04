import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { AbstractNestedFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-nested-form-base';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { MojTicketPanelComponent } from '@hmcts/opal-frontend-common/components/moj/moj-ticket-panel';
import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';

/**
 * Date of Birth and National Insurance sub-component for the fines account party add/amend/convert form.
 *
 * This component extends AbstractNestedFormBaseComponent which provides the infrastructure
 * for handling form and formControlErrorMessages from the parent component.
 *
 * The parent component is the single source of truth for field error templates and computed messages.
 * This sub-form only receives `form` and `formControlErrorMessages` and does not emit error maps.
 */
@Component({
  selector: 'app-fines-acc-party-add-amend-convert-dob-ni',
  imports: [
    ReactiveFormsModule,
    GovukTextInputComponent,
    MojDatePickerComponent,
    MojTicketPanelComponent,
    CapitalisationDirective,
  ],
  templateUrl: './fines-acc-party-add-amend-convert-dob-ni.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccPartyAddAmendConvertDobNi extends AbstractNestedFormBaseComponent {
  @Input({ required: true }) public override form!: FormGroup;
  @Input({ required: true }) public override formControlErrorMessages!: IAbstractFormControlErrorMessage;
  @Input({ required: true }) public yesterday!: string;
  @Input({ required: true }) public age!: number;
  @Input({ required: true }) public ageLabel!: string;
}
