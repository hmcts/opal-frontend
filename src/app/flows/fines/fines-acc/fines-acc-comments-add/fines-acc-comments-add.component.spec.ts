import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { FinesAccCommentsAddComponent } from './fines-acc-comments-add.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { IFinesAccAddCommentsForm } from './interfaces/fines-acc-comments-add-form.interface';
import { IFinesAccAddCommentsFormState } from './interfaces/fines-acc-comments-add-form-state.interface';

describe('FinesAccCommentsAddComponent', () => {
  let component: FinesAccCommentsAddComponent;
  let fixture: ComponentFixture<FinesAccCommentsAddComponent>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockFinesAccStore: any;
  let mockFinesAccPayloadService: jasmine.SpyObj<FinesAccPayloadService>;

  const mockPrefilledFormData: IFinesAccAddCommentsFormState = {
    facc_add_comment: 'Test comment',
    facc_add_free_text_1: 'Free text 1',
    facc_add_free_text_2: 'Free text 2',
    facc_add_free_text_3: 'Free text 3',
  };

  beforeEach(async () => {
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['patchDefendantAccount']);
    mockUtilsService = jasmine.createSpyObj('UtilsService', ['upperCaseFirstLetter']);
    mockFinesAccStore = {
      account_number: signal('123456'),
      party_name: signal('John Doe'),
      account_id: signal(789),
      party_id: signal(789),
      business_unit_user_id: signal(456),
      base_version: signal('1'),
      business_unit_id: signal('1'),
      getAccountNumber: jasmine.createSpy('getAccountNumber').and.returnValue(signal('123456')),
      unsavedChanges: jasmine.createSpy('unsavedChanges').and.returnValue(false),
      getAccountState: jasmine.createSpy('getAccountState').and.returnValue({
        account_number: '123456',
        account_id: 789,
        party_id: 789,
        business_unit_user_id: 456,
        business_unit_id: '1',
        party_name: 'John Doe',
        party_type: 'Individual',
        base_version: 1,
      }),
    };
    mockFinesAccPayloadService = jasmine.createSpyObj('FinesAccPayloadService', ['buildCommentsFormPayload']);

    await TestBed.configureTestingModule({
      imports: [FinesAccCommentsAddComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                commentsFormData: mockPrefilledFormData,
              },
            },
          },
        },
        {
          provide: OpalFines,
          useValue: mockOpalFinesService,
        },
        {
          provide: UtilsService,
          useValue: mockUtilsService,
        },
        {
          provide: FinesAccountStore,
          useValue: mockFinesAccStore,
        },
        {
          provide: FinesAccPayloadService,
          useValue: mockFinesAccPayloadService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccCommentsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with prefilled form data from route', () => {
    expect(component['prefilledFormData']).toEqual(mockPrefilledFormData);
  });

  it('should initialize with default form data when no route data provided', () => {
    // Create a new component with no route data
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [FinesAccCommentsAddComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {},
            },
          },
        },
        {
          provide: OpalFines,
          useValue: mockOpalFinesService,
        },
        {
          provide: UtilsService,
          useValue: mockUtilsService,
        },
        {
          provide: FinesAccountStore,
          useValue: mockFinesAccStore,
        },
        {
          provide: FinesAccPayloadService,
          useValue: mockFinesAccPayloadService,
        },
      ],
    });

    const newFixture = TestBed.createComponent(FinesAccCommentsAddComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent['prefilledFormData']).toEqual({
      facc_add_comment: null,
      facc_add_free_text_1: null,
      facc_add_free_text_2: null,
      facc_add_free_text_3: null,
    });
  });

  it('should handle form submission', () => {
    const mockFormData: IFinesAccAddCommentsForm = {
      formData: {
        facc_add_comment: 'Test comment',
        facc_add_free_text_1: 'Free text 1',
        facc_add_free_text_2: null,
        facc_add_free_text_3: null,
      },
      nestedFlow: false,
    };

    const mockPayload = {
      comment_and_notes: {
        account_comment: 'Test comment',
        free_text_note_1: 'Free text 1',
        free_text_note_2: null,
        free_text_note_3: null,
      },
    };

    mockFinesAccPayloadService.buildCommentsFormPayload.and.returnValue(mockPayload);
    mockOpalFinesService.patchDefendantAccount.and.returnValue(
      of({ version: 2, defendant_account_id: 789, message: 'Success' }),
    );

    component.handleAddNoteSubmit(mockFormData);

    expect(mockFinesAccPayloadService.buildCommentsFormPayload).toHaveBeenCalledWith(mockFormData.formData);
    expect(mockOpalFinesService.patchDefendantAccount).toHaveBeenCalledWith(789, mockPayload, '1', '1');
  });

  it('should have access to required services', () => {
    expect(component['opalFinesService']).toBeDefined();
    expect(component['utilsService']).toBeDefined();
    expect(component['finesAccStore']).toBeDefined();
    expect(component['finesAccPayloadService']).toBeDefined();
  });

  it('should have routing paths defined', () => {
    expect(component['finesDefendantRoutingPaths']).toBeDefined();
  });

  it('should extend AbstractFormParentBaseComponent', () => {
    expect(component.constructor.name).toBe('FinesAccCommentsAddComponent');
    // Verify it has properties from the parent class
    expect(component['activatedRoute']).toBeDefined();
  });

  it('should handle different form data shapes', () => {
    const partialFormData: IFinesAccAddCommentsForm = {
      formData: {
        facc_add_comment: 'Only comment',
        facc_add_free_text_1: null,
        facc_add_free_text_2: null,
        facc_add_free_text_3: null,
      },
      nestedFlow: false,
    };

    const mockPayload = {
      comment_and_notes: {
        account_comment: 'Only comment',
        free_text_note_1: null,
        free_text_note_2: null,
        free_text_note_3: null,
      },
    };

    mockFinesAccPayloadService.buildCommentsFormPayload.and.returnValue(mockPayload);
    mockOpalFinesService.patchDefendantAccount.and.returnValue(
      of({ version: 2, defendant_account_id: 789, message: 'Success' }),
    );

    component.handleAddNoteSubmit(partialFormData);

    expect(mockFinesAccPayloadService.buildCommentsFormPayload).toHaveBeenCalledWith(partialFormData.formData);
    expect(mockOpalFinesService.patchDefendantAccount).toHaveBeenCalledWith(789, mockPayload, '1', '1');
  });

  it('should have correct component selector', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const componentElement = compiled.querySelector('app-fines-acc-comments-add-form');
    expect(componentElement).toBeTruthy();
  });

  it('should test handleUnsavedChanges', () => {
    // Reset the spy before each test
    (mockFinesAccStore.unsavedChanges as jasmine.Spy).and.returnValue(true);

    component.handleUnsavedChanges(true);
    expect(component.stateUnsavedChanges).toBeTruthy();

    // Reset the spy for false case
    (mockFinesAccStore.unsavedChanges as jasmine.Spy).and.returnValue(false);

    component.handleUnsavedChanges(false);
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});
