import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { Settings } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CustomFileInterfaceViewerFiltersComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-filters';
import { httpErrorInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-error';
import { contentDigestInterceptor } from '@hmcts/opal-frontend-common/interceptors/content-digest';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesFinanceInboundFilesComponent } from './fines-finance-inbound-files.component';
import { FINES_FINANCE_BUSINESS_UNIT_REF_DATA_MOCK } from '../mocks/fines-finance-business-unit-ref-data.mock';
import { FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK } from './mocks/fines-finance-inbound-files-response.mock';

describe('FinesFinanceInboundFilesComponent', () => {
  let fixture: ComponentFixture<FinesFinanceInboundFilesComponent>;
  let component: FinesFinanceInboundFilesComponent;
  let httpMock: HttpTestingController;
  let previousZone: typeof Settings.defaultZone;
  const userState = vi.fn();

  /**
   * Records browser saves while leaving HTTP requests and download orchestration real.
   * @returns Object URL spies and the filenames and anchors used by FileService.
   */
  const mockFileSave = () => {
    const createObjectURL = vi.fn().mockReturnValue('blob:test-download');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal(
      'URL',
      class extends URL {
        static override createObjectURL = createObjectURL;
        static override revokeObjectURL = revokeObjectURL;
      },
    );
    const filenames: string[] = [];
    const links: HTMLAnchorElement[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      filenames.push(this.download);
      links.push(this);
    });
    return { createObjectURL, revokeObjectURL, filenames, links };
  };

  /**
   * Waits for the shared autocomplete's lazy initializer to create its visible input.
   * @param filter - Filter input identifier between the common prefix and suffix.
   * @returns The initialized autocomplete input.
   */
  const getFilterInput = (filter: string): Promise<HTMLInputElement> =>
    vi.waitFor(() => {
      const input = fixture.nativeElement.querySelector(
        '#custom-file-interface-viewer-' + filter + '-autocomplete',
      ) as HTMLInputElement | null;
      expect(input).not.toBeNull();
      return input!;
    });

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-20T12:00:00Z'));
    previousZone = Settings.defaultZone;
    Settings.defaultZone = 'Europe/London';
    userState.mockReset().mockReturnValue({
      business_unit_users: [{ business_unit_id: 77, permissions: [{ permission_id: 18 }] }],
    });
    await TestBed.configureTestingModule({
      imports: [FinesFinanceInboundFilesComponent],
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
    fixture = TestBed.createComponent(FinesFinanceInboundFilesComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
    Settings.defaultZone = previousZone;
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('requests files on entry with blank optional filters and Last 7 days selected', async () => {
    fixture.detectChanges();
    const request = httpMock.expectOne((req) => req.url === '/opal-file-handling-service/interface-files');
    expect(request.request.method).toBe('GET');
    expect(request.request.params.keys().sort()).toEqual([
      'domain',
      'from_date',
      'not_status',
      'target',
      'to_date',
      'type',
    ]);
    expect(request.request.params.get('type')).toBe('SOURCE,TRANSFORMED_JSON');
    expect(request.request.params.get('target')).toBe('OPAL');
    expect(request.request.params.get('from_date')).toBe('2026-10-13T23:00:00');
    expect(request.request.params.get('to_date')).toBe('2026-10-20T22:59:59.999999');
    expect(component.tableData()).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('There are no inbound interface files to display.');
    request.flush({ number_of_results: 0, interface_files: [] });
    TestBed.tick();
    await fixture.whenStable();
    const filters = fixture.debugElement.query(By.directive(CustomFileInterfaceViewerFiltersComponent))
      .componentInstance as CustomFileInterfaceViewerFiltersComponent;
    expect(filters.filtersForm.getRawValue()).toEqual({
      businessUnit: null,
      source: null,
      fileType: null,
      dateFilter: 'last7Days',
      days: '',
      dateFrom: '',
      dateTo: '',
    });
    expect(filters.filtersForm.pristine).toBe(true);
    expect((fixture.nativeElement.querySelector('#refresh-reports-button') as HTMLButtonElement).disabled).toBe(false);
    expect(
      (fixture.nativeElement.querySelector('input[type="radio"][value="last7Days"]') as HTMLInputElement).checked,
    ).toBe(true);
    for (const filter of ['business-unit', 'source', 'type']) {
      expect((await getFilterInput(filter)).value).toBe('');
    }
    expect(filters.source).toHaveLength(11);
    expect(filters.source.some((item) => ['OPAL', 'OTHER', 'VARIANT_BANKING'].includes(String(item.value)))).toBe(
      false,
    );
    expect(filters.sourceList).toEqual([
      { name: 'RAW', value: 'SOURCE' },
      { name: 'TRANSFORMED', value: 'TRANSFORMED_JSON' },
    ]);
    fixture.detectChanges();
    httpMock.expectNone((req) => req.url === '/opal-file-handling-service/interface-files');
  });

  it('offers only permitted business units using codes rather than IDs', () => {
    expect(component.businessUnits).toEqual([{ name: 'Camberwell Green', value: '0046' }]);
  });

  it('offers no business units when reference data is absent', () => {
    fixture.destroy();
    TestBed.inject(ActivatedRoute).snapshot.data['businessUnits'] = null;
    fixture = TestBed.createComponent(FinesFinanceInboundFilesComponent);
    expect(fixture.componentInstance.businessUnits).toEqual([]);
  });

  it('offers no business units when the user has no memberships', () => {
    fixture.destroy();
    userState.mockReturnValue({ business_unit_users: [] });
    fixture = TestBed.createComponent(FinesFinanceInboundFilesComponent);
    expect(fixture.componentInstance.businessUnits).toEqual([]);
  });

  it('maps the initial response to named rows without selecting Refresh', async () => {
    fixture.detectChanges();
    httpMock
      .expectOne((req) => req.url === '/opal-file-handling-service/interface-files')
      .flush(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.tableData()?.[0]).toEqual({
      'File ID': 1001,
      'Date and time': Date.parse('2026-10-20T12:00:00Z'),
      dateTimeDisplay: '20 Oct 2026 at 13:00',
      Title: 'allpay_1001.xml',
      Type: 'RAW',
      'Business unit': 'Camberwell Green',
      Source: 'Allpay',
      Status: 'Ready',
      Actions: 'Download',
    });
    expect(fixture.nativeElement.querySelector('tbody').textContent).toContain('Camberwell Green');
    expect(fixture.nativeElement.querySelector('tbody').textContent).toContain('N E Region');
    expect(fixture.nativeElement.querySelector('tbody').textContent).toContain('In-Progress');
    expect(
      Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('thead th')).map((cell) =>
        cell.textContent?.trim(),
      ),
    ).toEqual(['Date and time', 'Title', 'Type', 'Business unit', 'Source', 'Status', 'Action']);
    const rows = component.tableData();
    fixture.detectChanges();
    expect(component.tableData()).toBe(rows);
  });

  it.each([
    {
      heading: 'Type',
      cellIndex: 2,
      ascending: ['RAW', 'RAW', 'RAW', 'TRANSFORMED'],
      descending: ['TRANSFORMED', 'RAW', 'RAW', 'RAW'],
    },
    {
      heading: 'Source',
      cellIndex: 4,
      ascending: ['Allpay', 'Allpay', 'Allpay DD', 'NatWest'],
      descending: ['NatWest', 'Allpay DD', 'Allpay', 'Allpay'],
    },
    {
      heading: 'Action',
      cellIndex: 6,
      ascending: ['', 'Download', 'Download', 'Download'],
      descending: ['Download', 'Download', 'Download', ''],
    },
  ])(
    'sorts the $heading column in both directions through its heading button',
    async ({ heading, cellIndex, ascending, descending }) => {
      fixture.detectChanges();
      httpMock
        .expectOne((req) => req.url === '/opal-file-handling-service/interface-files')
        .flush(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK);
      await fixture.whenStable();
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      const header = Array.from(element.querySelectorAll('thead th')).find(
        (cell) => cell.textContent?.trim() === heading,
      )!;
      const button = header.querySelector('button')!;
      const values = () =>
        Array.from(element.querySelectorAll('tbody tr')).map((row) =>
          row.querySelectorAll('td')[cellIndex].textContent?.trim(),
        );

      button.click();
      fixture.detectChanges();
      expect(header.getAttribute('aria-sort')).toBe('ascending');
      expect(values()).toEqual(ascending);

      button.click();
      fixture.detectChanges();
      expect(header.getAttribute('aria-sort')).toBe('descending');
      expect(values()).toEqual(descending);
      httpMock.expectNone((req) => req.url.endsWith('/content'));
    },
  );

  it('shows the empty state when the API file list is null', async () => {
    fixture.detectChanges();
    httpMock
      .expectOne((req) => req.url === '/opal-file-handling-service/interface-files')
      .flush({ number_of_results: 0, interface_files: null });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.tableData()).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('There are no inbound interface files to display.');
  });

  it('refreshes the selected filters and restores the form to pristine', () => {
    fixture.detectChanges();
    httpMock
      .expectOne((req) => req.url === '/opal-file-handling-service/interface-files')
      .flush(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK);
    const filters = fixture.debugElement.query(By.directive(CustomFileInterfaceViewerFiltersComponent))
      .componentInstance as CustomFileInterfaceViewerFiltersComponent;
    filters.filtersForm.patchValue({ businessUnit: '0046', source: 'ALLPAY', fileType: 'TRANSFORMED_JSON' });
    filters.filtersForm.markAsDirty();
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('#refresh-reports-button') as HTMLButtonElement).click();
    const request = httpMock.expectOne((req) => req.url === '/opal-file-handling-service/interface-files');
    expect(request.request.params.get('business_unit_code')).toBe('0046');
    expect(request.request.params.get('source')).toBe('ALLPAY');
    expect(request.request.params.get('type')).toBe('TRANSFORMED_JSON');
    request.flush({ number_of_results: 0, interface_files: [] });
    expect(filters.filtersForm.pristine).toBe(true);
    expect(component.tableData()).toEqual([]);
  });

  it('refreshes unchanged successful criteria and displays the latest response each time', () => {
    fixture.detectChanges();
    const initial = httpMock.expectOne((req) => req.url === '/opal-file-handling-service/interface-files');
    const criteria = initial.request.params.toString();
    initial.flush(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK);
    fixture.detectChanges();
    const refresh = fixture.nativeElement.querySelector('#refresh-reports-button') as HTMLButtonElement;

    refresh.click();
    const firstRefresh = httpMock.expectOne((req) => req.url === '/opal-file-handling-service/interface-files');
    expect(firstRefresh.request.params.toString()).toBe(criteria);
    firstRefresh.flush({
      number_of_results: 1,
      interface_files: [
        { ...FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK.interface_files![0], file_name: 'latest-file.xml' },
      ],
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('tbody').textContent).toContain('latest-file.xml');
    expect(refresh.disabled).toBe(false);

    refresh.click();
    const secondRefresh = httpMock.expectOne((req) => req.url === '/opal-file-handling-service/interface-files');
    expect(secondRefresh.request.params.toString()).toBe(criteria);
    secondRefresh.flush({ number_of_results: 0, interface_files: [] });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('There are no inbound interface files to display.');
    expect(refresh.disabled).toBe(false);
  });

  it('allows retrying the initial search with unchanged filters after a failure', () => {
    fixture.detectChanges();
    const initial = httpMock.expectOne((req) => req.url === '/opal-file-handling-service/interface-files');
    const criteria = initial.request.params.toString();
    initial.flush({}, { status: 500, statusText: 'Search failed' });
    fixture.detectChanges();
    const refresh = fixture.nativeElement.querySelector('#refresh-reports-button') as HTMLButtonElement;

    expect(component.tableData()).toBeNull();
    expect(refresh.disabled).toBe(false);
    expect(TestBed.inject(GlobalStore).setBannerError).toHaveBeenCalled();
    refresh.click();
    fixture.detectChanges();
    const retry = httpMock.expectOne((req) => req.url === '/opal-file-handling-service/interface-files');
    expect(retry.request.params.toString()).toBe(criteria);
    expect(refresh.disabled).toBe(false);
    retry.flush(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK);
    fixture.detectChanges();

    expect(component.tableData()).toHaveLength(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK.interface_files!.length);
    expect(refresh.disabled).toBe(false);
  });

  it('retains results and allows repeated retries of failed edited criteria', () => {
    fixture.detectChanges();
    httpMock
      .expectOne((req) => req.url === '/opal-file-handling-service/interface-files')
      .flush(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK);
    fixture.detectChanges();
    const rows = component.tableData();
    const filters = fixture.debugElement.query(By.directive(CustomFileInterfaceViewerFiltersComponent))
      .componentInstance as CustomFileInterfaceViewerFiltersComponent;
    filters.filtersForm.controls.source.setValue('ALLPAY');
    filters.filtersForm.markAsDirty();
    fixture.detectChanges();
    const refresh = fixture.nativeElement.querySelector('#refresh-reports-button') as HTMLButtonElement;
    refresh.click();
    const failed = httpMock.expectOne((req) => req.url === '/opal-file-handling-service/interface-files');
    const criteria = failed.request.params.toString();
    expect(failed.request.params.get('source')).toBe('ALLPAY');
    failed.flush({}, { status: 500, statusText: 'Search failed' });
    fixture.detectChanges();

    expect(filters.filtersForm.pristine).toBe(true);
    expect(component.tableData()).toBe(rows);
    expect(refresh.disabled).toBe(false);
    refresh.click();
    const retry = httpMock.expectOne((req) => req.url === '/opal-file-handling-service/interface-files');
    expect(retry.request.params.toString()).toBe(criteria);
    retry.flush({}, { status: 500, statusText: 'Search failed again' });
    fixture.detectChanges();
    expect(component.tableData()).toBe(rows);
    expect(refresh.disabled).toBe(false);

    refresh.click();
    const success = httpMock.expectOne((req) => req.url === '/opal-file-handling-service/interface-files');
    expect(success.request.params.toString()).toBe(criteria);
    success.flush({ number_of_results: 0, interface_files: [] });
    fixture.detectChanges();
    expect(component.tableData()).toEqual([]);
    expect(refresh.disabled).toBe(false);
  });

  it('cancels the previous search so it cannot replace refreshed results', () => {
    fixture.detectChanges();
    const initial = httpMock.expectOne((req) => req.url === '/opal-file-handling-service/interface-files');
    component.onFormSubmit({
      formData: { businessUnit: null, source: 'ALLPAY', fileType: null, dateFilter: 'last7Days' },
      nestedFlow: false,
    });
    const refresh = httpMock.expectOne((req) => req.url === '/opal-file-handling-service/interface-files');
    const latest = { number_of_results: 0, interface_files: [] };
    refresh.flush(latest);
    expect(initial.cancelled).toBe(true);
    expect(component.tableData()).toEqual([]);
  });

  it('cancels a pending search when leaving the page', () => {
    fixture.detectChanges();
    const request = httpMock.expectOne((req) => req.url === '/opal-file-handling-service/interface-files');
    fixture.destroy();
    expect(request.cancelled).toBe(true);
  });

  it('applies named choices and All choices through the actual autocomplete widgets', async () => {
    fixture.detectChanges();
    httpMock
      .expectOne((req) => req.url === '/opal-file-handling-service/interface-files')
      .flush(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK);
    TestBed.tick();
    await fixture.whenStable();
    const filters = fixture.debugElement.query(By.directive(CustomFileInterfaceViewerFiltersComponent))
      .componentInstance as CustomFileInterfaceViewerFiltersComponent;

    /**
     * Selects a real widget suggestion by its visible name.
     * @param filter - Filter input identifier between the common prefix and suffix.
     * @param name - Visible suggestion name.
     * @returns A promise resolving after the form control is updated.
     */
    const selectFilterOption = async (filter: string, name: string): Promise<void> => {
      const input = await getFilterInput(filter);
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.click();
      const option = await vi.waitFor(() => {
        const options = fixture.nativeElement.querySelectorAll(
          '#' + input.id + '__listbox [role="option"]',
        ) as NodeListOf<HTMLElement>;
        const match = Array.from(options).find((item) => item.textContent?.trim() === name);
        expect(match).toBeDefined();
        return match!;
      });
      option.click();
      fixture.detectChanges();
    };

    await selectFilterOption('business-unit', 'Camberwell Green');
    await selectFilterOption('source', 'Allpay');
    await selectFilterOption('type', 'RAW');
    expect(filters.filtersForm.controls.businessUnit.value).toBe('0046');
    (fixture.nativeElement.querySelector('#refresh-reports-button') as HTMLButtonElement).click();
    const selected = httpMock.expectOne((req) => req.url === '/opal-file-handling-service/interface-files');
    expect(selected.request.params.get('business_unit_code')).toBe('0046');
    expect(selected.request.params.get('source')).toBe('ALLPAY');
    expect(selected.request.params.get('type')).toBe('SOURCE');
    selected.flush({
      number_of_results: 1,
      interface_files: [FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK.interface_files![0]],
    });
    fixture.detectChanges();
    expect(component.tableData()?.every((row) => row['Business unit'] === 'Camberwell Green')).toBe(true);

    await selectFilterOption('business-unit', 'All business units');
    await selectFilterOption('source', 'All sources');
    await selectFilterOption('type', 'All types');
    expect(filters.filtersForm.controls.businessUnit.value).toBe('');
    expect(filters.filtersForm.controls.source.value).toBe('');
    expect(filters.filtersForm.controls.fileType.value).toBe('');
    expect(filters.filtersForm.controls.dateFilter.value).toBe('last7Days');
    (fixture.nativeElement.querySelector('#refresh-reports-button') as HTMLButtonElement).click();
    const all = httpMock.expectOne((req) => req.url === '/opal-file-handling-service/interface-files');
    expect(all.request.params.has('business_unit_code')).toBe(false);
    expect(all.request.params.has('source')).toBe(false);
    expect(all.request.params.get('type')).toBe('SOURCE,TRANSFORMED_JSON');
    expect(all.request.params.get('from_date')).toBe('2026-10-13T23:00:00');
    expect(all.request.params.get('to_date')).toBe('2026-10-20T22:59:59.999999');
    all.flush(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK);
  });

  it('offers downloads only for Ready and File failed rows with a file ID', () => {
    fixture.detectChanges();
    httpMock
      .expectOne((req) => req.url === '/opal-file-handling-service/interface-files')
      .flush({
        number_of_results: 5,
        interface_files: [
          ...FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK.interface_files!,
          {
            ...FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK.interface_files![0],
            interface_file_id: null,
            file_name: 'missing-id.xml',
          },
        ],
      });
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll(
      'a[id^="interface-file-download-"]',
    ) as NodeListOf<HTMLAnchorElement>;
    expect(Array.from(links, (link) => link.id)).toEqual([
      'interface-file-download-1001',
      'interface-file-download-1002',
      'interface-file-download-1004',
    ]);
    expect(fixture.nativeElement.querySelector('#interface-file-download-1001').closest('tr').textContent).toContain(
      'Ready',
    );
    expect(fixture.nativeElement.querySelector('#interface-file-download-1002').closest('tr').textContent).toContain(
      'File failed',
    );
    expect(fixture.nativeElement.querySelector('#interface-file-download-1003')).toBeNull();
    const missingIdRow = Array.from(fixture.nativeElement.querySelectorAll('tbody tr') as NodeListOf<HTMLElement>).find(
      (row) => row.textContent?.includes('missing-id.xml'),
    );
    expect(missingIdRow?.querySelector('a')).toBeNull();
  });

  it('rechecks the latest row before downloading from a stale action', () => {
    fixture.detectChanges();
    httpMock
      .expectOne((req) => req.url === '/opal-file-handling-service/interface-files')
      .flush(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('#refresh-reports-button') as HTMLButtonElement).click();
    httpMock
      .expectOne((req) => req.url === '/opal-file-handling-service/interface-files')
      .flush({
        number_of_results: 1,
        interface_files: [{ ...FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK.interface_files![0], status: 'INGESTED' }],
      });
    fixture.detectChanges();

    const staleClick = new MouseEvent('click', { cancelable: true });
    component.onDownloadFile(1001, staleClick);
    component.onDownloadFile(9999, new MouseEvent('click', { cancelable: true }));

    expect(staleClick.defaultPrevented).toBe(true);
    httpMock.expectNone((req) => req.url.endsWith('/content'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#interface-file-download-1001')).toBeNull();
  });

  it.each([null, ''])('downloads a file with title %j using its file ID as the fallback filename', (title) => {
    const { filenames, links } = mockFileSave();
    fixture.detectChanges();
    httpMock
      .expectOne((req) => req.url === '/opal-file-handling-service/interface-files')
      .flush({
        number_of_results: 1,
        interface_files: [{ ...FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK.interface_files![0], file_name: title }],
      });
    fixture.detectChanges();
    const download = fixture.nativeElement.querySelector('#interface-file-download-1001') as HTMLAnchorElement;
    const saveLink = fixture.nativeElement.querySelector('a[hidden]') as HTMLAnchorElement;
    expect(download.getAttribute('aria-label')).toBe('Download interface file 1001');

    expect(download.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))).toBe(false);
    httpMock
      .expectOne('/opal-file-handling-service/interface-files/1001/content')
      .flush(new Blob(['<interfaceFile />'], { type: 'application/octet-stream' }));

    expect(filenames).toEqual(['interface-file-1001']);
    expect(links).toEqual([saveLink]);
  });

  it('focuses download errors, returns to the action and retries without changing rows', async () => {
    const { filenames } = mockFileSave();
    fixture.detectChanges();
    httpMock
      .expectOne((req) => req.url === '/opal-file-handling-service/interface-files')
      .flush(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK);
    fixture.detectChanges();
    const rows = component.tableData();
    const download = fixture.nativeElement.querySelector('#interface-file-download-1002') as HTMLAnchorElement;
    download.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    httpMock.expectOne('/opal-file-handling-service/interface-files/1002/content').flush(new Blob(), {
      status: 500,
      statusText: 'Download failed',
    });
    fixture.detectChanges();
    const summary = fixture.nativeElement.querySelector('.govuk-error-summary') as HTMLElement;

    expect(summary.textContent).toContain('The file could not be downloaded. Try again.');
    await vi.waitFor(() => expect(document.activeElement).toBe(summary));
    summary.querySelector('a')!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(download);

    download.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.govuk-error-summary')).toBeNull();
    httpMock
      .expectOne('/opal-file-handling-service/interface-files/1002/content')
      .flush(new Blob(['<interfaceFile />'], { type: 'application/octet-stream' }));
    fixture.detectChanges();

    expect(filenames).toEqual(['allpay_1002.xml']);
    expect(component.tableData()).toBe(rows);
    expect(fixture.nativeElement.querySelector('#interface-file-download-1002')).toBe(download);
  });

  it('saves a pending download after pagination without changing the selected page', () => {
    const { filenames, links } = mockFileSave();
    fixture.detectChanges();
    httpMock
      .expectOne((req) => req.url === '/opal-file-handling-service/interface-files')
      .flush({
        number_of_results: 26,
        interface_files: Array.from({ length: 26 }, (_, index) => ({
          ...FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK.interface_files![0],
          interface_file_id: index + 1001,
          file_name: `file-${index + 1}.xml`,
        })),
      });
    fixture.detectChanges();
    const download = fixture.nativeElement.querySelector('#interface-file-download-1001') as HTMLAnchorElement;
    download.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    const request = httpMock.expectOne('/opal-file-handling-service/interface-files/1001/content');
    (
      fixture.nativeElement.querySelector('#inbound-file-viewer-pagination a[aria-label="Page 2"]') as HTMLAnchorElement
    ).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#interface-file-download-1001')).toBeNull();
    request.flush(new Blob(['<interfaceFile />'], { type: 'application/octet-stream' }));
    fixture.detectChanges();

    expect(filenames).toEqual(['file-1.xml']);
    expect(links[0]).not.toBe(download);
    expect(links[0].hidden).toBe(true);
    expect(fixture.nativeElement.querySelector('#interface-file-download-1026')).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector('#inbound-file-viewer-pagination [aria-current="page"]').textContent.trim(),
    ).toBe('2');
  });

  it('returns to the results when a failed download action is on another page', async () => {
    fixture.detectChanges();
    httpMock
      .expectOne((req) => req.url === '/opal-file-handling-service/interface-files')
      .flush({
        number_of_results: 26,
        interface_files: Array.from({ length: 26 }, (_, index) => ({
          ...FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK.interface_files![0],
          interface_file_id: index + 1001,
        })),
      });
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('#interface-file-download-1001') as HTMLAnchorElement).dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
    const request = httpMock.expectOne('/opal-file-handling-service/interface-files/1001/content');
    (
      fixture.nativeElement.querySelector('#inbound-file-viewer-pagination a[aria-label="Page 2"]') as HTMLAnchorElement
    ).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    request.flush(new Blob(), { status: 500, statusText: 'Download failed' });
    fixture.detectChanges();
    const summary = fixture.nativeElement.querySelector('.govuk-error-summary') as HTMLElement;
    await vi.waitFor(() => expect(document.activeElement).toBe(summary));

    summary.querySelector('a')!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('#inbound-interface-files-results'));
    expect(fixture.nativeElement.querySelector('#interface-file-download-1026')).not.toBeNull();
  });

  it('cancels a pending download when leaving the page', () => {
    fixture.detectChanges();
    httpMock
      .expectOne((req) => req.url === '/opal-file-handling-service/interface-files')
      .flush(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('#interface-file-download-1001') as HTMLAnchorElement).dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
    const request = httpMock.expectOne('/opal-file-handling-service/interface-files/1001/content');

    fixture.destroy();

    expect(request.cancelled).toBe(true);
  });

  it.each([404, 422, 500])(
    'uses the existing interceptors for original file bytes and retains rows after a %s failure',
    async (status) => {
      const { createObjectURL, revokeObjectURL, filenames } = mockFileSave();
      fixture.detectChanges();
      httpMock
        .expectOne((req) => req.url === '/opal-file-handling-service/interface-files')
        .flush(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK);
      fixture.detectChanges();
      const rows = component.tableData();
      const xmlLink = fixture.nativeElement.querySelector('#interface-file-download-1001') as HTMLAnchorElement;
      expect(xmlLink.closest('tr')?.textContent).toContain('Camberwell Green');
      expect(xmlLink.getAttribute('href')).toBe('/opal-file-handling-service/interface-files/1001/content');
      expect(xmlLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))).toBe(false);
      const xmlRequest = httpMock.expectOne('/opal-file-handling-service/interface-files/1001/content');
      expect(xmlRequest.request.method).toBe('GET');
      expect(xmlRequest.request.headers.get('Accept')).toBe('application/octet-stream');
      expect(xmlRequest.request.responseType).toBe('blob');
      expect(xmlRequest.request.headers.get('Want-Content-Digest')).toBe('sha-512');
      const xml = new Blob(['<interfaceFile />'], { type: 'application/octet-stream' });
      xmlRequest.flush(xml, { headers: { 'Content-Type': 'application/octet-stream' } });

      const xlsxLink = fixture.nativeElement.querySelector('#interface-file-download-1004') as HTMLAnchorElement;
      xlsxLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      const binary = new Blob([new Uint8Array([0x50, 0x4b, 0x03, 0x04])], { type: 'application/octet-stream' });
      httpMock.expectOne('/opal-file-handling-service/interface-files/1004/content').flush(binary);
      expect(filenames).toEqual(['allpay_1001.xml', 'allpay_dd_1004.xlsx']);
      expect(createObjectURL.mock.calls[0][0]).toBe(xml);
      expect(createObjectURL.mock.calls[1][0]).toBe(binary);
      await vi.waitFor(() => expect(revokeObjectURL).toHaveBeenCalledTimes(2));

      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
      (fixture.nativeElement.querySelector('#interface-file-download-1002') as HTMLAnchorElement).dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      );
      httpMock
        .expectOne('/opal-file-handling-service/interface-files/1002/content')
        .flush(new Blob([JSON.stringify({ status })], { type: 'application/problem+json' }), {
          status,
          statusText: 'Download failed',
        });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.govuk-error-summary').textContent).toContain(
        'The file could not be downloaded. Try again.',
      );
      expect(component.tableData()).toBe(rows);
      expect(fixture.nativeElement.querySelector('tbody').textContent).toContain('allpay_1001.xml');
      expect(createObjectURL).toHaveBeenCalledTimes(2);
      expect(navigate).not.toHaveBeenCalled();
      expect(TestBed.inject(GlobalStore).setBannerError).toHaveBeenCalled();
      expect(TestBed.inject(AppInsightsService).logException).toHaveBeenCalled();
    },
  );
});
