import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  GovukButtonComponent,
  GovukInsetTextComponent,
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
  GovukTabListItemComponent,
  GovukTabPanelComponent,
  GovukTabsComponent,
  GovukTextInputComponent,
} from '@components';

import { AccountEnquiryRoutes, Permissions } from '@enums';
import { DefendantAccountService, PermissionsService, StateService } from '@services';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { IDefendantAccountDetails, IDefendantAccountNote, IPermissions } from '@interfaces';
import { ACCOUNT_ENQUIRY_DEFAULT_STATE } from '@constants';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-account-enquiry-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GovukTabsComponent,
    GovukTabListItemComponent,
    GovukTabPanelComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    GovukButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukInsetTextComponent,
  ],
  providers: [DefendantAccountService],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly defendantAccountService = inject(DefendantAccountService);
  private readonly route = inject(ActivatedRoute);

  public readonly stateService = inject(StateService);
  public readonly permissionsService = inject(PermissionsService);

  private readonly userStateRoles = this.stateService.userState()?.roles;

  private defendantAccountId!: number;
  public businessUnitId!: number;

  public readonly permissions: IPermissions = {
    addNote: true,
  };

  public data$: Observable<IDefendantAccountDetails> = EMPTY;
  public notes$: Observable<IDefendantAccountNote[]> = EMPTY;

  public addNoteForm!: FormGroup;

  /**
   * Sets up the add note form.
   */
  private setupAddNoteForm(): void {
    this.addNoteForm = new FormGroup({
      note: new FormControl(null),
    });
  }

  private setupPermissions(): void {
    if (this.userStateRoles) {
      // Setup the permissions for the page
      this.permissions['addNote'] = this.permissionsService.hasPermissionAccess(
        Permissions.accountEnquiryAddNote,
        this.businessUnitId,
        this.userStateRoles,
      );
    }
  }

  /**
   * Performs the initial setup for the details component.
   * Retrieves the defendantAccountId from the route params and fetches the defendant account details.
   */
  private initialSetup(): void {
    this.route.params.subscribe((params) => {
      this.defendantAccountId = params['defendantAccountId']; // get defendantAccountId from route params
      this.data$ = this.defendantAccountService.getDefendantAccountDetails(this.defendantAccountId).pipe(
        tap(({ businessUnitId }) => {
          this.businessUnitId = businessUnitId;
          this.setupPermissions();
        }),
      );
      this.notes$ = this.defendantAccountService.getDefendantAccountNotes(this.defendantAccountId);
      this.setupAddNoteForm();
    });
  }

  /**
   * Handles the form submission for adding a note.
   */
  public handleNotesFormSubmit(): void {
    const note = this.addNoteForm.get('note')?.value;

    this.addNoteForm.reset();

    this.notes$ = this.defendantAccountService
      .addDefendantAccountNote({
        businessUnitId: this.businessUnitId,
        associatedRecordId: this.defendantAccountId.toString(),
        noteText: note,
      })
      .pipe(
        switchMap(() => {
          return this.defendantAccountService.getDefendantAccountNotes(this.defendantAccountId);
        }),
      );
  }
  /**
   * Handles a new search by resetting the account enquiry state and navigating to the search page.
   */
  public handleNewSearch(): void {
    this.stateService.accountEnquiry.set(ACCOUNT_ENQUIRY_DEFAULT_STATE);
    this.router.navigate([AccountEnquiryRoutes.search]);
  }

  /**
   * Navigates to the matches page when the back button is clicked.
   */
  public handleBack(): void {
    this.router.navigate([AccountEnquiryRoutes.matches]);
  }

  public test(): void {
    console.log('test');
  }

  ngOnInit() {
    this.initialSetup();
  }
}
