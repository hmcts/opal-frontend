import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DetailsComponent } from './details.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ADD_DEFENDANT_ACCOUNT_NOTE_BODY_MOCK,
  DEFENDANT_ACCOUNT_DETAILS_MOCK,
  DEFENDANT_ACCOUNT_NOTES_MOCK,
  DEFENDANT_ACCOUNT_NOTE_MOCK,
  LAUNCH_DARKLY_FLAGS_MOCK,
  USER_STATE_MOCK,
} from '@mocks';
import { DefendantAccountService, StateService } from '@services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountEnquiryRoutes, PermissionsMap } from '@enums';
import { ACCOUNT_ENQUIRY_DEFAULT_STATE } from '@constants';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let stateService: StateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsComponent, RouterTestingModule, HttpClientTestingModule],

      providers: [
        DefendantAccountService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ defendantAccountId: 123 }), // Mock the route params
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;

    stateService = TestBed.inject(StateService);
    stateService.userState.set(USER_STATE_MOCK);
    stateService.featureFlags.set(LAUNCH_DARKLY_FLAGS_MOCK);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch defendant account details and set roles and flags on initial setup', () => {
    spyOn(component['defendantAccountService'], 'getDefendantAccountDetails').and.returnValue(
      of(DEFENDANT_ACCOUNT_DETAILS_MOCK),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setUserStateRoles');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setFeatureFlags');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupPermissions');

    component['initialSetup']();

    // Test API is called
    expect(component['defendantAccountService'].getDefendantAccountDetails).toHaveBeenCalledWith(123);
    expect(component.data$).toBeDefined();

    // Test set user state roles are set
    expect(component['setUserStateRoles']).toHaveBeenCalledWith(USER_STATE_MOCK.roles);
    expect(component['userStateRoles']).toEqual(USER_STATE_MOCK.roles);

    // Test flags are set
    expect(component['setFeatureFlags']).toHaveBeenCalledWith(LAUNCH_DARKLY_FLAGS_MOCK);
    expect(component['featureFlags']).toEqual(LAUNCH_DARKLY_FLAGS_MOCK);

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
    const stateServiceSpy = spyOn(component['stateService'].accountEnquiry, 'set');
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleNewSearch();

    expect(stateServiceSpy).toHaveBeenCalledWith(ACCOUNT_ENQUIRY_DEFAULT_STATE);
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
    spyOn(component.permissionsService, 'hasPermissionAccess').and.returnValue(true);

    component['businessUnitId'] = ADD_DEFENDANT_ACCOUNT_NOTE_BODY_MOCK.businessUnitId;
    component['userStateRoles'] = USER_STATE_MOCK.roles;

    fixture.detectChanges();
    component['setupPermissions']();

    expect(component.permissionsService.hasPermissionAccess).toHaveBeenCalled();
    expect(component.permissions[PermissionsMap.accountEnquiryAddNote]).toBeTruthy();
  });

  it('should set feature flags', () => {
    component.featureFlags = {};
    fixture.detectChanges();

    component['setFeatureFlags'](LAUNCH_DARKLY_FLAGS_MOCK);
    expect(component.featureFlags).toEqual(LAUNCH_DARKLY_FLAGS_MOCK);
  });

  it('should set userStateRoles', () => {
    component['userStateRoles'] = [];
    fixture.detectChanges();

    component['setUserStateRoles'](USER_STATE_MOCK.roles);
    expect(component['userStateRoles']).toEqual(USER_STATE_MOCK.roles);
  });
});
