import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { DateService } from '@services/date-service/date.service';
import { UtilsService } from '@services/utils/utils.service';
import { of } from 'rxjs';
import { ConfiscationAccountCommentsNotesFormComponent } from './confiscation-account-comments-notes-form.component';
import { IConfiscationAccountCommentsNotesForm } from '../interfaces/confiscation-account-comments-notes-form.interface';
import { CONFISCATION_ACCOUNT_COMMENTS_NOTES_FORM_MOCK } from '../mocks/confiscation-account-comments-notes-form.mock';

describe('ConfiscationAccountCommentsNotesFormComponent', () => {
  let component: ConfiscationAccountCommentsNotesFormComponent;
  let fixture: ComponentFixture<ConfiscationAccountCommentsNotesFormComponent>;
  let formSubmit: IConfiscationAccountCommentsNotesForm;

  beforeEach(async () => {
    formSubmit = structuredClone(CONFISCATION_ACCOUNT_COMMENTS_NOTES_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [ConfiscationAccountCommentsNotesFormComponent],
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

    fixture = TestBed.createComponent(ConfiscationAccountCommentsNotesFormComponent);
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
