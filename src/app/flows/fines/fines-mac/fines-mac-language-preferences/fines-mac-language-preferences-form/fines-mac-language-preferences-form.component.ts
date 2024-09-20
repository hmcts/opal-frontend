import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractFormBaseComponent } from '@components/abstract/abstract-form-base/abstract-form-base.component';
import { GovukRadioComponent } from '@components/govuk/govuk-radio/govuk-radio.component';
import { GovukRadiosItemComponent } from '@components/govuk/govuk-radio/govuk-radios-item/govuk-radios-item.component';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { IFinesMacLanguagePreferencesForm } from '../interfaces/fines-mac-language-preferences-form.interface';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../constants/fines-mac-language-preferences-options';

import { FINES_MAC_LANGUAGE_PREFERENCES_CONTROLS_DOCUMENT_LANGUAGE as F_M_LANGUAGE_PREFERENCES } from '../constants/controls/fines-mac-language-preferences-controls-document-language';
import { FINES_MAC_LANGUAGE_PREFERENCES_CONTROLS_HEARING_LANGUAGE as F_M_LANGUAGE_PREFERENCES_HEARING_LANGUAGE } from '../constants/controls/fines-mac-language-preferences-controls-hearing-language';

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
  @Output() protected override formSubmit = new EventEmitter<IFinesMacLanguagePreferencesForm>();

  protected readonly finesService = inject(FinesService);

  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;

  public readonly languageOptions: { key: string; value: string }[] = Object.entries(
    FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS,
  ).map(([key, value]) => ({ key, value }));

  public languagePreferencesDocumentLanguage = F_M_LANGUAGE_PREFERENCES;
  public languagePreferencesHearingLanguage = F_M_LANGUAGE_PREFERENCES_HEARING_LANGUAGE;

  /**
   * Sets up the language preferences form with the necessary form controls.
   */
  private setupLanguagePreferencesForm(): void {
    this.form = new FormGroup({
      [this.languagePreferencesDocumentLanguage.controlName]: this.createFormControl(
        this.languagePreferencesDocumentLanguage.validators,
      ),
      [this.languagePreferencesHearingLanguage.controlName]: this.createFormControl(
        this.languagePreferencesHearingLanguage.validators,
      ),
    });
  }

  /**
   * Performs the initial setup for the fines-mac-language-preferences-form component.
   * This method sets up the language preferences form and repopulates it with the
   * saved language preferences from the fines service.
   */
  private initialLanguagePreferencesSetup(): void {
    this.setupLanguagePreferencesForm();
    this.rePopulateForm(this.finesService.finesMacState.languagePreferences.formData);
  }

  public override ngOnInit(): void {
    this.initialLanguagePreferencesSetup();
    super.ngOnInit();
  }
}
