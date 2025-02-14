import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FINES_CONF_ACCOUNT_COMMENTS_NOTES_FORM_MOCK } from '../mocks/fines-conf-account-comments-notes-form.mock';
import { DateService } from '@services/date-service/date.service';
import { UtilsService } from '@services/utils/utils.service';
import { of } from 'rxjs';
import { FinesConfAccountCommentsNotesFormComponent } from './fines-conf-account-comments-notes-form.component';
import { IFinesConfAccountCommentsNotesForm } from '../interfaces/fines-conf-account-comments-notes-form.interface';

describe('FinesConfAccountCommentsNotesFormComponent', () => {
  let component: FinesConfAccountCommentsNotesFormComponent;
  let fixture: ComponentFixture<FinesConfAccountCommentsNotesFormComponent>;
  let formSubmit: IFinesConfAccountCommentsNotesForm;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_CONF_ACCOUNT_COMMENTS_NOTES_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesConfAccountCommentsNotesFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
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

    fixture = TestBed.createComponent(FinesConfAccountCommentsNotesFormComponent);
    component = fixture.componentInstance;

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
