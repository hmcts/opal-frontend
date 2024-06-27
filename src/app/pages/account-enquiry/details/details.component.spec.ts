import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DetailsComponent } from './details.component';
import {
  ADD_DEFENDANT_ACCOUNT_NOTE_BODY_MOCK,
  DEFENDANT_ACCOUNT_DETAILS_MOCK,
  DEFENDANT_ACCOUNT_NOTES_MOCK,
  DEFENDANT_ACCOUNT_NOTE_MOCK,
  LAUNCH_DARKLY_FLAGS_MOCK,
  USER_STATE_MOCK,
} from '@mocks';
import { DefendantAccountService, GlobalStateService, AeStateService } from '@services';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AccountEnquiryRoutes, PermissionsMap } from '@enums';
import { ACCOUNT_ENQUIRY_DEFAULT_STATE } from '@constants';
import { IUserState } from '@interfaces';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let globalStateService: GlobalStateService;
  let aeStateService: AeStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DetailsComponent],
    providers: [
        DefendantAccountService,
        {
            provide: ActivatedRoute,
            useValue: {
                params: of({ defendantAccountId: 123 }), // Mock the route params
            },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
}).compileComponents();

    // We need the data available before the component creates
    globalStateService = TestBed.inject(GlobalStateService);
    globalStateService.userState.set(USER_STATE_MOCK);
    globalStateService.featureFlags.set(LAUNCH_DARKLY_FLAGS_MOCK);
    aeStateService = TestBed.inject(AeStateService);

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component['userStateRoles']).toEqual(USER_STATE_MOCK.roles);
  });

  it('should populate with an empty roles array', () => {
    globalStateService.userState.set({} as IUserState);
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;

    expect(component['userStateRoles']).toEqual([]);
  });

  it('should fetch defendant account details and set roles and flags on initial setup', () => {
    spyOn(component['defendantAccountService'], 'getDefendantAccountDetails').and.returnValue(
      of(DEFENDANT_ACCOUNT_DETAILS_MOCK),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupPermissions');

    component['initialSetup']();

    // Test API is called
    expect(component['defendantAccountService'].getDefendantAccountDetails).toHaveBeenCalledWith(123);
    expect(component.data$).toBeDefined();

    // Test tap set businessUnitId
    component.data$.subscribe(() => {
      expect(component['businessUnitId']).toEqual(DEFENDANT_ACCOUNT_DETAILS_MOCK.businessUnitId);
      expect(component['setupPermissions']).toHaveBeenCalled();
    });
  });

  it('should navigate to matches page on handleBack', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.handleBack();
    expect(routerSpy).toHaveBeenCalledWith([AccountEnquiryRoutes.matches]);
  });

  it('should handle new search', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleNewSearch();

    expect(aeStateService.accountEnquiry).toEqual(ACCOUNT_ENQUIRY_DEFAULT_STATE);
    expect(routerSpy).toHaveBeenCalledWith([AccountEnquiryRoutes.search]);
  });

  it('should setup add note form', () => {
    component['setupAddNoteForm']();
    expect(component.addNoteForm).toBeDefined();
    expect(component.addNoteForm.get('note')).toBeDefined();
  });

  it('should handle notes form submit', fakeAsync(() => {
    const note = ADD_DEFENDANT_ACCOUNT_NOTE_BODY_MOCK.noteText;

    component['defendantAccountId'] = Number(ADD_DEFENDANT_ACCOUNT_NOTE_BODY_MOCK.associatedRecordId);
    component['businessUnitId'] = ADD_DEFENDANT_ACCOUNT_NOTE_BODY_MOCK.businessUnitId;
    component['setupAddNoteForm']();
    component.addNoteForm.controls['note'].setValue(note);

    spyOn(component['defendantAccountService'], 'addDefendantAccountNote').and.returnValue(
      of(DEFENDANT_ACCOUNT_NOTE_MOCK),
    );
    spyOn(component['defendantAccountService'], 'getDefendantAccountNotes').and.returnValue(
      of(DEFENDANT_ACCOUNT_NOTES_MOCK),
    );

    spyOn(component.addNoteForm, 'reset');

    component.handleNotesFormSubmit();

    expect(component.addNoteForm.reset).toHaveBeenCalled();

    expect(component['defendantAccountService'].addDefendantAccountNote).toHaveBeenCalledWith(
      ADD_DEFENDANT_ACCOUNT_NOTE_BODY_MOCK,
    );

    expect(component.notes$).toBeDefined();

    component.notes$.subscribe(() => {
      expect(component['defendantAccountService'].getDefendantAccountNotes).toHaveBeenCalledWith(
        component['defendantAccountId'],
      );
    });
  }));

  it('should setup permissions', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'hasPermissionAccess').and.returnValue(true);

    component['businessUnitId'] = ADD_DEFENDANT_ACCOUNT_NOTE_BODY_MOCK.businessUnitId;

    fixture.detectChanges();
    component['setupPermissions']();

    expect(component['hasPermissionAccess']).toHaveBeenCalled();
    expect(component.permissions[PermissionsMap.accountEnquiryAddNote]).toBeTruthy();
  });
});
