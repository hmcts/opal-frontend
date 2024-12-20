import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacAccountCommentsNotesComponent } from './fines-mac-account-comments-notes.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { IFinesMacAccountCommentsNotesForm } from './interfaces/fines-mac-account-comments-notes-form.interface';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM_MOCK } from './mocks/fines-mac-account-comments-notes-form.mock';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE_MOCK } from './mocks/fines-mac-account-comments-notes-state.mock';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE } from './constants/fines-mac-account-comments-notes-state';

describe('FinesMacAccountCommentsNotesComponent', () => {
  let component: FinesMacAccountCommentsNotesComponent | null;
  let fixture: ComponentFixture<FinesMacAccountCommentsNotesComponent> | null;
  let mockFinesService: jasmine.SpyObj<FinesService> | null;
  let formSubmit: IFinesMacAccountCommentsNotesForm | null;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService!.finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    
    formSubmit = structuredClone(FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacAccountCommentsNotesComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
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

    component.defendantType = 'adultOrYouthOnly';

    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    mockFinesService = null;
    formSubmit = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    if (!component || !mockFinesService || !fixture || !formSubmit) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.formData = { ...FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE_MOCK };
    formSubmit.nestedFlow = false;

    component.handleAccountCommentsNoteSubmit(formSubmit);

    expect(mockFinesService.finesMacState.accountCommentsNotes).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route', () => {
    if (!component || !mockFinesService || !fixture || !formSubmit) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.formData = { ...FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE_MOCK };
    formSubmit.nestedFlow = true;

    component.handleAccountCommentsNoteSubmit(formSubmit);

    expect(mockFinesService.finesMacState.accountCommentsNotes).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.reviewAccount], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route - form empty', () => {
    if (!component || !mockFinesService || !fixture || !formSubmit) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');

    const form = formSubmit;
    form.formData = { ...FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE };
    form.nestedFlow = true;

    component.handleAccountCommentsNoteSubmit(form);

    expect(mockFinesService.finesMacState.accountCommentsNotes).toEqual(form);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.reviewAccount], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test handleUnsavedChanges', () => {
    if (!component || !mockFinesService || !fixture || !formSubmit) {
      fail('Required properties not properly initialised');
      return;
    }

    component.handleUnsavedChanges(true);
    expect(mockFinesService.finesMacState.unsavedChanges).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(mockFinesService.finesMacState.unsavedChanges).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});
