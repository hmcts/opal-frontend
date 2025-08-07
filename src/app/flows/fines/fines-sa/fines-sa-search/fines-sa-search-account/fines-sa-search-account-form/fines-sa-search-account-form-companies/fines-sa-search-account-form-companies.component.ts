import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS_PREFIX } from './constants/fines-sa-search-account-form-companies-controls.constant';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-fines-sa-search-account-form-companies',
  imports: [GovukTextInputComponent, GovukCheckboxesComponent, GovukCheckboxesItemComponent],
  templateUrl: './fines-sa-search-account-form-companies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchAccountFormCompaniesComponent implements OnInit, OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly prefix = FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS_PREFIX;

  @Input({ required: true }) public form!: FormGroup;
  @Input({ required: true }) public formControlErrorMessages!: IAbstractFormControlErrorMessage;

  /**
   * Gets the first names, last name, and date of birth controls from the form.
   * @returns Object containing references to the individual name-related controls.
   */
  private getCompanyNameControls() {
    return {
      companyNameControl: this.form.get(`${this.prefix}company_name`),
      companyNameExactMatchControl: this.form.get(`${this.prefix}company_name_exact_match`),
      includeAliasesControl: this.form.get(`${this.prefix}include_aliases`),
    };
  }

  /**
   * Applies conditional validation to the last name field.
   * If either first names or date of birth is populated and last name is not, last name becomes required.
   */
  private handleConditionalValidation(): void {
    const { companyNameControl, companyNameExactMatchControl, includeAliasesControl } = this.getCompanyNameControls();
    const companyControlsHaveValue = !companyNameControl || !companyNameExactMatchControl || !includeAliasesControl;
    
    if (companyControlsHaveValue) {
      return;
    }

    const companyNameHasValue = !!companyNameControl?.value?.trim();
    const companyNameExactMatchHasValue = !!companyNameExactMatchControl?.value;
    const includeAliasesHasValue = !!includeAliasesControl?.value;

    //Company Name Validation
    const shouldRequireCompanyName = (companyNameExactMatchHasValue || includeAliasesHasValue) && !companyNameHasValue;

    // Updating last name control validators
    if (shouldRequireCompanyName) {
      companyNameControl.addValidators(Validators.required);
    } else {
      companyNameControl.removeValidators(Validators.required);
    }
    companyNameControl.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Sets up subscriptions to watch first names and date of birth fields.
   * Triggers conditional validation on the last name field when either changes.
   */
  private setupConditionalValidation(): void {
    const { companyNameControl, companyNameExactMatchControl, includeAliasesControl } = this.getCompanyNameControls();
    const companyControlsHaveValue = !companyNameControl || !companyNameExactMatchControl || !includeAliasesControl;

    if (companyControlsHaveValue) return;

    companyNameControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.handleConditionalValidation());

    companyNameExactMatchControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.handleConditionalValidation());

    includeAliasesControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.handleConditionalValidation());
  }

  /**
   * Angular lifecycle hook - initialises conditional validation and computes yesterday’s date.
   */
  public ngOnInit(): void {
    this.setupConditionalValidation();
  }

  /**
   * Angular lifecycle hook - tears down subscriptions when the component is destroyed.
   */
  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
