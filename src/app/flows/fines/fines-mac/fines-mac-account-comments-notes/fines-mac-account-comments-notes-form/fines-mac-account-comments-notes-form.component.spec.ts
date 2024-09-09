import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacAccountCommentsNotesFormComponent } from './fines-mac-account-comments-notes-form.component';
import { IFinesMacAccountCommentsNotesForm } from '../interfaces';
import { ActivatedRoute } from '@angular/router';
import { FinesService } from '../../../services/fines-service/fines.service';
import { FINES_MAC_STATE_MOCK } from '../../mocks';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM_MOCK } from '../mocks';
import { FINES_MAC_STATUS } from '../../constants';

describe('FinesMacAccountCommentsNotesFormComponent', () => {
  let component: FinesMacAccountCommentsNotesFormComponent;
  let fixture: ComponentFixture<FinesMacAccountCommentsNotesFormComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let formSubmit: IFinesMacAccountCommentsNotesForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;
    formSubmit = FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacAccountCommentsNotesFormComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacAccountCommentsNotesFormComponent);
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

  it('should return true if all mandatory sections have been provided', () => {
    // Arrange
    mockFinesService.finesMacState.courtDetails.status = FINES_MAC_STATUS.PROVIDED;
    mockFinesService.finesMacState.personalDetails.status = FINES_MAC_STATUS.PROVIDED;
    mockFinesService.finesMacState.employerDetails.status = FINES_MAC_STATUS.PROVIDED;
    mockFinesService.finesMacState.offenceDetails.status = FINES_MAC_STATUS.PROVIDED;
    mockFinesService.finesMacState.paymentTerms.status = FINES_MAC_STATUS.PROVIDED;

    // Act
    const result = component['checkMandatorySections']();

    // Assert
    expect(result).toBe(true);
  });

  it('should return false if any mandatory section is missing', () => {
    // Arrange
    mockFinesService.finesMacState.courtDetails.status = FINES_MAC_STATUS.PROVIDED;
    mockFinesService.finesMacState.personalDetails.status = FINES_MAC_STATUS.PROVIDED;
    mockFinesService.finesMacState.employerDetails.status = FINES_MAC_STATUS.PROVIDED;
    mockFinesService.finesMacState.offenceDetails.status = FINES_MAC_STATUS.PROVIDED;
    mockFinesService.finesMacState.paymentTerms.status = FINES_MAC_STATUS.NOT_PROVIDED;

    // Act
    const result = component['checkMandatorySections']();

    // Assert
    expect(result).toBe(false);
  });
});