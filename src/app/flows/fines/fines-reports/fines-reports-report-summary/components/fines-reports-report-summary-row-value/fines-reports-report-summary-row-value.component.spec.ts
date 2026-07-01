import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesReportsReportSummaryRowValueComponent } from './fines-reports-report-summary-row-value.component';

describe('FinesReportsReportSummaryRowValueComponent', () => {
  let fixture: ComponentFixture<FinesReportsReportSummaryRowValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesReportsReportSummaryRowValueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesReportsReportSummaryRowValueComponent);
  });

  it('should render text values', () => {
    fixture.componentRef.setInput('row', { key: 'Status', value: 'Ready', type: 'text' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Ready');
  });

  it('should render date time values using the shared date format pipe', () => {
    fixture.componentRef.setInput('row', {
      key: 'Date Created',
      value: '2006-06-01T10:36:00',
      type: 'dateTime',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('01 Jun 2006 at 10:36');
  });

  it('should render number values using the shared number pipe', () => {
    fixture.componentRef.setInput('row', { key: 'No. of Records', value: 1245, type: 'number' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('1,245');
  });

  it('should render currency values using the shared currency pipe', () => {
    fixture.componentRef.setInput('row', { key: 'Minimum account balance', value: 120.5, type: 'currency' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('£120.50');
  });

  it('should render not provided values using the shared not provided component', () => {
    fixture.componentRef.setInput('row', { key: 'No. of Records', value: null, type: 'notProvided' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('—');
  });
});
