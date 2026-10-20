import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesApiIgnoredComponent } from './fines-api-ignored.component';
import { IFinesApiIgnoredRow } from './interfaces/fines-api-ignored-data.interface';

const rows: IFinesApiIgnoredRow[] = [
  {
    interfaceJobId: '901',
    interfaceFileId: '101',
    'File name': 'file-10.csv',
    Source: 'Zulu',
    'Business unit': 'BU Beta',
    'Date processed': 20,
    dateProcessedDisplay: '01 November 2026 at 13:00',
  },
  {
    interfaceJobId: '902',
    interfaceFileId: '102',
    'File name': 'file-2.csv',
    Source: 'Alpha',
    'Business unit': 'BU Alpha',
    'Date processed': 10,
    dateProcessedDisplay: '31 October 2026 at 13:00',
  },
];

describe('FinesApiIgnoredComponent', () => {
  let fixture: ComponentFixture<FinesApiIgnoredComponent>;
  const native = (): HTMLElement => fixture.nativeElement;
  const names = (): string[] => Array.from(native().querySelectorAll('tbody a'), (link) => link.textContent!.trim());
  const header = (column: string): HTMLTableCellElement =>
    Array.from(native().querySelectorAll('th')).find((th) => th.textContent!.trim() === column)!;
  const sort = (column: string): void => {
    header(column).querySelector('button')!.click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesApiIgnoredComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(FinesApiIgnoredComponent);
  });

  it('renders the heading, hint and retry control without a table while empty or not yet loaded', () => {
    fixture.detectChanges();
    expect(native().textContent).toContain('Showing ignored files for the past 14 days.');
    expect(native().querySelector('table')).toBeNull();
    expect(native().querySelector('#fines-api-ignored-refresh')).toBeTruthy();
    fixture.componentRef.setInput('tabData', { rows: [] });
    fixture.detectChanges();
    expect(native().querySelector('table')).toBeNull();
    expect(native().querySelector('h2')!.textContent).toBe('Ignored files');
  });

  it.each(['File name', 'Source', 'Business unit', 'Date processed'])(
    'sorts %s both ways without mutating API order',
    (column) => {
      fixture.componentRef.setInput('tabData', { rows });
      fixture.detectChanges();
      expect(names()).toEqual(['file-10.csv', 'file-2.csv']);
      sort(column);
      expect(names()).toEqual(['file-2.csv', 'file-10.csv']);
      expect(header(column).getAttribute('aria-sort')).toBe('ascending');
      sort(column);
      expect(names()).toEqual(['file-10.csv', 'file-2.csv']);
      expect(header(column).getAttribute('aria-sort')).toBe('descending');
      expect(rows[0]['File name']).toBe('file-10.csv');
    },
  );

  it('sorts only one column and resets to original order immediately on Refresh, even without a response', () => {
    fixture.componentRef.setInput('tabData', { rows });
    const refresh = vi.fn();
    fixture.componentInstance.refreshRequested.subscribe(refresh);
    fixture.detectChanges();
    sort('File name');
    sort('Source');
    expect(header('File name').getAttribute('aria-sort')).toBe('none');
    expect(header('Source').getAttribute('aria-sort')).toBe('ascending');
    native().querySelector<HTMLButtonElement>('#fines-api-ignored-refresh')!.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledOnce();
    expect(names()).toEqual(['file-10.csv', 'file-2.csv']);
    expect(header('Source').getAttribute('aria-sort')).toBe('none');
  });

  it('links each filename using the job ID rather than the file ID', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    fixture.componentRef.setInput('tabData', { rows });
    fixture.detectChanges();
    const links = native().querySelectorAll<HTMLAnchorElement>('tbody a');
    expect(Array.from(links, (link) => link.getAttribute('href'))).toEqual([
      '/fines/auto-payment-in/file-summary/901',
      '/fines/auto-payment-in/file-summary/902',
    ]);
    links[1].click();
    expect(TestBed.inject(Router).serializeUrl(navigate.mock.calls[0][0] as import('@angular/router').UrlTree)).toBe(
      '/fines/auto-payment-in/file-summary/902',
    );
  });
});
