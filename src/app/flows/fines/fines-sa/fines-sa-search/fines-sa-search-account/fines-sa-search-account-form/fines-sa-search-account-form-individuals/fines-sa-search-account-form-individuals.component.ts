import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { takeUntil } from 'rxjs';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS_PREFIX } from './constants/fines-sa-search-account-form-individuals-controls.constant';

@Component({
  selector: 'app-fines-sa-search-account-form-individuals',
  imports: [GovukTextInputComponent, GovukCheckboxesComponent, GovukCheckboxesItemComponent, MojDatePickerComponent],
  templateUrl: './fines-sa-search-account-form-individuals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchAccountFormIndividualsComponent extends AbstractFormBaseComponent {
  private readonly prefix = FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS_PREFIX;
  protected readonly dateService = inject(DateService);

  @Input({ required: true }) public override form!: FormGroup;
  @Input({ required: true }) public override formControlErrorMessages!: IAbstractFormControlErrorMessage;
  @Output() public setDateOfBirth = new EventEmitter<string>();
  public yesterday!: string;

  /**
   * Gets the first names, last name, and date of birth controls from the form.
   * @returns Object containing references to the individual name-related controls.
   */
  private getIndividualNameControls() {
    return {
      firstNamesControl: this.form.get(`${this.prefix}first_names`),
      dobControl: this.form.get(`${this.prefix}date_of_birth`),
      lastNameControl: this.form.get(`${this.prefix}last_name`),
      firstNamesExactMatchControl: this.form.get(`${this.prefix}first_names_exact_match`),
      lastNameExactMatchControl: this.form.get(`${this.prefix}last_name_exact_match`),
      includeAliasesControl: this.form.get(`${this.prefix}include_aliases`),
    };
  }

  /**
   * Applies conditional validation to the last name field.
   * If either first names or date of birth is populated and last name is not, last name becomes required.
   */
  private handleConditionalValidation(): void {
    const {
      firstNamesControl,
      dobControl,
      lastNameControl,
      firstNamesExactMatchControl,
      lastNameExactMatchControl,
      includeAliasesControl,
    } = this.getIndividualNameControls();

    if (
      !firstNamesControl ||
      !dobControl ||
      !lastNameControl ||
      !firstNamesExactMatchControl ||
      !lastNameExactMatchControl ||
      !includeAliasesControl
    ) {
      return;
    }

    const firstNamesHasValue = !!firstNamesControl?.value?.trim();
    const dobHasValue = !!dobControl?.value?.trim();
    const lastNameHasValue = !!lastNameControl?.value?.trim();
    const firstNamesExactMatchHasValue = !!firstNamesExactMatchControl?.value;
    const lastNameExactMatchHasValue = !!lastNameExactMatchControl?.value;
    const includeAliasesHasValue = !!includeAliasesControl?.value;

    //Last name Validation
    const requireByNameOrDob = firstNamesHasValue || dobHasValue;
    const requireByOtherFlags = lastNameExactMatchHasValue || includeAliasesHasValue;
    const shouldRequireLastName = (requireByNameOrDob || requireByOtherFlags) && !lastNameHasValue;

    //First name Validation
    const requireFirstName = firstNamesExactMatchHasValue && !firstNamesHasValue;

    // Updating last name control validators
    if (shouldRequireLastName) {
      lastNameControl.addValidators(Validators.required);
    } else {
      lastNameControl.removeValidators(Validators.required);
    }
    lastNameControl.updateValueAndValidity({ emitEvent: false });

    //Updating first names control Validators
    if (requireFirstName) {
      firstNamesControl.addValidators(Validators.required);
    } else {
      firstNamesControl.removeValidators(Validators.required);
    }
    firstNamesControl.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Sets up subscriptions to watch first names and date of birth fields.
   * Triggers conditional validation on the last name field when either changes.
   */
  private setupConditionalValidation(): void {
    const {
      firstNamesControl,
      dobControl,
      firstNamesExactMatchControl,
      lastNameExactMatchControl,
      includeAliasesControl,
    } = this.getIndividualNameControls();
    if (
      !firstNamesControl ||
      !dobControl ||
      !firstNamesExactMatchControl ||
      !lastNameExactMatchControl ||
      !includeAliasesControl
    )
      return;

    firstNamesControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.handleConditionalValidation());

    dobControl.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => this.handleConditionalValidation());

    firstNamesExactMatchControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.handleConditionalValidation());

    lastNameExactMatchControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.handleConditionalValidation());

    includeAliasesControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.handleConditionalValidation());
  }

  /**
   * Angular lifecycle hook - initialises conditional validation and computes yesterday’s date.
   */
  public override ngOnInit(): void {
    this.setupConditionalValidation();
    this.yesterday = this.dateService.getPreviousDate({ days: 1 });
    super.ngOnInit();
  }
}
