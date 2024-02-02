import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DetailsComponent } from './details.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ADD_DEFENDANT_ACCOUNT_NOTE_BODY_MOCK,
  DEFENDANT_ACCOUNT_DETAILS_MOCK,
  DEFENDANT_ACCOUNT_NOTE_MOCK,
} from '@mocks';
import { DefendantAccountService } from '@services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountEnquiryRoutes } from '@enums';
import { ACCOUNT_ENQUIRY_DEFAULT_STATE } from '@constants';
import { IAddDefendantAccountNoteBody } from '@interfaces';

fdescribe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch defendant account details on initial setup', () => {
    spyOn(component['defendantAccountService'], 'getDefendantAccountDetails').and.returnValue(
      of(DEFENDANT_ACCOUNT_DETAILS_MOCK),
    );
    component['initialSetup']();
    expect(component['defendantAccountService'].getDefendantAccountDetails).toHaveBeenCalledWith(123);
    expect(component.data$).toBeDefined();
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

  it('should handle notes form submit', () => {
    const note = ADD_DEFENDANT_ACCOUNT_NOTE_BODY_MOCK.noteText;

    component['defendantAccountId'] = Number(ADD_DEFENDANT_ACCOUNT_NOTE_BODY_MOCK.associatedRecordId);
    component['setupAddNoteForm']();
    component.addNoteForm.controls['note'].setValue(note);

    spyOn(component['defendantAccountService'], 'addDefendantAccountNote').and.returnValue(
      of(DEFENDANT_ACCOUNT_NOTE_MOCK),
    );

    component.handleNotesFormSubmit();

    expect(component['defendantAccountService'].addDefendantAccountNote).toHaveBeenCalledWith(
      ADD_DEFENDANT_ACCOUNT_NOTE_BODY_MOCK,
    );
    expect(component.accountNotesData$).toBeDefined();
  });
});
