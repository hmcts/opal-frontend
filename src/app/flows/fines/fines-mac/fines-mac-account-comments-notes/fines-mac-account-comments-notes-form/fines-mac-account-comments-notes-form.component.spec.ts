import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacAccountCommentsNotesFormComponent } from './fines-mac-account-comments-notes-form.component';
import { IFinesMacAccountCommentsNotesForm } from '../interfaces/fines-mac-account-comments-notes-form.interface';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM_MOCK } from '../mocks/fines-mac-account-comments-notes-form.mock';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { FINES_MAC_STATE } from '../../constants/fines-mac-state';
import { of } from 'rxjs';

describe('FinesMacAccountCommentsNotesFormComponent', () => {
  let component: FinesMacAccountCommentsNotesFormComponent;
  let fixture: ComponentFixture<FinesMacAccountCommentsNotesFormComponent>;
  let formSubmit: IFinesMacAccountCommentsNotesForm;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacAccountCommentsNotesFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacAccountCommentsNotesFormComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value - nestedFlow true', () => {
    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;
    formSubmit.nestedFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: true,
      }),
    );
  });

  it('should emit form submit event with form value - nestedFlow false', () => {
    const event = {} as SubmitEvent;
    formSubmit.nestedFlow = false;
    component.defendantType = 'adultOrYouthOnly';
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: false,
      }),
    );
  });

  it('should test checkMandatorySections with the different defendant types', () => {
    const adultOrYouthOnly = structuredClone(FINES_MAC_STATE);
    adultOrYouthOnly.accountDetails.formData = {
      ...adultOrYouthOnly.accountDetails.formData,
      fm_create_account_defendant_type: 'adultOrYouthOnly',
    };
    finesMacStore.setFinesMacStore(adultOrYouthOnly);
    component['checkMandatorySections']();
    expect(component.mandatorySectionsCompleted).toBeFalse();

    const parentOrGuardianToPay = structuredClone(adultOrYouthOnly);
    parentOrGuardianToPay.accountDetails.formData = {
      ...parentOrGuardianToPay.accountDetails.formData,
      fm_create_account_defendant_type: 'parentOrGuardianToPay',
    };
    finesMacStore.setFinesMacStore(parentOrGuardianToPay);
    component['checkMandatorySections']();
    expect(component.mandatorySectionsCompleted).toBeFalse();

    const company = structuredClone(parentOrGuardianToPay);
    company.accountDetails.formData = {
      ...company.accountDetails.formData,
      fm_create_account_defendant_type: 'company',
    };
    finesMacStore.setFinesMacStore(company);
    component['checkMandatorySections']();
    expect(component.mandatorySectionsCompleted).toBeFalse();

    const defaultCase = structuredClone(company);
    defaultCase.accountDetails.formData = {
      ...defaultCase.accountDetails.formData,
      fm_create_account_defendant_type: 'defaultCase',
    };
    finesMacStore.setFinesMacStore(defaultCase);
    component['checkMandatorySections']();
    expect(component.mandatorySectionsCompleted).toBeFalse();
  });
});
