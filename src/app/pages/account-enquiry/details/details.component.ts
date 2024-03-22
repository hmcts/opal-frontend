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

import { AccountEnquiryRoutes, PermissionsMap } from '@enums';
import { DefendantAccountService, PermissionsService, StateService } from '@services';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { IDefendantAccountDetails, IDefendantAccountNote, IPermissions, IUserStateRole } from '@interfaces';
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

  // Get what we need from the state service...
  private readonly accountEnquiryState = inject(StateService).accountEnquiry;
  public readonly featureFlagsState = inject(StateService).featureFlags;
  public readonly userState = inject(StateService).userState;
  public readonly errorState = inject(StateService).error;

  private readonly hasPermissionAccess = inject(PermissionsService).hasPermissionAccess;
  private readonly userStateRoles: IUserStateRole[] = this.userState()?.roles || [];

  private defendantAccountId!: number;

  public businessUnitId!: number;
  public data$: Observable<IDefendantAccountDetails> = EMPTY;
  public notes$: Observable<IDefendantAccountNote[]> = EMPTY;
  public addNoteForm!: FormGroup;

  public readonly permissionsMap = PermissionsMap;
  public readonly permissions: IPermissions = {
    [PermissionsMap.accountEnquiryAddNote]: true, // default to true so that if no permissions are found, the add note is still displayed
  };

  /**
   * Sets up the add note form.
   */
  private setupAddNoteForm(): void {
    this.addNoteForm = new FormGroup({
      note: new FormControl(null),
    });
  }

  /**
   * Sets up the permissions for the account enquiry details component.
   * This method checks if the user has permission to add a note to the account enquiry.
   */
  private setupPermissions(): void {
    if (this.userStateRoles && this.userStateRoles.length > 0) {
      this.permissions[this.permissionsMap.accountEnquiryAddNote] = this.hasPermissionAccess(
        this.permissionsMap.accountEnquiryAddNote,
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
    this.accountEnquiryState.set(ACCOUNT_ENQUIRY_DEFAULT_STATE);
    this.router.navigate([AccountEnquiryRoutes.search]);
  }

  /**
   * Navigates to the matches page when the back button is clicked.
   */
  public handleBack(): void {
    this.router.navigate([AccountEnquiryRoutes.matches]);
  }

  ngOnInit() {
    this.initialSetup();
  }
}
