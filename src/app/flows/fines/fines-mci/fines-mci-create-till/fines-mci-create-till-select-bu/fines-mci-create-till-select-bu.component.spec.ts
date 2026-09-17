import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciCreateTillSelectBuComponent } from './fines-mci-create-till-select-bu.component';

describe('FinesMciCreateTillSelectBuComponent', () => {
  let component: FinesMciCreateTillSelectBuComponent;
  let fixture: ComponentFixture<FinesMciCreateTillSelectBuComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillSelectBuComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMciCreateTillSelectBuComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a create till business unit autocomplete page', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const text = nativeElement.textContent;

    expect(text).toContain('Create till');
    expect(text).toContain('Select a business unit');
    expect(nativeElement.querySelector('.govuk-button-group')?.classList).toContain(
      'fines-mci-create-till-select-bu-button-group',
    );
    expect(nativeElement.querySelector('opal-lib-govuk-cancel-link')).toBeTruthy();
  });

  it('should navigate to create and allocate when cancel is selected', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.debugElement.query(By.css('opal-lib-govuk-cancel-link')).triggerEventHandler('linkClickEvent', true);

    expect(navigateSpy).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create-allocate']);
  });

  it('should render selected business unit summary when the user has one business unit', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillSelectBuComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                businessUnits: {
                  count: 1,
                  refData: [OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]],
                },
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMciCreateTillSelectBuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const text = nativeElement.textContent;

    expect(nativeElement.querySelector('opal-lib-govuk-summary-list')).toBeTruthy();
    expect(text).toContain('Business unit');
    expect(text).toContain('Historical Debt');
    expect(text).not.toContain('The till will be created in Historical Debt');
    expect(nativeElement.querySelector('opal-lib-alphagov-accessible-autocomplete')).toBeFalsy();
  });
});
