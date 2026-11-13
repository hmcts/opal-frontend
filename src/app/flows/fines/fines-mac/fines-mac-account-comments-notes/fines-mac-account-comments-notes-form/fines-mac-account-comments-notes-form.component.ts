import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  computed,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../../../constants/release-feature-flags.constant';
import { getFeatureFlagReleaseState } from '../../../utils/fines-section-permissions.utils';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukTextAreaComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-area';
import { IFinesMacAccountCommentsNotesForm } from '../interfaces/fines-mac-account-comments-notes-form.interface';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes.constant';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { SINGLE_ASCII_CHARACTERS_WITH_POUND } from '@hmcts/opal-frontend-common/constants';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { IFinesMacAccountCommentsNotesFieldErrors } from '../interfaces/fines-mac-account-comments-notes-field-errors.interface';
import {
  FINES_MAC_ACCOUNT_COMMENTS_NOTES_FIELD_ERRORS,
  getAccountNotesMaxLengthError,
} from '../constants/fines-mac-account-comments-notes-field-errors.constant';

const SINGLE_ASCII_CHARACTERS_WITH_POUND_PATTERN_VALIDATOR = patternValidator(
  SINGLE_ASCII_CHARACTERS_WITH_POUND,
  'singleAsciiCharacters',
);

@Component({
  selector: 'app-fines-mac-account-comments-notes-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukTextAreaComponent,
    GovukErrorSummaryComponent,
  ],
  templateUrl: './fines-mac-account-comments-notes-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacAccountCommentsNotesFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  private readonly finesMacStore = inject(FinesMacStore);
  private readonly globalStore = inject(GlobalStore);

  @Output() protected override formSubmit = new EventEmitter<IFinesMacAccountCommentsNotesForm>();
  protected readonly finesMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  protected readonly release1a1_2Enabled = computed(
    () => getFeatureFlagReleaseState(this.globalStore.featureFlags())[RELEASE_1A_1_2_FEATURE_FLAG] === true,
  );

  protected override fieldErrors: IFinesMacAccountCommentsNotesFieldErrors = {
    ...FINES_MAC_ACCOUNT_COMMENTS_NOTES_FIELD_ERRORS,
    fm_account_comments_notes_notes: {
      ...FINES_MAC_ACCOUNT_COMMENTS_NOTES_FIELD_ERRORS.fm_account_comments_notes_notes,
      ...getAccountNotesMaxLengthError(this.release1a1_2Enabled() ? 500 : 1000),
    },
  };

  @Input() public defendantType!: string;
  public mandatorySectionsCompleted!: boolean;

  /**
   * Sets up the account comments and notes form with the necessary form controls.
   */
  private setupAccountCommentsNotesForm(): void {
    this.form = new FormGroup({
      fm_account_comments_notes_comments: new FormControl<string | null>(null, [
        SINGLE_ASCII_CHARACTERS_WITH_POUND_PATTERN_VALIDATOR,
      ]),
      fm_account_comments_notes_notes: new FormControl<string | null>(null, [
        SINGLE_ASCII_CHARACTERS_WITH_POUND_PATTERN_VALIDATOR,
        Validators.maxLength(this.release1a1_2Enabled() ? 500 : 1000),
      ]),
      fm_account_comments_notes_system_notes: new FormControl<string | null>(null),
    });
  }

  /**
   * Checks if all mandatory sections are completed by calling the finesService.
   * Updates the `mandatorySectionsCompleted` property with the result.
   *
   * @private
   * @returns {void}
   */
  private checkMandatorySections(): void {
    this.mandatorySectionsCompleted = false;
    switch (this.finesMacStore.getDefendantType()) {
      case FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly:
        this.mandatorySectionsCompleted = this.finesMacStore.adultOrYouthSectionsCompleted();
        break;
      case FINES_MAC_DEFENDANT_TYPES_KEYS.pgToPay:
        this.mandatorySectionsCompleted = this.finesMacStore.parentGuardianSectionsCompleted();
        break;
      case FINES_MAC_DEFENDANT_TYPES_KEYS.company:
        this.mandatorySectionsCompleted = this.finesMacStore.companySectionsCompleted();
        break;
      default:
        this.mandatorySectionsCompleted = false;
        break;
    }
  }

  /**
   * Performs the initial setup for the fines-mac-account-comments-notes-form component.
   * This method sets up the account comments notes form, and populates the form with data.
   */
  private initialAccountCommentsNotesSetup(): void {
    const { formData } = this.finesMacStore.accountCommentsNotes();
    this.setupAccountCommentsNotesForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
    this.checkMandatorySections();
  }

  public override ngOnInit(): void {
    this.initialAccountCommentsNotesSetup();
    super.ngOnInit();
  }
}
