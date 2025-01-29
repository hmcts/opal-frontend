import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacAccountCommentsNotesFormComponent } from './fines-mac-account-comments-notes-form.component';
import { IFinesMacAccountCommentsNotesForm } from '../interfaces/fines-mac-account-comments-notes-form.interface';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM_MOCK } from '../mocks/fines-mac-account-comments-notes-form.mock';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { DateService } from '@services/date-service/date.service';
import { UtilsService } from '@services/utils/utils.service';

describe('FinesMacAccountCommentsNotesFormComponent', () => {
  let component: FinesMacAccountCommentsNotesFormComponent;
  let fixture: ComponentFixture<FinesMacAccountCommentsNotesFormComponent>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let formSubmit: IFinesMacAccountCommentsNotesForm;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    formSubmit = { ...FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM_MOCK };

    await TestBed.configureTestingModule({
      imports: [FinesMacAccountCommentsNotesFormComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: DateService,
          useValue: jasmine.createSpyObj(DateService, ['getDateFromFormat']),
        },
        {
          provide: UtilsService,
          useValue: jasmine.createSpyObj(UtilsService, ['checkFormValues', 'checkFormArrayValues']),
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
});
