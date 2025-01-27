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
import { AbstractFormBaseComponent } from '@components/abstract/abstract-form-base/abstract-form-base.component';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { GovukTextAreaComponent } from '@components/govuk/govuk-text-area/govuk-text-area.component';
import { IFinesMacAccountCommentsNotesForm } from '../interfaces/fines-mac-account-comments-notes-form.interface';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { CommonModule } from '@angular/common';

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

  protected readonly finesService = inject(FinesService);
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
    this.mandatorySectionsCompleted = this.finesService.checkMandatorySections();
  }

  /**
   * Performs the initial setup for the fines-mac-contact-details-form component.
   * This method sets up the account comments notes form, and populates the form with data.
   */
  private initialAccountCommentsNotesSetup(): void {
    const { formData } = this.finesService.finesMacState.accountCommentsNotes;
    this.setupAccountCommentsNotesForm();
    this.rePopulateForm(formData);
    this.checkMandatorySections();
  }

  public override ngOnInit(): void {
    this.initialAccountCommentsNotesSetup();
    super.ngOnInit();
  }
}
