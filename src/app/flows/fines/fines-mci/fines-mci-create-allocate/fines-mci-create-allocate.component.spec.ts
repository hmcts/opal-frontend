import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FinesMciCreateAllocateComponent } from './fines-mci-create-allocate.component';

describe('FinesMciCreateAllocateComponent', () => {
  let component: FinesMciCreateAllocateComponent;
  let fixture: ComponentFixture<FinesMciCreateAllocateComponent>;
  const opalFinesServiceMock = {
    getTills: vi.fn(),
  };

  const tillsResponse = {
    tills: [
      {
        till_id: 99000000010005,
        till_number: 9005,
        payments_count: null,
        amount: null,
        business_unit_name: 'Westminster - North (Wells Street)',
        processed_by: null,
        date_processed: '2025-06-12T13:31:27.270Z',
      },
    ],
  };

  beforeEach(async () => {
    opalFinesServiceMock.getTills.mockReturnValue(of(tillsResponse));

    await TestBed.configureTestingModule({
      imports: [FinesMciCreateAllocateComponent],
      providers: [provideRouter([]), { provide: OpalFines, useValue: opalFinesServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMciCreateAllocateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render a manual cash input placeholder page', () => {
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(text).toContain('Manual cash input');
    expect(text).toContain('Create till');
    expect(text).toContain('Allocate tills');
    expect(text).toContain('Select the tills you want to allocate');
    expect(text).toContain('Allocate');
    expect(nativeElement.querySelector('a')?.getAttribute('href')).toBe('/fines/dashboard/finance');
    const createTillLink = nativeElement.querySelector<HTMLAnchorElement>('#create-till-button');
    expect(createTillLink?.tagName).toBe('A');
    expect(createTillLink?.classList).toContain('govuk-button');
    expect(createTillLink?.getAttribute('href')).toBe('/fines/manual-cash-input/create/till/select-bu');
  });

  it('should render tills returned by the API', () => {
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('0 of 1 selected');
    expect(text).toContain('Till number');
    expect(text).toContain('Payments');
    expect(text).toContain('Amount');
    expect(text).toContain('Business unit');
    expect(text).toContain('Created by');
    expect(text).toContain('Date created');
    expect(text).toContain('9005');
    expect(text).toContain('Westminster - North (Wells Street)');
    const dateService = TestBed.inject(DateService);
    const createdDate = dateService.getFromIso('2025-06-12T13:31:27.270Z');
    const expectedDate = dateService.toFormat(createdDate.setLocale('en-gb'), "dd MMMM yyyy 'at' HH:mm");
    expect(text).toContain(expectedDate);
  });

  it('should update the selected tills count when a till is selected', () => {
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    const checkbox = nativeElement.querySelector<HTMLInputElement>('#fines-mci-create-allocate-99000000010005');

    checkbox!.checked = true;
    checkbox!.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(nativeElement.textContent).toContain('1 of 1 selected');
  });

  it('should warn before unloading only when tills are selected', () => {
    fixture.detectChanges();
    const eventWithoutSelection = new Event('beforeunload', { cancelable: true });

    window.dispatchEvent(eventWithoutSelection);

    expect(eventWithoutSelection.defaultPrevented).toBe(false);

    component.handleSelectedTillsCountChange(1);
    const eventWithSelection = new Event('beforeunload', { cancelable: true });

    window.dispatchEvent(eventWithSelection);

    expect(eventWithSelection.defaultPrevented).toBe(true);
  });

  it('should show the empty state when the API returns no tills', () => {
    opalFinesServiceMock.getTills.mockReturnValue(of({ tills: [] }));
    fixture = TestBed.createComponent(FinesMciCreateAllocateComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('There are no outstanding tills to allocate.');
  });

  it('should show an error when loading tills fails', () => {
    opalFinesServiceMock.getTills.mockReturnValue(throwError(() => new Error('Request failed')));
    fixture = TestBed.createComponent(FinesMciCreateAllocateComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('There was a problem loading tills. Try again later.');
  });
});
