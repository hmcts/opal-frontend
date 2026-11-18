import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukTextAreaComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-area';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { requiredTrimmed } from '../../fines-mci-create-till-court-fee-payment-details/validators/fines-mci-payment-details.validators';
import { FINES_MCI_COURT_FEE_CHECK_FIELD_ERRORS } from '../constants/fines-mci-court-fee-check-field-errors.constant';

@Component({
  selector: 'app-fines-mci-create-till-court-fee-check-form',
  imports: [ReactiveFormsModule, GovukErrorSummaryComponent, GovukTextAreaComponent, GovukButtonComponent],
  templateUrl: './fines-mci-create-till-court-fee-check-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillCourtFeeCheckFormComponent extends AbstractFormBaseComponent implements OnInit {
  protected override fieldErrors = FINES_MCI_COURT_FEE_CHECK_FIELD_ERRORS;
  @Input() public initialNote = '';
  @Input() public saveUnavailable = false;
  @Output() public noteChanged = new EventEmitter<string>();

  /** Initialises the note control and keeps its draft in sync with the parent. */
  private setupForm(): void {
    this.form = new FormGroup({
      suspenseNote: new FormControl(this.initialNote, {
        nonNullable: true,
        validators: [requiredTrimmed, Validators.maxLength(1000)],
      }),
    });
    this.setInitialErrorMessages();
    this.form.controls['suspenseNote'].valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value: string) => {
      this.noteChanged.emit(value);
    });
  }

  /** Sets up validation and shared form behaviour. */
  public override ngOnInit(): void {
    this.setupForm();
    super.ngOnInit();
  }
}
