import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacAccountCommentsNotesComponent } from './fines-mac-account-comments-notes.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { IFinesMacAccountCommentsNotesForm } from './interfaces/fines-mac-account-comments-notes-form.interface';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM_MOCK } from './mocks/fines-mac-account-comments-notes-form.mock';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE_MOCK } from './mocks/fines-mac-account-comments-notes-state.mock';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE } from './constants/fines-mac-account-comments-notes-state';
import { FinesMacStoreType } from '../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../stores/fines-mac.store';
import { DateService } from '@services/date-service/date.service';
import { UtilsService } from '@services/utils/utils.service';

describe('FinesMacAccountCommentsNotesComponent', () => {
  let component: FinesMacAccountCommentsNotesComponent;
  let fixture: ComponentFixture<FinesMacAccountCommentsNotesComponent>;
  let formSubmit: IFinesMacAccountCommentsNotesForm;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacAccountCommentsNotesComponent],
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

    fixture = TestBed.createComponent(FinesMacAccountCommentsNotesComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    component.defendantType = 'adultOrYouthOnly';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.formData = structuredClone(FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE_MOCK);
    formSubmit.nestedFlow = false;

    component.handleAccountCommentsNoteSubmit(formSubmit);

    expect(finesMacStore.accountCommentsNotes()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.formData = structuredClone(FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE_MOCK);
    formSubmit.nestedFlow = true;

    component.handleAccountCommentsNoteSubmit(formSubmit);

    expect(finesMacStore.accountCommentsNotes()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.reviewAccount], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route - form empty', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    const form = formSubmit;
    form.formData = structuredClone(FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE);
    form.nestedFlow = true;

    component.handleAccountCommentsNoteSubmit(form);

    expect(finesMacStore.accountCommentsNotes()).toEqual(form);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.reviewAccount], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(finesMacStore.unsavedChanges()).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(finesMacStore.unsavedChanges()).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});
