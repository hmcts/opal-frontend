import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import { FinesReportsBusinessUnitWarningComponent } from './fines-reports-business-unit-warning.component';
import { FinesReportsStore } from '../stores/fines-reports.store';

describe('FinesReportsBusinessUnitWarningComponent', () => {
  const createRouterMock = () => ({
    navigate: vi.fn(),
  });

  const createConsoleLogSpy = () => vi.spyOn(console, 'log').mockImplementation(() => undefined);

  const setup = async (selectedBusinessUnitIds: number[] = []) => {
    const router = createRouterMock();
    const activatedRoute = {
      snapshot: {},
    };

    await TestBed.configureTestingModule({
      imports: [FinesReportsBusinessUnitWarningComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
        {
          provide: Router,
          useValue: router,
        },
        FinesReportsStore,
      ],
    }).compileComponents();

    const finesReportsStore = TestBed.inject(FinesReportsStore);
    finesReportsStore.setSelectedBusinessUnitIds('operational_report_enforcement', selectedBusinessUnitIds);

    const fixture = TestBed.createComponent(FinesReportsBusinessUnitWarningComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    return { component, fixture, router, finesReportsStore };
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the warning copy from the selected business unit count', async () => {
    const { fixture } = await setup([61, 67, 68, 69]);

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('You have selected 4 business units');
    expect(fixture.nativeElement.textContent).toContain('The report creation may time out due to too much data.');
  });

  it('should navigate back to the select business units route with restored selections', async () => {
    const { component, router } = await setup([61, 67, 68, 69]);

    component.handleGoBack();

    expect(router.navigate).toHaveBeenCalledWith(
      [`../../${FINES_REPORTS_ROUTING_PATHS.children.selectBusinessUnits}`],
      {
        relativeTo: expect.any(Object),
      },
    );
  });

  it('should log selected business units when continue is selected', async () => {
    const { component, router } = await setup([61, 67, 68, 69]);
    const consoleLogSpy = createConsoleLogSpy();

    component.handleContinue();

    expect(router.navigate).not.toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith('PO-2305 selected business unit ids', [61, 67, 68, 69]);
  });

  it('should redirect back to select business units when no selection state is available', async () => {
    const { router } = await setup();

    expect(router.navigate).toHaveBeenCalledWith(
      [`../../${FINES_REPORTS_ROUTING_PATHS.children.selectBusinessUnits}`],
      {
        relativeTo: expect.any(Object),
      },
    );
  });

  it('should restore selected business unit ids from the reports store', async () => {
    const { component } = await setup([61, 67, 68, 69]);

    expect(component.selectedBusinessUnitIds()).toEqual([61, 67, 68, 69]);
    expect(component.warningHeading).toBe('You have selected 4 business units');
  });
});
