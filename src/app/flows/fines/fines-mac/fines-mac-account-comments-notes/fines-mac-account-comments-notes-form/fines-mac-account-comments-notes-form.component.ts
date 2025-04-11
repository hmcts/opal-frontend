import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukTextAreaComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-area';
import { IFinesMacAccountCommentsNotesForm } from '../interfaces/fines-mac-account-comments-notes-form.interface';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes.constant';
import { CommonModule } from '@angular/common';
import { FinesMacStore } from '../../stores/fines-mac.store';

@Component({
  selector: 'app-fines-mac-account-comments-notes-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukTextAreaComponent,
  ],
  templateUrl: './fines-mac-account-comments-notes-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacAccountCommentsNotesFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacAccountCommentsNotesForm>();

  private readonly finesMacStore = inject(FinesMacStore);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;
  public mandatorySectionsCompleted!: boolean;

  /**
   * Sets up the account comments and notes form with the necessary form controls.
   */
  private setupAccountCommentsNotesForm(): void {
    this.form = new FormGroup({
      fm_account_comments_notes_comments: new FormControl<string | null>(null),
      fm_account_comments_notes_notes: new FormControl<string | null>(null),
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
      case 'adultOrYouthOnly':
        this.mandatorySectionsCompleted = this.finesMacStore.adultOrYouthSectionsCompleted();
        break;
      case 'parentOrGuardianToPay':
        this.mandatorySectionsCompleted = this.finesMacStore.parentGuardianSectionsCompleted();
        break;
      case 'company':
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
    this.rePopulateForm(formData);
    this.checkMandatorySections();
  }

  public override ngOnInit(): void {
    this.initialAccountCommentsNotesSetup();
    super.ngOnInit();
  }
}
