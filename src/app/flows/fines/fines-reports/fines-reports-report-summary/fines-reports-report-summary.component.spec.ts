import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach } from 'vitest';
import { FinesReportsReportSummaryComponent } from './fines-reports-report-summary.component';

describe('FinesReportsReportSummaryComponent', () => {
  let component: FinesReportsReportSummaryComponent;
  let fixture: ComponentFixture<FinesReportsReportSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesReportsReportSummaryComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesReportsReportSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a stub report summary page', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Report Summary');
    expect(text).toContain('This page is not available yet.');
    expect(fixture.nativeElement.querySelector('a')?.getAttribute('href')).toBe('/summary-list');
  });
});
