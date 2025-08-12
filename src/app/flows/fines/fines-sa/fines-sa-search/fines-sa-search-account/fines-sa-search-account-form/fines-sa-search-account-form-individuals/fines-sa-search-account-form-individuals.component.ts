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

@Component({
  selector: 'app-fines-sa-search-account-form-individuals',
  imports: [GovukTextInputComponent, GovukCheckboxesComponent, GovukCheckboxesItemComponent, MojDatePickerComponent],
  templateUrl: './fines-sa-search-account-form-individuals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchAccountFormIndividualsComponent extends AbstractFormBaseComponent {
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
      firstNamesControl: this.form.get(`fsa_search_account_individuals_first_names`),
      dobControl: this.form.get(`fsa_search_account_individuals_date_of_birth`),
      lastNameControl: this.form.get(`fsa_search_account_individuals_last_name`),
    };
  }

  /**
   * Applies conditional validation to the last name field.
   * If either first names or date of birth is populated and last name is not, last name becomes required.
   */
  private handleLastNameConditionalValidation(): void {
    const { firstNamesControl, dobControl, lastNameControl } = this.getIndividualNameControls();

    if (!firstNamesControl || !dobControl || !lastNameControl) return;

    const firstNamesHasValue = !!firstNamesControl?.value?.trim();
    const dobHasValue = !!dobControl?.value?.trim();
    const lastNameHasValue = !!lastNameControl?.value?.trim();

    const shouldRequireLastName = (firstNamesHasValue || dobHasValue) && !lastNameHasValue;

    if (shouldRequireLastName) {
      lastNameControl.addValidators(Validators.required);
    } else {
      lastNameControl.removeValidators(Validators.required);
    }
    lastNameControl.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Sets up subscriptions to watch first names and date of birth fields.
   * Triggers conditional validation on the last name field when either changes.
   */
  private setupConditionalLastNameValidation(): void {
    const { firstNamesControl, dobControl } = this.getIndividualNameControls();
    if (!firstNamesControl || !dobControl) return;

    firstNamesControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.handleLastNameConditionalValidation());

    dobControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.handleLastNameConditionalValidation());
  }

  /**
   * Angular lifecycle hook - initialises conditional validation and computes yesterday’s date.
   */
  public override ngOnInit(): void {
    this.setupConditionalLastNameValidation();
    this.yesterday = this.dateService.getPreviousDate({ days: 1 });
    super.ngOnInit();
  }
}
