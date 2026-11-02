import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { IFinesAccAprFormState } from './fines-acc-apr-form.interface';
import { FINES_ACC_APR_FIELD_ERRORS } from './fines-acc-apr-field-errors.constant';

@Component({
  selector: 'app-fines-acc-apr-form',
  imports: [
    ReactiveFormsModule,
    GovukHeadingWithCaptionComponent,
    GovukTextInputComponent,
    GovukErrorSummaryComponent,
    GovukButtonComponent,
    GovukCancelLinkComponent,
  ],
  templateUrl: './fines-acc-apr-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAprFormComponent extends AbstractFormBaseComponent implements OnChanges {
  protected override fieldErrors = FINES_ACC_APR_FIELD_ERRORS;

  @Input() public initialValue = '';
  @Input() public savedValue: string | null = null;
  @Input() public contextKey: unknown;
  @Input() public accountCaption = '';
  @Input() public headingText = 'Add Alternate Payment Reference';
  @Input() public labelText = 'Enter payment reference';
  @Input() public pending = false;
  @Output() public override formSubmit = new EventEmitter<IAbstractFormBaseForm<IFinesAccAprFormState>>();
  @Output() public readonly cancelRequested = new EventEmitter<void>();

  public override readonly form = new FormGroup({
    apr_text: new FormControl('', {
      nonNullable: true,
      validators: [
        (control) => (typeof control.value === 'string' && control.value.trim() ? null : { required: true }),
        Validators.maxLength(18),
      ],
    }),
  });

  protected override hasUnsavedChanges(): boolean {
    return this.form.controls.apr_text.value !== (this.savedValue ?? this.initialValue);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValue'] || changes['contextKey'] || changes['savedValue']) {
      this.form.reset({ apr_text: this.initialValue }, { emitEvent: false });
      this.formSubmitted = false;
      this.setInitialErrorMessages();
      this.unsavedChanges.emit(this.hasUnsavedChanges());
    }
  }

  public override ngOnInit(): void {
    this.setInitialErrorMessages();
    super.ngOnInit();
  }

  public override handleFormSubmit(event: SubmitEvent): void {
    event.preventDefault();
    if (!this.pending) super.handleFormSubmit(event);
  }
}
