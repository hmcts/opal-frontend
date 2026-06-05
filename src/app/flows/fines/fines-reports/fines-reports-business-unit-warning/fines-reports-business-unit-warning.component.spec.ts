import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import { FinesReportsBusinessUnitWarningComponent } from './fines-reports-business-unit-warning.component';

describe('FinesReportsBusinessUnitWarningComponent', () => {
  const createRouterMock = (selectedBusinessUnitIds: number[] = []) => ({
    navigate: vi.fn(),
    currentNavigation: vi.fn(() =>
      selectedBusinessUnitIds.length > 0 ? { extras: { state: { selectedBusinessUnitIds } } } : null,
    ),
  });

  const createLocationMock = (selectedBusinessUnitIds: number[] = []) => ({
    getState: vi.fn(() => (selectedBusinessUnitIds.length > 0 ? { selectedBusinessUnitIds } : {})),
  });

  const setup = async (selectedBusinessUnitIds: number[] = [], useCurrentNavigation = true) => {
    const router = createRouterMock(selectedBusinessUnitIds);
    if (!useCurrentNavigation) {
      router.currentNavigation = vi.fn(() => null);
    }
    const location = createLocationMock(selectedBusinessUnitIds);
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
        {
          provide: Location,
          useValue: location,
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(FinesReportsBusinessUnitWarningComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    return { component, fixture, router };
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('should render the warning copy from the selected business unit count', async () => {
    const { fixture } = await setup([61, 67, 68, 69]);

    expect(fixture.nativeElement.querySelector('.govuk-caption-l')?.textContent?.trim()).toBe('Create report');
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('You have selected 4 business units');
    expect(fixture.nativeElement.textContent).toContain('The report creation may time out due to too much data.');
  });

  it('should navigate back to the select business units route with restored selections', async () => {
    const { component, router } = await setup([61, 67, 68, 69]);

    component.handleGoBack();

    expect(router.navigate).toHaveBeenCalledWith(['..', FINES_REPORTS_ROUTING_PATHS.children.selectBusinessUnits], {
      relativeTo: expect.any(Object),
      state: { selectedBusinessUnitIds: [61, 67, 68, 69] },
    });
  });

  it('should navigate to the summary list when continue is selected', async () => {
    const { component, router } = await setup([61, 67, 68, 69]);

    component.handleContinue();

    expect(router.navigate).toHaveBeenCalledWith(['..', FINES_REPORTS_ROUTING_PATHS.children.summaryList], {
      relativeTo: expect.any(Object),
    });
  });

  it('should redirect back to select business units when no selection state is available', async () => {
    const { router } = await setup();

    expect(router.navigate).toHaveBeenCalledWith(['..', FINES_REPORTS_ROUTING_PATHS.children.selectBusinessUnits], {
      relativeTo: expect.any(Object),
    });
  });

  it('should restore selected business unit ids from location state when current navigation is unavailable', async () => {
    const { component } = await setup([61, 67, 68, 69], false);

    expect(component.selectedBusinessUnitIds).toEqual([61, 67, 68, 69]);
    expect(component.warningHeading).toBe('You have selected 4 business units');
  });
});
