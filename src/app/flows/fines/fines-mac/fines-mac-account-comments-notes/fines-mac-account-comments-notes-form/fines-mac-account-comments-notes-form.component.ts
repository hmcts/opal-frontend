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
import { AbstractFormBaseComponent } from '@components/abstract';
import { GovukButtonComponent, GovukCancelLinkComponent, GovukTextAreaComponent } from '@components/govuk';
import { IFinesMacAccountCommentsNotesForm } from '../interfaces/fines-mac-account-comments-notes-form.interface';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';

@Component({
  selector: 'app-fines-mac-account-comments-notes-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, GovukButtonComponent, GovukCancelLinkComponent, GovukTextAreaComponent],
  templateUrl: './fines-mac-account-comments-notes-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacAccountCommentsNotesFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacAccountCommentsNotesForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  /**
   * Sets up the account comments and notes form with the necessary form controls.
   */
  private setupAccountCommentsNotesForm(): void {
    this.form = new FormGroup({
      comments: new FormControl(null),
      notes: new FormControl(null),
    });
  }

  /**
   * Performs the initial setup for the fines-mac-contact-details-form component.
   * This method sets up the account comments notes form, and populates the form with data.
   */
  private initialAccountCommentsNotesSetup(): void {
    const { formData } = this.finesService.finesMacState.accountCommentsNotes;
    this.setupAccountCommentsNotesForm();
    this.rePopulateForm(formData);
  }

  /**
   * Checks if all mandatory sections have been provided.
   *
   * @returns {boolean} Returns true if all mandatory sections have been provided, otherwise false.
   */
  protected checkMandatorySections(): boolean {
    const { courtDetails, personalDetails, employerDetails, offenceDetails, paymentTerms } =
      this.finesService.finesMacState;
    const details = [courtDetails, personalDetails, employerDetails, offenceDetails, paymentTerms];
    return details.every((detail) => detail.status === FINES_MAC_STATUS.PROVIDED);
  }

  public override ngOnInit(): void {
    this.initialAccountCommentsNotesSetup();
    super.ngOnInit();
  }
}
