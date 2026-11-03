import { HttpErrorResponse, HttpEvent, HttpEventType, HttpResponse, provideHttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { OpalFileHandlingService } from '@hmcts/opal-frontend-common/services/opal-file-handling-service';
import { IOpalFileHandlingInterfaceFile } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FINES_PERMISSIONS } from '@constants/fines-permissions.constant';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesFinanceUploadVariantBankingFilesComponent } from './fines-finance-upload-variant-banking-files.component';

@Component({ selector: 'app-finance-dashboard-stub', template: 'Finance dashboard' })
class FinanceDashboardStubComponent {}

@Component({ selector: 'app-inbound-files-stub', template: 'Inbound files' })
class InboundFilesStubComponent {}

describe('FinesFinanceUploadVariantBankingFilesComponent', () => {
  let component: FinesFinanceUploadVariantBankingFilesComponent;
  let fixture: ComponentFixture<FinesFinanceUploadVariantBankingFilesComponent>;
  let requests: Subject<HttpEvent<IOpalFileHandlingInterfaceFile>>[];
  const userState = signal<IOpalUserState | null>(null);
  const uploadInterfaceFile =
    vi.fn<(file: File, metadata: unknown) => Observable<HttpEvent<IOpalFileHandlingInterfaceFile>>>();
  /**
   * Supplies user permissions to the real shared permission service before rendering.
   * @param permissionIds - Permission IDs granted to the test user's business unit.
   * @returns void
   */
  const setPermissions = (permissionIds: number[]): void => {
    userState.set({
      user_id: 1,
      username: 'test-user',
      name: 'Test user',
      status: null,
      version: null,
      business_unit_users: [
        {
          business_unit_user_id: 'test-business-unit-user',
          business_unit_id: 77,
          permissions: permissionIds.map((permissionId) => ({
            permission_id: permissionId,
            permission_name: 'Test permission',
          })),
        },
      ],
    });
  };
  /**
   * Creates a valid banking file without reading fixtures from disk.
   * @param index - Numeric portion of the filename.
   * @param size - Original binary file size in bytes.
   * @returns A browser file accepted by the selection policy.
   */
  const file = (index = 1, size = 3) =>
    new File([new Uint8Array(size)], `a121_261027_VB_${String(index).padStart(3, '0')}_AA.dat`);
  /**
   * Creates the final API event with only the fields relevant to a scenario overridden.
   * @param overrides - Interface-file fields returned for the scenario.
   * @returns An HTTP 201 event containing the interface-file metadata.
   */
  const response = (overrides: Partial<IOpalFileHandlingInterfaceFile> = {}) =>
    new HttpResponse<IOpalFileHandlingInterfaceFile>({
      status: 201,
      body: {
        interface_file_id: 1,
        source: 'VARIANT_BANKING',
        target: 'OPAL',
        type: 'SOURCE',
        domain: 'FINES',
        status: 'INGESTED',
        business_unit_codes: null,
        filestore_uuid: null,
        checksum: null,
        created_datetime: null,
        file_name: null,
        errors: null,
        ...overrides,
      },
    });
  /**
   * Settles one controlled request so the next queued file can start.
   * @param index - Index of the request captured by the API mock.
   * @param overrides - Response metadata for this request.
   * @returns void
   */
  const finish = (index = 0, overrides: Partial<IOpalFileHandlingInterfaceFile> = {}) => {
    requests[index].next(response(overrides));
    requests[index].complete();
  };
  beforeEach(async () => {
    requests = [];
    setPermissions([FINES_PERMISSIONS['create-interface-files'], FINES_PERMISSIONS['view-interface-files']]);
    uploadInterfaceFile.mockReset().mockImplementation(() => {
      const request = new Subject<HttpEvent<IOpalFileHandlingInterfaceFile>>();
      requests.push(request);
      return request.asObservable();
    });
    await TestBed.configureTestingModule({
      imports: [FinesFinanceUploadVariantBankingFilesComponent],
      providers: [
        provideRouter([
          {
            path: 'variant-banking-upload',
            component: FinesFinanceUploadVariantBankingFilesComponent,
            canDeactivate: [canDeactivateGuard],
          },
          { path: 'fines/dashboard/finance', component: FinanceDashboardStubComponent },
          { path: 'fines/finance/inbound-files/search', component: InboundFilesStubComponent },
        ]),
        provideHttpClient(),
        { provide: OpalFileHandlingService, useValue: { uploadInterfaceFile } },
        { provide: GlobalStore, useValue: { userState } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(FinesFinanceUploadVariantBankingFilesComponent);
    component = fixture.componentInstance;
  });

  it('renders Back above the upload heading with the frontend empty state and no hint or removal actions', () => {
    fixture.detectChanges();

    const heading: HTMLElement = fixture.nativeElement.querySelector('h1');
    const back: HTMLAnchorElement = fixture.nativeElement.querySelector('.govuk-back-link');
    expect(heading.textContent).toContain('Upload variant banking files');
    expect(back.textContent.trim()).toBe('Back');
    expect(back.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(fixture.nativeElement.querySelector('input[type="file"]').accept).toBe('.dat');
    expect(fixture.nativeElement.querySelector('#fines-finance-upload-empty-state').textContent).toBe(
      'No files uploaded',
    );
    expect(fixture.nativeElement.querySelector('#files-hint')).toBeNull();
    expect(fixture.nativeElement.querySelector('#fines-finance-upload-cancel')).toBeNull();
    expect(fixture.nativeElement.querySelector('.moj-multi-file-upload__delete')).toBeNull();
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
    expect(fixture.nativeElement.querySelector('#fines-finance-upload-submit')).toBeNull();
    expect(component.canDeactivate()).toBe(true);
    expect(uploadInterfaceFile).not.toHaveBeenCalled();
  });

  it.each([
    {
      user: 'upload-only',
      permissions: [FINES_PERMISSIONS['create-interface-files']],
      canView: false,
    },
    {
      user: 'upload and view',
      permissions: [FINES_PERMISSIONS['create-interface-files'], FINES_PERMISSIONS['view-interface-files']],
      canView: true,
    },
  ])('shows inbound navigation only with view permission for an $user user', ({ permissions, canView }) => {
    setPermissions(permissions);
    component.selectFiles([file()]);
    finish();

    fixture.detectChanges();

    expect(component.fileUploads()[0].status).toBe('success');
    expect(component.canViewInboundFiles()).toBe(canView);
    expect(fixture.nativeElement.querySelector('#fines-finance-upload-view-files') !== null).toBe(canView);
    expect(fixture.nativeElement.textContent.includes('You can view the')).toBe(canView);
    expect(fixture.nativeElement.querySelector('input[type="file"]').disabled).toBe(false);
  });

  it('hides inbound navigation when user state is unavailable', () => {
    userState.set(null);

    fixture.detectChanges();

    expect(component.canViewInboundFiles()).toBe(false);
    expect(fixture.nativeElement.querySelector('#fines-finance-upload-view-files')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('You can view the');
  });

  it('hides inbound navigation when view permission is revoked', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#fines-finance-upload-view-files')).not.toBeNull();

    setPermissions([FINES_PERMISSIONS['create-interface-files']]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#fines-finance-upload-view-files')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('You can view the');
  });

  it('forwards a native picker selection as the original file with the exact banking metadata', () => {
    const selected = new File([new Uint8Array([0, 255, 128, 13, 10])], file().name, {
      type: 'application/octet-stream',
    });
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', { value: [selected], configurable: true });

    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(uploadInterfaceFile).toHaveBeenCalledExactlyOnceWith(selected, {
      file_name: selected.name,
      source: 'VARIANT_BANKING',
      target: 'OPAL',
      type: 'SOURCE',
      domain: 'FINES',
      should_pre_process_file: true,
    });
    expect(component.fileUploads()[0].file).toBe(selected);
    expect(component.canDeactivate()).toBe(false);
  });

  it('uploads sequentially and keeps 100 percent progress pending until a final response', () => {
    const files = [file(1), file(2)];
    component.selectFiles(files);
    expect(uploadInterfaceFile).toHaveBeenCalledTimes(1);
    expect(component.fileUploads().map((item) => item.status)).toEqual(['uploading', 'pending']);

    requests[0].next({ type: HttpEventType.UploadProgress, loaded: 3, total: 3 });

    expect(component.fileUploads()[0]).toMatchObject({ status: 'uploading', progress: 100 });
    expect(component.canDeactivate()).toBe(false);
    expect(uploadInterfaceFile).toHaveBeenCalledTimes(1);

    finish();
    expect(component.fileUploads().map((item) => item.status)).toEqual(['success', 'uploading']);
    expect(uploadInterfaceFile.mock.calls[1][0]).toBe(files[1]);
    finish(1);
    expect(component.fileUploads().map((item) => item.status)).toEqual(['success', 'success']);
    expect(component.announcement()).toBe(`${files[1].name} uploaded.`);
    expect(component.canDeactivate()).toBe(true);
  });

  it('shows indeterminate progress when the transport has no total', () => {
    component.selectFiles([file()]);
    requests[0].next({ type: HttpEventType.UploadProgress, loaded: 10, total: 30 });
    expect(component.fileUploads()[0].progress).toBe(33);

    requests[0].next({ type: HttpEventType.UploadProgress, loaded: 20 });

    expect(component.fileUploads()[0]).toMatchObject({ status: 'uploading', progress: null });
  });

  it('ignores transport notifications that do not contain upload progress or a final response', () => {
    component.selectFiles([file(), file(2)]);
    const rows = component.fileUploads();

    requests[0].next({ type: HttpEventType.Sent });

    expect(component.fileUploads()).toBe(rows);
    expect(component.fileUploads()[0]).toMatchObject({ status: 'uploading', progress: null });
    expect(uploadInterfaceFile).toHaveBeenCalledOnce();
  });

  it('uploads valid files independently while retaining locally rejected rows without sending them', () => {
    const valid = file();
    component.selectFiles([valid, new File(['invalid'], 'unsupported.csv')]);

    expect(uploadInterfaceFile).toHaveBeenCalledOnce();
    expect(uploadInterfaceFile.mock.calls[0][0]).toBe(valid);
    expect(component.fileUploads().map((item) => item.status)).toEqual(['uploading', 'rejected']);
    expect(component.fileUploads()[1].errors).toEqual(['The selected file must be a .DAT.']);

    finish();

    expect(uploadInterfaceFile).toHaveBeenCalledOnce();
    expect(component.fileUploads().map((item) => item.status)).toEqual(['success', 'rejected']);
    expect(component.canDeactivate()).toBe(true);
  });

  it('allows a corrected selection to upload while earlier rejected rows remain visible', () => {
    component.selectFiles([new File(['invalid'], 'unsupported.csv')]);
    const corrected = file();

    component.selectFiles([corrected]);

    expect(uploadInterfaceFile).toHaveBeenCalledExactlyOnceWith(corrected, expect.any(Object));
    expect(component.fileUploads().map((item) => item.status)).toEqual(['rejected', 'uploading']);
    finish();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('unsupported.csv');
    expect(fixture.nativeElement.textContent).toContain(corrected.name);
    expect(fixture.nativeElement.querySelector('.moj-multi-file-upload__delete')).toBeNull();
  });

  it('rejects an invalid DAT filename without sending it to the API', () => {
    component.selectFiles([new File(['invalid'], 'unrecognised.dat')]);

    expect(component.fileUploads()[0]).toMatchObject({
      status: 'rejected',
      errors: ['The selected file name must follow the format a121_yymmdd_VB_XXX_nn.dat.'],
    });
    expect(uploadInterfaceFile).not.toHaveBeenCalled();
    expect(component.canDeactivate()).toBe(true);
  });

  it('accepts case-insensitive DAT names at the exact 2 MB boundary', () => {
    const selected = new File([new Uint8Array(2 * 1024 * 1024)], 'A121_261027_vb_123_aa.DAT');

    component.selectFiles([selected]);

    expect(component.fileUploads()[0]).toMatchObject({ status: 'uploading', errors: [] });
    expect(uploadInterfaceFile.mock.calls[0][0]).toBe(selected);
  });

  it('rejects a file one byte larger than 2 MB', () => {
    component.selectFiles([file(1, 2 * 1024 * 1024 + 1)]);

    expect(component.fileUploads()[0]).toMatchObject({
      status: 'rejected',
      errors: ['The selected file must be smaller than 2MB.'],
    });
    expect(uploadInterfaceFile).not.toHaveBeenCalled();
  });

  it('uploads the first six valid files in a selection and rejects the seventh', () => {
    component.selectFiles(Array.from({ length: 7 }, (_, index) => file(index)));

    expect(component.fileUploads().map((item) => item.status)).toEqual([
      'uploading',
      'pending',
      'pending',
      'pending',
      'pending',
      'pending',
      'rejected',
    ]);
    expect(component.fileUploads()[6]).toMatchObject({
      status: 'rejected',
      errors: ['You can only select up to 6 files at the same time.'],
    });
    for (let index = 0; index < 6; index++) {
      finish(index);
    }
    expect(uploadInterfaceFile).toHaveBeenCalledTimes(6);
    expect(
      component
        .fileUploads()
        .slice(0, 6)
        .every((item) => item.status === 'success'),
    ).toBe(true);
    expect(component.canDeactivate()).toBe(true);
  });

  it('allows later selections of six files without treating six as a cumulative limit', () => {
    component.selectFiles(Array.from({ length: 6 }, (_, index) => file(index)));
    component.selectFiles(Array.from({ length: 6 }, (_, index) => file(index + 6)));

    expect(component.fileUploads()).toHaveLength(12);
    expect(component.fileUploads().some((item) => item.status === 'rejected')).toBe(false);
    expect(new Set(component.fileUploads().map((item) => item.id)).size).toBe(12);
    expect(uploadInterfaceFile).toHaveBeenCalledTimes(1);
  });

  it.each([
    { status: 'FAILED', errors: null, expected: 'The file could not be uploaded. Try again.' },
    { status: 'DUPLICATE', errors: '{"message":"This file already exists."}', expected: 'This file already exists.' },
    { status: 'FAILURE', errors: 'The file could not be ingested.', expected: 'The file could not be ingested.' },
    { status: 'failed', errors: '{"message":42}', expected: '{"message":42}' },
    { status: 'INGESTED', errors: '{"message":"Validation failed."}', expected: 'Validation failed.' },
  ])('keeps a 201 $status record with ingestion errors as a failed row', ({ status, errors, expected }) => {
    component.selectFiles([file(), file(2)]);

    finish(0, { status, errors });

    expect(component.fileUploads()[0]).toMatchObject({ status: 'failed', errors: [expected] });
    expect(component.announcement()).toContain(expected);
    expect(component.fileUploads()[1].status).toBe('uploading');
    expect(uploadInterfaceFile).toHaveBeenCalledTimes(2);
  });

  it('treats whitespace-only ingestion errors as an empty error field', () => {
    component.selectFiles([file()]);

    finish(0, { errors: '   ' });

    expect(component.fileUploads()[0]).toMatchObject({ status: 'success', progress: 100, errors: [] });
  });

  it('accepts a successful interface-file response with a nullable ingestion status', () => {
    component.selectFiles([file()]);

    finish(0, { status: null });

    expect(component.fileUploads()[0]).toMatchObject({ status: 'success', progress: 100, errors: [] });
    expect(component.canDeactivate()).toBe(true);
  });

  it('shows the server problem description and continues after an HTTP error', () => {
    component.selectFiles([file(), file(2)]);

    requests[0].error(
      new HttpErrorResponse({
        status: 400,
        error: { title: 'Invalid file', description: '  The banking file is invalid.  ' },
      }),
    );

    expect(component.fileUploads()[0]).toMatchObject({ status: 'failed', errors: ['The banking file is invalid.'] });
    expect(component.fileUploads()[1].status).toBe('uploading');
  });

  it('uses the server problem title when no description is supplied', () => {
    component.selectFiles([file()]);

    requests[0].error(new HttpErrorResponse({ status: 409, error: { title: 'File already exists' } }));

    expect(component.fileUploads()[0].errors).toEqual(['File already exists']);
    expect(component.canDeactivate()).toBe(true);
  });

  it('uses a fallback error for a response without a body and continues the queue', () => {
    component.selectFiles([file(), file(2)]);

    requests[0].next(new HttpResponse<IOpalFileHandlingInterfaceFile>({ status: 201, body: null }));
    requests[0].complete();

    expect(component.fileUploads()[0]).toMatchObject({
      status: 'failed',
      errors: ['The file could not be uploaded. Try again.'],
    });
    expect(component.fileUploads()[1].status).toBe('uploading');
  });

  it('fails an upload stream that completes without a final response and keeps processing', () => {
    uploadInterfaceFile.mockReturnValueOnce(EMPTY);

    component.selectFiles([file(), file(2)]);

    expect(component.fileUploads()[0]).toMatchObject({
      status: 'failed',
      errors: ['The file could not be uploaded. Try again.'],
    });
    expect(component.fileUploads()[1].status).toBe('uploading');
    expect(uploadInterfaceFile).toHaveBeenCalledTimes(2);
  });

  it('converts a synchronous service error into a row failure without stopping the queue', () => {
    uploadInterfaceFile.mockImplementationOnce(() => {
      throw new Error('The upload request could not be created.');
    });

    component.selectFiles([file(), file(2)]);

    expect(component.fileUploads()[0]).toMatchObject({
      status: 'failed',
      errors: ['The upload request could not be created.'],
    });
    expect(component.fileUploads()[1].status).toBe('uploading');
    expect(uploadInterfaceFile).toHaveBeenCalledTimes(2);
  });

  it('handles synchronous successful streams without skipping queued files', () => {
    uploadInterfaceFile.mockReturnValue(of(response()));

    component.selectFiles([file(), file(2)]);

    expect(uploadInterfaceFile).toHaveBeenCalledTimes(2);
    expect(component.fileUploads().map((item) => item.status)).toEqual(['success', 'success']);
  });

  it('cancels the active request on destruction without starting queued requests', () => {
    component.selectFiles([file(), file(2)]);

    fixture.destroy();

    expect(requests[0].observed).toBe(false);
    expect(uploadInterfaceFile).toHaveBeenCalledTimes(1);
  });

  it('guards Back navigation and cancels active and queued uploads only when leaving is confirmed', async () => {
    const harness = await RouterTestingHarness.create();
    const page = await harness.navigateByUrl('variant-banking-upload', FinesFinanceUploadVariantBankingFilesComponent);
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    page.selectFiles([file(), file(2)]);
    harness.detectChanges();
    const back: HTMLAnchorElement = harness.routeNativeElement!.querySelector('.govuk-back-link')!;

    back.click();
    await harness.fixture.whenStable();

    expect(confirm).toHaveBeenCalledOnce();
    expect(TestBed.inject(Router).url).toBe('/variant-banking-upload');
    expect(requests[0].observed).toBe(true);

    confirm.mockReturnValue(true);
    back.click();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/fines/dashboard/finance');
    expect(requests[0].observed).toBe(false);
    expect(uploadInterfaceFile).toHaveBeenCalledTimes(1);
    confirm.mockRestore();
  });

  it('opens inbound files from the result-list link without a leave warning once uploads settle', async () => {
    const harness = await RouterTestingHarness.create();
    const page = await harness.navigateByUrl('variant-banking-upload', FinesFinanceUploadVariantBankingFilesComponent);
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    page.selectFiles([file()]);
    finish();
    harness.detectChanges();
    const link: HTMLAnchorElement = harness.routeNativeElement!.querySelector('#fines-finance-upload-view-files')!;

    link.click();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/fines/finance/inbound-files/search');
    expect(confirm).not.toHaveBeenCalled();
    expect(uploadInterfaceFile).toHaveBeenCalledOnce();
    confirm.mockRestore();
  });

  it('ignores an empty selection', () => {
    component.selectFiles([]);

    expect(component.fileUploads()).toEqual([]);
    expect(component.canDeactivate()).toBe(true);
    expect(uploadInterfaceFile).not.toHaveBeenCalled();
  });

  it('warns before unload while uploading and stops warning once all requests settle', () => {
    const event = { preventDefault: vi.fn(), returnValue: 'unchanged' };
    component.handleBeforeUnload(event as unknown as BeforeUnloadEvent);
    expect(event.preventDefault).not.toHaveBeenCalled();
    component.selectFiles([file()]);
    component.handleBeforeUnload(event as unknown as BeforeUnloadEvent);
    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(event.returnValue).toBe('');
    finish();

    expect(component.canDeactivate()).toBe(true);
    event.preventDefault.mockClear();
    component.handleBeforeUnload(event as unknown as BeforeUnloadEvent);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('handles native beforeunload events through the component host listener', () => {
    component.selectFiles([file()]);
    fixture.detectChanges();
    const uploadingEvent = new Event('beforeunload', { cancelable: true });

    window.dispatchEvent(uploadingEvent);

    expect(uploadingEvent.defaultPrevented).toBe(true);
    finish();
    const settledEvent = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(settledEvent);
    expect(settledEvent.defaultPrevented).toBe(false);
  });

  it('keeps completed results on the list and allows further uploads without a final action or outcome screen', () => {
    component.selectFiles([file()]);
    finish();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.moj-multi-file-upload__filename').textContent).toBe(file().name);
    expect(fixture.nativeElement.querySelector('#fines-finance-upload-submit')).toBeNull();
    expect(fixture.nativeElement.querySelector('#fines-finance-upload-success')).toBeNull();
    expect(fixture.nativeElement.querySelector('#fines-finance-upload-error')).toBeNull();
    expect(component.canDeactivate()).toBe(true);
    component.selectFiles([file(2)]);
    expect(uploadInterfaceFile).toHaveBeenCalledTimes(2);
  });

  it('retains successful and failed results in the list and permits leaving once every request settles', () => {
    const failedFile = file();
    const uploadedFile = file(2);
    component.selectFiles([failedFile, uploadedFile]);
    requests[0].error(new HttpErrorResponse({ status: 400, error: { description: 'The file is invalid.' } }));
    finish(1);
    fixture.detectChanges();

    const list: HTMLElement = fixture.nativeElement.querySelector('.moj-multi-file-upload__list');
    expect(list.textContent).toContain(failedFile.name);
    expect(list.textContent).toContain('The file is invalid.');
    expect(list.textContent).toContain(uploadedFile.name);
    expect(fixture.nativeElement.querySelector('#fines-finance-upload-error')).toBeNull();
    expect(component.canDeactivate()).toBe(true);
  });
});
