import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX } from './constants/fines-sa-search-account-form-minor-creditors-controls.constant';
import { Subject, takeUntil } from 'rxjs';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
  GovukRadiosConditionalComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { FINES_MINOR_CREDITOR_TYPES } from 'src/app/flows/fines/constants/fines-minor-creditor-types.constant';
import { IGovUkRadioOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fines-sa-search-account-form-minor-creditors',
  imports: [
    CommonModule,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukRadiosConditionalComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukTextInputComponent,
  ],
  templateUrl: './fines-sa-search-account-form-minor-creditors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchAccountFormMinorCreditorsComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public form!: FormGroup;
  @Input({ required: true }) public formControlErrorMessages!: IAbstractFormControlErrorMessage;

  private readonly ngUnsubscribe = new Subject<void>();
  private readonly prefix = FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX;
  private readonly finesMinorCreditorTypes = FINES_MINOR_CREDITOR_TYPES;
  public readonly minorCreditorTypes: IGovUkRadioOptions[] = Object.entries(this.finesMinorCreditorTypes).map(
    ([key, value]) => ({
      key,
      value,
    }),
  );

  private getIndividualMinorCreditorControls() {
    return {
      lastNameControl: this.form.get(`${this.prefix}last_name`),
      lastNameExactMatchControl: this.form.get(`${this.prefix}last_name_exact_match`),
      firstNamesControl: this.form.get(`${this.prefix}first_names`),
      firstNamesExactMatchControl: this.form.get(`${this.prefix}first_names_exact_match`),
    };
  }

  private getCompanyMinorCreditorControls() {
    return {
      companyNameControl: this.form.get(`${this.prefix}company_name`),
      companyNameExactMatchControl: this.form.get(`${this.prefix}company_name_exact_match`),
    };
  }

  private getAddressControls() {
    return {
      addressLine1Control: this.form.get(`${this.prefix}address_line_1`),
      postCodeControl: this.form.get(`${this.prefix}post_code`),
    };
  }

  private getMinorCreditorType() {
    return this.form.get(`${this.prefix}minor_creditor_type`);
  }

  private handleMinorCreditorTypeChange(): void {
    const minorCreditorTypeControl = this.getMinorCreditorType();
    if (!minorCreditorTypeControl) return;

    const isIndividual = minorCreditorTypeControl.value === 'individual';
    const isCompany = minorCreditorTypeControl.value === 'company';

    const individualControls = this.getIndividualMinorCreditorControls();
    const companyControls = this.getCompanyMinorCreditorControls();
    const addressControls = this.getAddressControls();

    if (isCompany) {
      Object.values(individualControls).forEach((control) => {
        control?.reset(null, { emitEvent: false });
        control?.updateValueAndValidity();
      });
    }
    if (isIndividual) {
      Object.values(companyControls).forEach((control) => {
        control?.reset(null, { emitEvent: false });
        control?.updateValueAndValidity();
      });
    }

    Object.values(addressControls).forEach((control) => {
      control?.reset(null, { emitEvent: false });
      control?.updateValueAndValidity();
    });

    this.validateMinorCreditorGroup();
  }

  private setupMinorCreditorTypeChangeListener(): void {
    const minorCreditorTypeControl = this.getMinorCreditorType();
    if (!minorCreditorTypeControl) return;

    minorCreditorTypeControl.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.handleMinorCreditorTypeChange();
      this.setupMinorCreditorTypeChangeListener();
    });
  }

  private validateMinorCreditorGroup(): void {
    const type = this.getMinorCreditorType()?.value;

    if (type === 'individual') {
      const { lastNameControl, firstNamesControl } = this.getIndividualMinorCreditorControls();
      const { addressLine1Control, postCodeControl } = this.getAddressControls();

      const isEmpty =
        !lastNameControl?.value?.trim() &&
        !firstNamesControl?.value?.trim() &&
        !addressLine1Control?.value?.trim() &&
        !postCodeControl?.value?.trim();

      if (isEmpty) {
        const existingErrors = lastNameControl?.errors || {};
        if (!existingErrors['requiredIndividualMinorCreditorData']) {
          lastNameControl?.setErrors({ ...existingErrors, requiredIndividualMinorCreditorData: true });
        }
      } else {
        const { requiredIndividualMinorCreditorData, ...remainingErrors } = lastNameControl?.errors || {};
        if (Object.keys(remainingErrors).length > 0) {
          lastNameControl?.setErrors(remainingErrors);
        } else {
          lastNameControl?.setErrors(null);
        }
        lastNameControl?.updateValueAndValidity({ onlySelf: true });
      }
    }

    if (type === 'company') {
      const { companyNameControl } = this.getCompanyMinorCreditorControls();
      const { addressLine1Control, postCodeControl } = this.getAddressControls();

      const isEmpty =
        !companyNameControl?.value?.trim() && !addressLine1Control?.value?.trim() && !postCodeControl?.value?.trim();

      if (isEmpty) {
        companyNameControl?.setErrors({ requiredCompanyMinorCreditorData: true });
      } else {
        if (companyNameControl?.hasError('requiredCompanyMinorCreditorData')) {
          companyNameControl.setErrors(null);
          companyNameControl.updateValueAndValidity({ onlySelf: true });
        }
      }
    }
  }

  private setupForm(): void {
    this.setupMinorCreditorTypeChangeListener();
  }

  public ngOnInit(): void {
    this.setupForm();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
