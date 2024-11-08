import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsSearchOffencesComponent } from './fines-mac-offence-details-search-offences.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from '../mocks/fines-mac-offence-details-draft-state.mock';

describe('FinesMacOffenceDetailsSearchOffencesComponent', () => {
  let component: FinesMacOffenceDetailsSearchOffencesComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsSearchOffencesComponent>;
  let mockFinesMacOffenceDetailsService: jasmine.SpyObj<FinesMacOffenceDetailsService>;

  beforeEach(async () => {
    mockFinesMacOffenceDetailsService = jasmine.createSpyObj(FinesMacOffenceDetailsService, [
      'finesMacOffenceDetailsDraftState',
    ]);
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = {
      ...FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
    };
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsSearchOffencesComponent],
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

    fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true for canDeactivate', () => {
    const result = component.canDeactivate();
    expect(result).toBeTrue();
  });

  it('should navigate to account-details page on handleRoute', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.handleRoute('test');
    expect(routerSpy).toHaveBeenCalledWith(['test'], { relativeTo: component['activatedRoute'].parent });
  });

  it('should navigate to relative route with event', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const event = jasmine.createSpyObj('event', ['preventDefault']);

    component.handleRoute('test', event);

    expect(routerSpy).toHaveBeenCalledWith(['test'], { relativeTo: component['activatedRoute'].parent });
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
