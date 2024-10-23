import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsMinorCreditorFormComponent } from './fines-mac-offence-details-minor-creditor-form.component';
import { FinesMacOffenceDetailsService } from '../../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE } from '../../constants/fines-mac-offence-details-draft-state.constant';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('FinesMacOffenceDetailsMinorCreditorFormComponent', () => {
  let component: FinesMacOffenceDetailsMinorCreditorFormComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsMinorCreditorFormComponent>;
  let mockFinesMacOffenceDetailsService: jasmine.SpyObj<FinesMacOffenceDetailsService>;

  beforeEach(async () => {
    mockFinesMacOffenceDetailsService = jasmine.createSpyObj(FinesMacOffenceDetailsService, [
      'finesMacOffenceDetailsDraftState',
    ]);
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE;

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsMinorCreditorFormComponent],
      providers: [
        { provide: FinesMacOffenceDetailsService, useValue: mockFinesMacOffenceDetailsService },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('offence-details'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsMinorCreditorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
