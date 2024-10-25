import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsRemoveMinorCreditorComponent } from './fines-mac-offence-details-remove-minor-creditor.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { UtilsService } from '@services/utils/utils.service';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from '../mocks/fines-mac-offence-details-draft-state.mock';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK } from '../fines-mac-offence-details-minor-creditor/mocks/fines-mac-offence-details-minor-creditor-form.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

fdescribe('FinesMacOffenceDetailsRemoveMinorCreditorComponent', () => {
  let component: FinesMacOffenceDetailsRemoveMinorCreditorComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsRemoveMinorCreditorComponent>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockFinesMacOffenceDetailsService: jasmine.SpyObj<FinesMacOffenceDetailsService>;

  beforeEach(async () => {
    mockFinesMacOffenceDetailsService = jasmine.createSpyObj(FinesMacOffenceDetailsService, [
      'finesMacOffenceDetailsDraftState',
    ]);
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK;

    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService.finesMacState = {
      ...FINES_MAC_STATE_MOCK,
      minorCreditors: [FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK],
    };

    mockUtilsService = jasmine.createSpyObj(UtilsService, ['formatSortCode', 'upperCaseFirstLetter']);

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsRemoveMinorCreditorComponent],
      providers: [
        { provide: FinesMacOffenceDetailsService, useValue: mockFinesMacOffenceDetailsService },
        { provide: FinesService, useValue: mockFinesService },
        { provide: UtilsService, useValue: mockUtilsService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('offence-details'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsRemoveMinorCreditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
