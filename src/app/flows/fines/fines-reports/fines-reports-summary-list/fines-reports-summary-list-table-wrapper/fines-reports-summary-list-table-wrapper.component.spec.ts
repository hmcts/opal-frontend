import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesReportsSummaryListTableWrapperComponent } from './fines-reports-summary-list-table-wrapper.component';
import { FINES_REPORTS_SUMMARY_LIST_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './constants/fines-reports-summary-list-table-wrapper-table-sort-default.constant';
import { IFinesReportsSummaryListTableData } from '../interfaces/fines-reports-summary-list-table-data.interface';

describe('FinesReportsSummaryListTableWrapperComponent', () => {
  let component: FinesReportsSummaryListTableWrapperComponent;
  let fixture: ComponentFixture<FinesReportsSummaryListTableWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesReportsSummaryListTableWrapperComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesReportsSummaryListTableWrapperComponent);
    component = fixture.componentInstance;
    component.tableData = [
      {
        'Date and time': 1,
        Title: 'Report 1',
        'Business unit': 'London Central & South East',
        'Created by': 'Olivia Smith',
        Status: 'Ready',
        instanceId: '1',
        dateTimeDisplay: '08 Jun 2026 at 09:15',
        isDownloadable: true,
        supportsCsv: true,
      },
    ];
    fixture.detectChanges();
  });

  it('should use the Fines report page size and default sort state', () => {
    expect(component.itemsPerPageSignal()).toBe(25);
    expect(component.sortStateSignal()).toEqual(FINES_REPORTS_SUMMARY_LIST_TABLE_WRAPPER_TABLE_SORT_DEFAULT);
  });

  it('should announce the new page and focus its first date cell after rendering', async () => {
    component.tableData = [
      ...(component.sortedTableDataSignal() as IFinesReportsSummaryListTableData[]),
      {
        'Date and time': 2,
        Title: 'Report 2',
        'Business unit': 'London Central & South East',
        'Created by': 'Olivia Smith',
        Status: 'Ready',
        instanceId: '2',
        dateTimeDisplay: '09 Jun 2026 at 09:15',
        isDownloadable: true,
        supportsCsv: true,
      },
    ];
    fixture.componentRef.setInput('paginationPageTitle', 'Template search and retrieve');
    component.itemsPerPageSignal.set(1);
    fixture.detectChanges();
    const previousFirstCell = fixture.nativeElement.querySelector(
      'td#reportInstanceDateTime-0',
    ) as HTMLTableCellElement;

    component.onPageChange(2);
    fixture.detectChanges();
    await fixture.whenStable();

    const firstCell = fixture.nativeElement.querySelector('td#reportInstanceDateTime-0') as HTMLTableCellElement;
    const status = fixture.nativeElement.querySelector('output') as HTMLOutputElement;
    expect(firstCell).not.toBe(previousFirstCell);
    expect(firstCell.textContent).toContain('08 Jun 2026 at 09:15');
    expect(firstCell.getAttribute('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(firstCell);
    expect(status.textContent?.trim()).toBe('Template search and retrieve, page 2 of 2');
  });

  it('should apply an existing sort state input', () => {
    component.existingSortState = {
      'Date and time': 'none',
      Title: 'ascending',
      'Business unit': 'none',
      'Created by': 'none',
      Status: 'none',
    };

    expect(component.abstractExistingSortState).toEqual(
      expect.objectContaining({
        Title: 'ascending',
      }),
    );
  });

  it('should link report instance dates to the report summary stub route', () => {
    const dateLink: HTMLAnchorElement | null = fixture.nativeElement.querySelector('#reportInstanceDateTime-0 a');

    expect(dateLink?.getAttribute('href')).toBe('/summary/1');
    expect(dateLink?.textContent?.trim()).toBe('08 Jun 2026 at 09:15');
  });

  it('should render downloadable report actions as non-interactive placeholder text until links are implemented', () => {
    const actionCell: HTMLTableCellElement | null = fixture.nativeElement.querySelector('#reportInstanceAction-0');

    expect(actionCell?.querySelector('a')).toBeNull();
    expect(actionCell?.textContent?.trim()).toBe('CSV');
  });

  it('should not render a CSV placeholder when CSV is not supported', () => {
    component.tableData = [
      {
        'Date and time': 1,
        Title: 'Report 1',
        'Business unit': 'London Central & South East',
        'Created by': 'Olivia Smith',
        Status: 'Ready',
        instanceId: '1',
        dateTimeDisplay: '08 Jun 2026 at 09:15',
        isDownloadable: true,
        supportsCsv: false,
      },
    ];
    fixture.detectChanges();
    const actionCell: HTMLTableCellElement | null = fixture.nativeElement.querySelector('#reportInstanceAction-0');

    expect(actionCell?.querySelector('a')).toBeNull();
    expect(actionCell?.textContent?.trim()).toBe('');
  });
});
