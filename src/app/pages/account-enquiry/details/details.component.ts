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
import { LDFlagSet } from 'launchdarkly-js-client-sdk';

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

  private defendantAccountId!: number;
  private userStateRoles: IUserStateRole[] = [];

  public featureFlags: LDFlagSet = {};
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
    this.permissions[this.permissionsMap.accountEnquiryAddNote] = this.permissionsService.hasPermissionAccess(
      this.permissionsMap.accountEnquiryAddNote,
      this.businessUnitId,
      this.userStateRoles,
    );
  }

  /**
   * Sets the user state roles.
   *
   * @param userStateRoles - An array of user state roles.
   */
  private setUserStateRoles(userStateRoles: IUserStateRole[] = []): void {
    this.userStateRoles = userStateRoles;
  }

  /**
   * Sets the feature flags for the component.
   *
   * @param featureFlags - The feature flags to set.
   */
  private setFeatureFlags(featureFlags: LDFlagSet = {}): void {
    this.featureFlags = featureFlags;
  }

  /**
   * Performs the initial setup for the details component.
   * Retrieves the defendantAccountId from the route params and fetches the defendant account details.
   */
  private initialSetup(): void {
    // Set our roles and feature flags...
    this.setUserStateRoles(this.stateService.userState()?.roles);
    this.setFeatureFlags(this.stateService.featureFlags());

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

  ngOnInit() {
    this.initialSetup();
  }
}
