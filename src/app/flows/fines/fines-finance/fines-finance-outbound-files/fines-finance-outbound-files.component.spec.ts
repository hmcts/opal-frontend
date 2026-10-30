import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { Settings } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CustomFileInterfaceViewerFiltersComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-filters';
import { httpErrorInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-error';
import { contentDigestInterceptor } from '@hmcts/opal-frontend-common/interceptors/content-digest';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesFinanceOutboundFilesComponent } from './fines-finance-outbound-files.component';
import { FINES_FINANCE_BUSINESS_UNIT_REF_DATA_MOCK } from '../mocks/fines-finance-business-unit-ref-data.mock';
import { FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK } from './mocks/fines-finance-outbound-files-response.mock';

describe('FinesFinanceOutboundFilesComponent', () => {
  let fixture: ComponentFixture<FinesFinanceOutboundFilesComponent>;
  let component: FinesFinanceOutboundFilesComponent;
  let httpMock: HttpTestingController;
  let previousZone: typeof Settings.defaultZone;
  const userState = vi.fn();
  const searchUrl = '/opal-file-handling-service/interface-files';
  const filters = (): CustomFileInterfaceViewerFiltersComponent =>
    fixture.debugElement.query(By.directive(CustomFileInterfaceViewerFiltersComponent)).componentInstance;
  const refreshButton = (): HTMLButtonElement => fixture.nativeElement.querySelector('#refresh-reports-button');

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-20T12:00:00Z'));
    previousZone = Settings.defaultZone;
    Settings.defaultZone = 'Europe/London';
    userState.mockReset().mockReturnValue({
      business_unit_users: [
        { business_unit_id: 65, permissions: [{ permission_id: 18 }] },
        { business_unit_id: 78, permissions: [{ permission_id: 17 }] },
        { business_unit_id: 77, permissions: [{ permission_id: 18 }] },
        { business_unit_id: 73, permissions: [] },
      ],
    });
    await TestBed.configureTestingModule({
      imports: [FinesFinanceOutboundFilesComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([httpErrorInterceptor, contentDigestInterceptor])),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { businessUnits: FINES_FINANCE_BUSINESS_UNIT_REF_DATA_MOCK } } },
        },
        { provide: GlobalStore, useValue: { userState, resetBannerError: vi.fn(), setBannerError: vi.fn() } },
        { provide: AppInsightsService, useValue: { logException: vi.fn() } },
      ],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(FinesFinanceOutboundFilesComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
    Settings.defaultZone = previousZone;
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('loads the outbound scope and Last 7 days on entry without inbound filters', async () => {
    fixture.detectChanges();
    const request = httpMock.expectOne((req) => req.url === searchUrl);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.keys().sort()).toEqual([
      'domain',
      'from_date',
      'not_status',
      'not_target',
      'source',
      'to_date',
    ]);
    expect(
      Object.fromEntries(request.request.params.keys().map((key) => [key, request.request.params.get(key)])),
    ).toEqual({
      domain: 'FINES',
      source: 'OPAL',
      not_target: 'OPAL',
      not_status: 'FAILED_SUPERSEDED',
      from_date: '2026-10-13T23:00:00',
      to_date: '2026-10-20T22:59:59.999999',
    });
    expect(component.tableData()).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('There are no outbound interface files to display.');
    request.flush({ number_of_results: 0, interface_files: [] });
    await fixture.whenStable();
    await vi.dynamicImportSettled();
    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Outbound interface files');
    expect(filters().filtersForm.getRawValue()).toMatchObject({
      businessUnit: null,
      dateFilter: 'last7Days',
      days: '',
      dateFrom: '',
      dateTo: '',
    });
    expect(filters().filtersForm.pristine).toBe(true);
    expect(refreshButton().disabled).toBe(false);
    expect(
      (fixture.nativeElement.querySelector('input[type="radio"][value="last7Days"]') as HTMLInputElement).checked,
    ).toBe(true);
    expect(fixture.nativeElement.querySelector('#custom-file-interface-viewer-source-autocomplete')).toBeNull();
    expect(fixture.nativeElement.querySelector('#custom-file-interface-viewer-type-autocomplete')).toBeNull();
    expect(fixture.nativeElement.querySelector('#custom-file-interface-viewer-target-autocomplete')).toBeNull();
    fixture.detectChanges();
    httpMock.expectNone((req) => req.url === searchUrl);
    expect(fixture.nativeElement.textContent).toContain('There are no outbound interface files to display.');
  });

  it('offers permitted business units alphabetically while resolving names for every returned row', () => {
    expect(component.businessUnits).toEqual([
      { name: 'Camberwell Green', value: '0046' },
      { name: 'Camden and Islington', value: '0034' },
    ]);
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url === searchUrl).flush(FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK);
    expect(component.tableData()?.find((row) => row['File ID'] === 2002)?.['Business unit']).toBe('N E Region');
  });

  it('displays outbound columns and dates descending, with ready and failed downloads but no in-progress action', async () => {
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url === searchUrl).flush(FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.tableData()?.[0]).toEqual({
      'File ID': 2001,
      'Date and time': Date.parse('2026-10-20T12:00:00Z'),
      dateTimeDisplay: '20 Oct 2026 at 13:00',
      Title: 'ant_2001.csv',
      'Business unit': 'Camberwell Green',
      Target: 'ANT CSV',
      Status: 'Ready',
      Actions: 'Download',
    });
    const element = fixture.nativeElement as HTMLElement;
    expect(Array.from(element.querySelectorAll('thead th')).map((cell) => cell.textContent?.trim())).toEqual([
      'Date and time',
      'Title',
      'Business unit',
      'Target',
      'Status',
      'Action',
    ]);
    expect(
      Array.from(element.querySelectorAll('tbody tr')).map((row) => row.querySelectorAll('td')[1]?.textContent),
    ).toEqual(['allpay_2002.dat', 'ant_2001.csv', 'allpay_2004.xlsx', 'ant_2003.csv']);
    for (const id of [2001, 2002, 2004]) {
      expect(element.querySelector(`#interface-file-download-${id}`)?.getAttribute('href')).toBe(
        `${searchUrl}/${id}/content`,
      );
    }
    expect(element.querySelector('#interface-file-download-2003')).toBeNull();
    expect(element.querySelector('tbody')?.textContent).toContain('Allpay Out');
    expect(element.querySelector('tbody')?.textContent).toContain('File failed');
    expect(element.querySelector('tbody')?.textContent).toContain('In-Progress');
  });

  it('sorts the final Action column in both directions through its heading button', async () => {
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url === searchUrl).flush(FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK);
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const header = element.querySelector('thead th:last-child')!;
    const button = header.querySelector('button')!;
    const actions = () =>
      Array.from(element.querySelectorAll('tbody tr')).map((row) =>
        row.querySelector('td:last-child')?.textContent?.trim(),
      );

    expect(button.textContent?.trim()).toBe('Action');
    button.click();
    fixture.detectChanges();
    expect(header.getAttribute('aria-sort')).toBe('ascending');
    expect(actions()).toEqual(['', 'Download', 'Download', 'Download']);
    expect(element.querySelector('tbody tr td:nth-child(2)')?.textContent).toBe('ant_2003.csv');

    button.click();
    fixture.detectChanges();
    expect(header.getAttribute('aria-sort')).toBe('descending');
    expect(actions()).toEqual(['Download', 'Download', 'Download', '']);
    expect(element.querySelector('tbody tr:last-child td:nth-child(2)')?.textContent).toBe('ant_2003.csv');
    httpMock.expectNone((req) => req.url.endsWith('/content'));
  });

  it('combines business unit and inclusive dates while retaining files without a business unit', () => {
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url === searchUrl).flush(FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK);
    filters().filtersForm.patchValue({
      businessUnit: '0046',
      dateFilter: 'dateRange',
      dateFrom: '01/10/2026',
      dateTo: '05/10/2026',
    });
    filters().filtersForm.markAsDirty();
    fixture.detectChanges();
    refreshButton().click();
    const request = httpMock.expectOne((req) => req.url === searchUrl);
    expect(request.request.params.has('business_unit_code')).toBe(false);
    expect(request.request.params.get('from_date')).toBe('2026-09-30T23:00:00');
    expect(request.request.params.get('to_date')).toBe('2026-10-05T22:59:59.999999');
    expect(request.request.params.get('source')).toBe('OPAL');
    expect(request.request.params.has('type')).toBe(false);
    request.flush({
      number_of_results: 6,
      interface_files: [
        ...FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK.interface_files!,
        {
          ...FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK.interface_files![0],
          interface_file_id: 2005,
          business_unit_codes: [],
          file_name: 'all-units.csv',
        },
        {
          ...FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK.interface_files![0],
          interface_file_id: 2006,
          business_unit_codes: ['0047', '0046'],
          file_name: 'multiple-units.csv',
        },
      ],
    });
    fixture.detectChanges();
    expect(component.tableData()?.map((row) => row['File ID'])).toEqual([2001, 2004, 2005, 2006]);
    expect(component.tableData()?.[1]['Business unit']).toBeNull();
    expect(fixture.nativeElement.querySelector('tbody').textContent).toContain('allpay_2004.xlsx');
    expect(fixture.nativeElement.querySelector('tbody').textContent).toContain('all-units.csv');
    expect(fixture.nativeElement.querySelector('tbody').textContent).toContain('multiple-units.csv');
    expect(fixture.nativeElement.querySelector('tbody').textContent).not.toContain('allpay_2002.dat');
    expect(fixture.nativeElement.querySelector('tbody').textContent).not.toContain('ant_2003.csv');
    expect(filters().filtersForm.pristine).toBe(true);
    expect(refreshButton().disabled).toBe(false);
  });

  it('keeps the submitted business-unit selection while edits are made during a pending search', () => {
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url === searchUrl).flush(FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK);
    filters().filtersForm.controls.businessUnit.setValue('0046');
    fixture.detectChanges();
    refreshButton().click();
    const submitted = httpMock.expectOne((req) => req.url === searchUrl);
    expect(submitted.request.params.has('business_unit_code')).toBe(false);

    filters().filtersForm.controls.businessUnit.setValue('0034');
    submitted.flush(FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK);
    fixture.detectChanges();

    expect(component.tableData()?.map((row) => row['File ID'])).toEqual([2001, 2004]);
    expect(filters().filtersForm.controls.businessUnit.value).toBe('0034');

    refreshButton().click();
    httpMock.expectOne((req) => req.url === searchUrl).flush(FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK);
    fixture.detectChanges();
    expect(component.tableData()?.map((row) => row['File ID'])).toEqual([2003, 2004]);
  });

  it('refreshes unchanged successful criteria and displays the latest response each time', () => {
    fixture.detectChanges();
    const initial = httpMock.expectOne((req) => req.url === searchUrl);
    const criteria = initial.request.params.toString();
    initial.flush(FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK);
    fixture.detectChanges();

    refreshButton().click();
    const firstRefresh = httpMock.expectOne((req) => req.url === searchUrl);
    expect(firstRefresh.request.params.toString()).toBe(criteria);
    firstRefresh.flush({
      number_of_results: 1,
      interface_files: [
        { ...FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK.interface_files![0], file_name: 'latest-outbound.csv' },
      ],
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('tbody').textContent).toContain('latest-outbound.csv');
    expect(refreshButton().disabled).toBe(false);

    refreshButton().click();
    const secondRefresh = httpMock.expectOne((req) => req.url === searchUrl);
    expect(secondRefresh.request.params.toString()).toBe(criteria);
    secondRefresh.flush({ number_of_results: 0, interface_files: [] });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('There are no outbound interface files to display.');
    expect(refreshButton().disabled).toBe(false);
  });

  it.each([
    { name: 'invalid calendar date', dateFrom: '32/10/2026', dateTo: '05/10/2026' },
    { name: 'reversed range', dateFrom: '05/10/2026', dateTo: '01/10/2026' },
  ])('blocks an outbound request for an $name', ({ dateFrom, dateTo }) => {
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url === searchUrl).flush(FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK);
    const rows = component.tableData();
    filters().filtersForm.patchValue({ dateFilter: 'dateRange', dateFrom, dateTo });
    filters().filtersForm.markAsDirty();
    fixture.detectChanges();
    refreshButton().click();
    fixture.detectChanges();
    httpMock.expectNone((req) => req.url === searchUrl);
    expect(filters().filtersForm.invalid).toBe(true);
    expect(fixture.nativeElement.querySelector('.govuk-error-summary')).not.toBeNull();
    expect(component.tableData()).toBe(rows);
  });

  it('applies a named business-unit choice and All business units through the autocomplete', async () => {
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url === searchUrl).flush(FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK);
    await fixture.whenStable();
    await vi.dynamicImportSettled();
    const input = fixture.nativeElement.querySelector(
      '#custom-file-interface-viewer-business-unit-autocomplete',
    ) as HTMLInputElement;
    for (const [name, code] of [
      ['Camberwell Green', '0046'],
      ['All business units', ''],
    ]) {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.click();
      const option = await vi.waitFor(() => {
        const items = Array.from(
          fixture.nativeElement.querySelectorAll(`#${input.id}__listbox [role="option"]`) as NodeListOf<HTMLElement>,
        );
        const match = items.find((item) => item.textContent?.trim() === name);
        expect(match).toBeDefined();
        return match!;
      });
      option.click();
      fixture.detectChanges();
      expect(filters().filtersForm.controls.businessUnit.value).toBe(code);
      refreshButton().click();
      const request = httpMock.expectOne((req) => req.url === searchUrl);
      expect(request.request.params.has('business_unit_code')).toBe(false);
      expect(request.request.params.get('source')).toBe('OPAL');
      expect(request.request.params.get('not_target')).toBe('OPAL');
      request.flush(FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK);
      fixture.detectChanges();
      expect(component.tableData()?.map((row) => row['File ID'])).toEqual(
        code ? [2001, 2004] : [2001, 2002, 2003, 2004],
      );
    }
  });

  it('retains rows after a failed filtered search and retries the same criteria without navigating', () => {
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url === searchUrl).flush(FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK);
    const rows = component.tableData();
    const router = TestBed.inject(Router);
    const route = router.url;
    const navigate = vi.spyOn(router, 'navigate');
    filters().filtersForm.controls.businessUnit.setValue('0046');
    filters().filtersForm.markAsDirty();
    fixture.detectChanges();
    refreshButton().click();
    const failed = httpMock.expectOne((req) => req.url === searchUrl);
    const criteria = failed.request.params.toString();
    failed.flush({}, { status: 500, statusText: 'Search failed' });
    fixture.detectChanges();
    expect(component.tableData()).toBe(rows);
    expect(refreshButton().disabled).toBe(false);
    expect(filters().filtersForm.pristine).toBe(true);
    expect(TestBed.inject(GlobalStore).setBannerError).toHaveBeenCalled();
    expect(router.url).toBe(route);
    expect(navigate).not.toHaveBeenCalled();
    refreshButton().click();
    const retry = httpMock.expectOne((req) => req.url === searchUrl);
    expect(retry.request.params.toString()).toBe(criteria);
    retry.flush({ number_of_results: 0, interface_files: null });
    fixture.detectChanges();
    expect(component.tableData()).toEqual([]);
    expect(refreshButton().disabled).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('There are no outbound interface files to display.');
  });

  it('cancels superseded searches and the pending request when leaving the page', () => {
    fixture.detectChanges();
    const initial = httpMock.expectOne((req) => req.url === searchUrl);
    filters().filtersForm.controls.businessUnit.setValue('0046');
    filters().filtersForm.markAsDirty();
    fixture.detectChanges();
    refreshButton().click();
    const refreshed = httpMock.expectOne((req) => req.url === searchUrl);
    expect(initial.cancelled).toBe(true);
    refreshed.flush(FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK);
    expect(component.tableData()?.map((row) => row['File ID'])).toEqual([2001, 2004]);
    filters().filtersForm.controls.businessUnit.setValue('0034');
    filters().filtersForm.markAsDirty();
    fixture.detectChanges();
    refreshButton().click();
    const pending = httpMock.expectOne((req) => req.url === searchUrl);
    fixture.destroy();
    expect(pending.cancelled).toBe(true);
  });

  it('downloads the original CSV and binary blobs using the displayed filenames and existing interceptors', async () => {
    const createObjectURL = vi.fn().mockReturnValue('blob:outbound-download');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal(
      'URL',
      class extends URL {
        static override createObjectURL = createObjectURL;
        static override revokeObjectURL = revokeObjectURL;
      },
    );
    const filenames: string[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      filenames.push(this.download);
    });
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url === searchUrl).flush(FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK);
    fixture.detectChanges();
    const csv = new Blob(['account,amount\r\n1234,10.00\r\n'], { type: 'application/octet-stream' });
    const binary = new Blob([new Uint8Array([0x50, 0x4b, 0x03, 0x04])], { type: 'application/octet-stream' });
    for (const [id, blob] of [
      [2001, csv],
      [2004, binary],
    ] as const) {
      const link = fixture.nativeElement.querySelector(`#interface-file-download-${id}`) as HTMLAnchorElement;
      expect(link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))).toBe(false);
      const request = httpMock.expectOne(`${searchUrl}/${id}/content`);
      expect(request.request.method).toBe('GET');
      expect(request.request.responseType).toBe('blob');
      expect(request.request.headers.get('Accept')).toBe('application/octet-stream');
      expect(request.request.headers.get('Want-Content-Digest')).toBe('sha-512');
      request.flush(blob, { headers: { 'Content-Type': 'application/octet-stream' } });
    }
    expect(filenames).toEqual(['ant_2001.csv', 'allpay_2004.xlsx']);
    expect(createObjectURL.mock.calls[0][0]).toBe(csv);
    expect(createObjectURL.mock.calls[1][0]).toBe(binary);
    await vi.waitFor(() => expect(revokeObjectURL).toHaveBeenCalledTimes(2));
  });

  it('focuses a failed download summary and returns to the outbound action', async () => {
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url === searchUrl).flush(FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK);
    fixture.detectChanges();
    const download = fixture.nativeElement.querySelector('#interface-file-download-2002') as HTMLAnchorElement;
    download.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    httpMock.expectOne(`${searchUrl}/2002/content`).flush(new Blob(), {
      status: 500,
      statusText: 'Download failed',
    });
    fixture.detectChanges();
    const summary = fixture.nativeElement.querySelector('.govuk-error-summary') as HTMLElement;

    expect(summary.textContent).toContain('The file could not be downloaded. Try again.');
    await vi.waitFor(() => expect(document.activeElement).toBe(summary));
    summary.querySelector('a')!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    expect(document.activeElement).toBe(download);
  });

  it('returns to the outbound results when a failed action is on another page', async () => {
    fixture.detectChanges();
    httpMock
      .expectOne((req) => req.url === searchUrl)
      .flush({
        number_of_results: 26,
        interface_files: Array.from({ length: 26 }, (_, index) => ({
          ...FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK.interface_files![0],
          interface_file_id: index + 2001,
        })),
      });
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('#interface-file-download-2001') as HTMLAnchorElement).dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
    const request = httpMock.expectOne(`${searchUrl}/2001/content`);
    (
      fixture.nativeElement.querySelector(
        '#outbound-file-viewer-pagination a[aria-label="Page 2"]',
      ) as HTMLAnchorElement
    ).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    request.flush(new Blob(), { status: 500, statusText: 'Download failed' });
    fixture.detectChanges();
    const summary = fixture.nativeElement.querySelector('.govuk-error-summary') as HTMLElement;
    await vi.waitFor(() => expect(document.activeElement).toBe(summary));

    summary.querySelector('a')!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('#outbound-interface-files-results'));
    expect(fixture.nativeElement.querySelector('#interface-file-download-2026')).not.toBeNull();
  });

  it('cancels a pending outbound download when leaving the page', () => {
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url === searchUrl).flush(FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('#interface-file-download-2001') as HTMLAnchorElement).dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
    const request = httpMock.expectOne(`${searchUrl}/2001/content`);

    fixture.destroy();

    expect(request.cancelled).toBe(true);
  });

  it.each([404, 422, 500])('keeps the outbound route and rows after a %s download failure', (status) => {
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url === searchUrl).flush(FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK);
    fixture.detectChanges();
    const rows = component.tableData();
    const router = TestBed.inject(Router);
    const route = router.url;
    const navigate = vi.spyOn(router, 'navigate');
    (fixture.nativeElement.querySelector('#interface-file-download-2002') as HTMLAnchorElement).dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
    httpMock
      .expectOne(`${searchUrl}/2002/content`)
      .flush(new Blob([JSON.stringify({ status })], { type: 'application/problem+json' }), {
        status,
        statusText: 'Download failed',
      });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.govuk-error-summary').textContent).toContain(
      'The file could not be downloaded. Try again.',
    );
    expect(component.tableData()).toBe(rows);
    expect(fixture.nativeElement.querySelector('tbody').textContent).toContain('ant_2001.csv');
    expect(router.url).toBe(route);
    expect(navigate).not.toHaveBeenCalled();
    expect(TestBed.inject(GlobalStore).setBannerError).toHaveBeenCalled();
    expect(TestBed.inject(AppInsightsService).logException).toHaveBeenCalled();
  });
});
