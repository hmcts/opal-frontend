import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesMciCreateTillSelectBuComponent } from './fines-mci-create-till-select-bu.component';

describe('FinesMciCreateTillSelectBuComponent', () => {
  let component: FinesMciCreateTillSelectBuComponent;
  let fixture: ComponentFixture<FinesMciCreateTillSelectBuComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a create till business unit autocomplete page', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Create till');
    expect(text).toContain('Business unit');
    expect(text).toContain('Enter the area where the till will be created');
    expect(fixture.nativeElement.querySelector('a')?.getAttribute('href')).toBe(
      '/fines/manual-cash-input/create-allocate',
    );
  });

  it('should render selected business unit text when the user has one business unit', async () => {
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

    expect(fixture.nativeElement.textContent).toContain('The till will be created in Historical Debt');
  });
});
