import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractFormBaseComponent } from '@components/abstract';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
  GovukButtonComponent,
  GovukCancelLinkComponent,
} from '@components/govuk';
import { IFinesMacLanguagePreferencesState } from '../interfaces';
import { FinesService } from '../../../services/fines-service/fines.service';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../constants';

@Component({
  selector: 'app-fines-mac-language-preferences-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukButtonComponent,
    GovukCancelLinkComponent,
  ],
  templateUrl: './fines-mac-language-preferences-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacLanguagePreferencesFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  @Output() private formSubmit = new EventEmitter<IFinesMacLanguagePreferencesState>();

  protected readonly finesService = inject(FinesService);

  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;

  public readonly languageOptions: { key: string; value: string }[] = Object.entries(
    FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS,
  ).map(([key, value]) => ({ key, value }));

  /**
   * Sets up the language preferences form with the necessary form controls.
   */
  private setupLanguagePreferencesForm(): void {
    this.form = new FormGroup({
      documentLanguage: new FormControl(null),
      courtHearingLanguage: new FormControl(null),
    });
  }

  /**
   * Performs the initial setup for the fines-mac-language-preferences-form component.
   * This method sets up the language preferences form and repopulates it with the
   * saved language preferences from the fines service.
   */
  private initialSetup(): void {
    this.setupLanguagePreferencesForm();
    this.rePopulateForm(this.finesService.finesMacState.languagePreferences);
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
    this.initialSetup();
    super.ngOnInit();
  }
}
