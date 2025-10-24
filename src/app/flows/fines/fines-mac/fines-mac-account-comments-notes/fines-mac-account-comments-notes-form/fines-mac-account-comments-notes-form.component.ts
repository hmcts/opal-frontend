import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes.constant';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN } from '@hmcts/opal-frontend-common/constants';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { IFinesMacAccountCommentsNotesFieldErrors } from '../interfaces/fines-mac-account-comments-notes-field-errors.interface';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_FIELD_ERRORS } from '../constants/fines-mac-account-comments-notes-field-errors.constant';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { AbstractSignalFormBaseComponent } from 'src/app/shared/abstract/abstract-signal-form-base';
import { SignalGovukTextAreaComponent } from 'src/app/shared/govuk-signal/govuk-signal-text-area';
import { SignalFormControlAdapter } from 'src/app/shared/forms/signal-forms';
import { IFinesMacAccountCommentsNotesState } from '../interfaces/fines-mac-account-comments-notes-state.interface';

const ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  'alphanumericWithHyphensSpacesApostrophesDotPattern',
);

@Component({
  selector: 'app-fines-mac-account-comments-notes-form',
  imports: [
    GovukErrorSummaryComponent,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    SignalGovukTextAreaComponent,
  ],
  templateUrl: './fines-mac-account-comments-notes-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacAccountCommentsNotesFormComponent
  extends AbstractSignalFormBaseComponent<IFinesMacAccountCommentsNotesState>
  implements OnInit, OnDestroy
{
  private readonly finesMacStore = inject(FinesMacStore);

  protected readonly finesMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  @Input() public defendantType!: string;
  public mandatorySectionsCompleted!: boolean;

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

  protected override initialiseForm(): void {
    this.fieldErrors = FINES_MAC_ACCOUNT_COMMENTS_NOTES_FIELD_ERRORS as IFinesMacAccountCommentsNotesFieldErrors;
    this.createControl<string>('fm_account_comments_notes_comments', [
      ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR,
    ]);
    this.createControl<string>('fm_account_comments_notes_notes', [
      ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR,
    ]);
    this.createControl<string>('fm_account_comments_notes_system_notes');
  }

  public override ngOnInit(): void {
    super.ngOnInit();
    const { formData } = this.finesMacStore.accountCommentsNotes();
    this.rePopulateForm(formData);
    this.checkMandatorySections();
  }

  protected get commentsControl(): SignalFormControlAdapter<string | null> {
    return this.getSignalControlAdapter<string>('fm_account_comments_notes_comments');
  }

  protected get notesControl(): SignalFormControlAdapter<string | null> {
    return this.getSignalControlAdapter<string>('fm_account_comments_notes_notes');
  }
}
