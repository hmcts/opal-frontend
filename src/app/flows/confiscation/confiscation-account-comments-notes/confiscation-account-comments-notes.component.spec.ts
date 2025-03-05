import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DateService } from '@services/date-service/date.service';
import { UtilsService } from '@services/utils/utils.service';
import { ConfiscationStore } from '../stores/confiscation.store';
import { ConfiscationAccountCommentsNotesComponent } from './confiscation-account-comments-notes.component';
import { IConfiscationAccountCommentsNotesForm } from './interfaces/confiscation-account-comments-notes-form.interface';
import { ConfiscationStoreType } from '../stores/types/confiscation-store.type';
import { CONFISCATION_ACCOUNT_COMMENTS_NOTES_FORM_MOCK } from './mocks/confiscation-account-comments-notes-form.mock';
import { CONFISCATION_ACCOUNT_COMMENTS_NOTES_STATE_MOCK } from './mocks/confiscation-account-comments-notes-state.mock';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';

describe('ConfiscationAccountCommentsNotesComponent', () => {
  let component: ConfiscationAccountCommentsNotesComponent;
  let fixture: ComponentFixture<ConfiscationAccountCommentsNotesComponent>;
  let formSubmit: IConfiscationAccountCommentsNotesForm;
  let confiscationStore: ConfiscationStoreType;

  beforeEach(async () => {
    formSubmit = structuredClone(CONFISCATION_ACCOUNT_COMMENTS_NOTES_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [ConfiscationAccountCommentsNotesComponent],
      providers: [
        {
          provide: DateService,
          useValue: jasmine.createSpyObj(DateService, ['getDateFromFormat']),
        },
        {
          provide: UtilsService,
          useValue: jasmine.createSpyObj(UtilsService, ['checkFormValues', 'checkFormArrayValues']),
        },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiscationAccountCommentsNotesComponent);
    component = fixture.componentInstance;

    confiscationStore = TestBed.inject(ConfiscationStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.formData = structuredClone(CONFISCATION_ACCOUNT_COMMENTS_NOTES_STATE_MOCK);
    formSubmit.nestedFlow = false;

    component.handleAccountCommentsNoteSubmit(formSubmit);

    expect(confiscationStore.accountCommentsNotes()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([PAGES_ROUTING_PATHS.children.dashboard], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.formData = structuredClone(CONFISCATION_ACCOUNT_COMMENTS_NOTES_STATE_MOCK);
    formSubmit.nestedFlow = true;

    component.handleAccountCommentsNoteSubmit(formSubmit);

    expect(confiscationStore.accountCommentsNotes()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([PAGES_ROUTING_PATHS.children.dashboard], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route - form empty', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    const form = formSubmit;
    form.formData = structuredClone(CONFISCATION_ACCOUNT_COMMENTS_NOTES_STATE_MOCK);
    form.nestedFlow = true;

    component.handleAccountCommentsNoteSubmit(form);

    expect(confiscationStore.accountCommentsNotes()).toEqual(form);
    expect(routerSpy).toHaveBeenCalledWith([PAGES_ROUTING_PATHS.children.dashboard], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(confiscationStore.unsavedChanges()).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(confiscationStore.unsavedChanges()).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});
