import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DateService } from '@services/date-service/date.service';
import { UtilsService } from '@services/utils/utils.service';
import { FinesConfiscationStore } from '../stores/fines-confiscation.store';
import { FinesConfAccountCommentsNotesComponent } from './fines-conf-account-comments-notes.component';
import { IFinesConfAccountCommentsNotesForm } from './interfaces/fines-conf-account-comments-notes-form.interface';
import { FinesConfiscationStoreType } from '../stores/types/fines-confiscation-store.type';
import { FINES_CONF_ACCOUNT_COMMENTS_NOTES_FORM_MOCK } from './mocks/fines-conf-account-comments-notes-form.mock';
import { FINES_CONF_ACCOUNT_COMMENTS_NOTES_STATE_MOCK } from './mocks/fines-conf-account-comments-notes-state.mock';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';

describe('FinesMacAccountCommentsNotesComponent', () => {
  let component: FinesConfAccountCommentsNotesComponent;
  let fixture: ComponentFixture<FinesConfAccountCommentsNotesComponent>;
  let formSubmit: IFinesConfAccountCommentsNotesForm;
  let finesConfiscationStore: FinesConfiscationStoreType;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_CONF_ACCOUNT_COMMENTS_NOTES_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesConfAccountCommentsNotesComponent],
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

    fixture = TestBed.createComponent(FinesConfAccountCommentsNotesComponent);
    component = fixture.componentInstance;

    finesConfiscationStore = TestBed.inject(FinesConfiscationStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.formData = structuredClone(FINES_CONF_ACCOUNT_COMMENTS_NOTES_STATE_MOCK);
    formSubmit.nestedFlow = false;

    component.handleAccountCommentsNoteSubmit(formSubmit);

    expect(finesConfiscationStore.accountCommentsNotes()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([PAGES_ROUTING_PATHS.children.dashboard], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.formData = structuredClone(FINES_CONF_ACCOUNT_COMMENTS_NOTES_STATE_MOCK);
    formSubmit.nestedFlow = true;

    component.handleAccountCommentsNoteSubmit(formSubmit);

    expect(finesConfiscationStore.accountCommentsNotes()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([PAGES_ROUTING_PATHS.children.dashboard], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route - form empty', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    const form = formSubmit;
    form.formData = structuredClone(FINES_CONF_ACCOUNT_COMMENTS_NOTES_STATE_MOCK);
    form.nestedFlow = true;

    component.handleAccountCommentsNoteSubmit(form);

    expect(finesConfiscationStore.accountCommentsNotes()).toEqual(form);
    expect(routerSpy).toHaveBeenCalledWith([PAGES_ROUTING_PATHS.children.dashboard], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(finesConfiscationStore.unsavedChanges()).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(finesConfiscationStore.unsavedChanges()).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});
