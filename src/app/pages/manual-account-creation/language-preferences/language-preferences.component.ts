import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormParentBaseComponent } from '@components';
import { ManualAccountCreationRoutes } from '@enums';
import { IManualAccountCreationLanguagePreferencesState } from '@interfaces';
import { LanguagePreferencesFormComponent } from './language-preferences-form/language-preferences-form.component';

@Component({
  selector: 'app-language-preferences',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguagePreferencesFormComponent],
  templateUrl: './language-preferences.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagePreferencesComponent extends FormParentBaseComponent {
  /**
   * Handles the form submission for language preferences.
   * @param formData - The form data containing the search parameters.
   */
  public handleLanguagePreferencesSubmit(
    languagePreferencesForm: IManualAccountCreationLanguagePreferencesState,
  ): void {
    this.macStateService.manualAccountCreation = {
      ...this.macStateService.manualAccountCreation,
      languagePreferences: languagePreferencesForm,
      unsavedChanges: false,
      stateChanges: true,
    };

    this.routerNavigate(ManualAccountCreationRoutes.accountDetails);
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.macStateService.manualAccountCreation.unsavedChanges = unsavedChanges;
    this.stateUnsavedChanges = unsavedChanges;
  }
}
