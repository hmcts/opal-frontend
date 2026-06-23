import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { FinesReportsReportSummaryComponent } from './fines-reports-report-summary.component';

describe('FinesReportsReportSummaryComponent', () => {
  const setup = async (): Promise<{
    component: FinesReportsReportSummaryComponent;
    fixture: ComponentFixture<FinesReportsReportSummaryComponent>;
  }> => {
    await TestBed.configureTestingModule({
      imports: [FinesReportsReportSummaryComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                reportInstanceId: 'report-instance-123',
              }),
            },
            parent: {
              snapshot: {
                paramMap: convertToParamMap({
                  reportId: 'operational_report_enforcement',
                }),
              },
            },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(FinesReportsReportSummaryComponent);
    const component = fixture.componentInstance;

    return { component, fixture };
  };

  it('should create', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
  });

  it('should render the selected report route ids', async () => {
    const { component, fixture } = await setup();

    fixture.detectChanges();

    expect(component.reportId).toBe('operational_report_enforcement');
    expect(component.reportInstanceId).toBe('report-instance-123');
    expect(fixture.nativeElement.textContent).toContain('Report summary');
    expect(fixture.nativeElement.textContent).toContain('operational_report_enforcement');
    expect(fixture.nativeElement.textContent).toContain('report-instance-123');
  });
});
