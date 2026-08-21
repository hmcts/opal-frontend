import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../routing/constants/fines-reports-create-routing-paths.constant';
import { FinesReportsBusinessUnitWarningComponent } from './fines-reports-business-unit-warning.component';
import { FinesReportsStore } from '../stores/fines-reports.store';

describe('FinesReportsBusinessUnitWarningComponent', () => {
  const setup = async (selectedBusinessUnitIds: number[] = []) => {
    const router = { navigate: vi.fn() };
    const activatedRoute = { snapshot: {} };

    await TestBed.configureTestingModule({
      imports: [FinesReportsBusinessUnitWarningComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
        FinesReportsStore,
      ],
    }).compileComponents();

    const finesReportsStore = TestBed.inject(FinesReportsStore);
    finesReportsStore.setSelectedBusinessUnitIds('operational_report_enforcement', selectedBusinessUnitIds);

    const fixture = TestBed.createComponent(FinesReportsBusinessUnitWarningComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    return { component, fixture, router };
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('should render the selected business unit count and warning copy', async () => {
    const { fixture } = await setup([61, 67, 68, 69]);

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('You have selected 4 business units');
    expect(fixture.nativeElement.textContent).toContain('The report creation may time out due to too much data.');
  });

  it('should return to Select business units when Go back is selected', async () => {
    const { component, router } = await setup([61, 67, 68, 69]);

    component.handleGoBack();

    expect(router.navigate).toHaveBeenCalledWith(
      [`../${FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits}`],
      { relativeTo: expect.any(Object) },
    );
  });

  it('should continue to the report parameters hand-off screen', async () => {
    const { component, router } = await setup([61, 67, 68, 69]);

    component.handleContinue();

    expect(router.navigate).toHaveBeenCalledWith(
      [`../${FINES_REPORTS_CREATE_ROUTING_PATHS.children.reportParameters}`],
      { relativeTo: expect.any(Object) },
    );
  });
});
