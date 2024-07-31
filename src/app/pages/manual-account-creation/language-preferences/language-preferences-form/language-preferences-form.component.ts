import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  FormBaseComponent,
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukRadioComponent,
  GovukRadiosItemComponent,
} from '@components';
import { ManualAccountCreationRoutes } from '@enums';
import { IManualAccountCreationLanguagePreferencesState } from '@interfaces';
import { LANGUAGE_OPTIONS } from 'src/app/constants/common/languages';

@Component({
  selector: 'app-language-preferences-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukButtonComponent,
    GovukCancelLinkComponent,
  ],
  templateUrl: './language-preferences-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagePreferencesFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationLanguagePreferencesState>();

  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;
  public readonly languageOptions: { key: string; value: string }[] = Object.entries(LANGUAGE_OPTIONS).map(
    ([key, value]) => ({ key, value }),
  );

  /**
   * Sets up the employer details form with the necessary form controls.
   */
  private setupLanguagePreferencesForm(): void {
    this.form = new FormGroup({
      documentLanguage: new FormControl(null),
      courtHearingLanguage: new FormControl(null),
    });
  }

  /**
   * Handles the form submission event.
   *
   * @param event - The form submission event.
   * @returns void
   */
  public handleFormSubmit(): void {
    this.handleErrorMessages();

    if (this.form.valid) {
      this.formSubmitted = true;
      this.unsavedChanges.emit(this.hasUnsavedChanges());
      this.formSubmit.emit(this.form.value);
    }
  }

  public override ngOnInit(): void {
    this.setupLanguagePreferencesForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(this.macStateService.manualAccountCreation.languagePreferences);
    super.ngOnInit();
  }
}
