import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AbstractNestedFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-nested-form-base';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';

/**
 * Language preference sub-component for the fines account party add/amend/convert form.
 *
 * This component extends AbstractNestedFormBaseComponent which provides the infrastructure
 * for handling form and formControlErrorMessages from the parent component.
 *
 * The parent component is the single source of truth for field error templates and computed messages.
 * This sub-form only receives `form` and `formControlErrorMessages` and does not emit error maps.
 */
@Component({
  selector: 'app-fines-acc-party-add-amend-convert-lp',
  imports: [ReactiveFormsModule, GovukRadioComponent, GovukRadiosItemComponent],
  templateUrl: './fines-acc-party-add-amend-convert-lp.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccPartyAddAmendConvertLp extends AbstractNestedFormBaseComponent {
  @Input({ required: true }) public override form!: FormGroup;
  @Input({ required: true }) public override formControlErrorMessages!: IAbstractFormControlErrorMessage;
  @Input({ required: true }) public languageOptions!: { key: string; value: string }[];
}
