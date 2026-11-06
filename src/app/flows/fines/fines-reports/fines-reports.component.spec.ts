import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesReportsComponent } from './fines-reports.component';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesReportsSummaryListStore } from './fines-reports-summary-list/stores/fines-reports-summary-list.store';

describe('FinesReportsComponent', () => {
  let component: FinesReportsComponent;
  let fixture: ComponentFixture<FinesReportsComponent>;
  const mockFinesReportsSummaryListStore = {
    resetFilters: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [FinesReportsComponent],
      providers: [
        {
          provide: FinesReportsSummaryListStore,
          useValue: mockFinesReportsSummaryListStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset summary list filters when the reports flow is destroyed', () => {
    fixture.destroy();

    expect(mockFinesReportsSummaryListStore.resetFilters).toHaveBeenCalled();
  });
});
