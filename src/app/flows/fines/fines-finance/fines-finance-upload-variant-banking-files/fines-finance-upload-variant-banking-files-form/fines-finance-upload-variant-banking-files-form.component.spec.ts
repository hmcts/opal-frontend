import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IAbstractMultiFileUploadItem } from '@hmcts/opal-frontend-common/components/abstract/abstract-multi-file-upload/interfaces';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesFinanceUploadVariantBankingFilesFormComponent } from './fines-finance-upload-variant-banking-files-form.component';

describe('FinesFinanceUploadVariantBankingFilesFormComponent', () => {
  let fixture: ComponentFixture<FinesFinanceUploadVariantBankingFilesFormComponent>;
  let component: FinesFinanceUploadVariantBankingFilesFormComponent;
  /**
   * Creates parent-owned upload state for the shared form components.
   * @param overrides - Status, errors or identifiers required by the scenario.
   * @returns A row retaining its original browser file.
   */
  const row = (overrides: Partial<IAbstractMultiFileUploadItem> = {}): IAbstractMultiFileUploadItem => {
    const file = new File(['banking'], 'a121_261027_VB_123_AA.dat');
    return { id: 'banking-file', file, name: file.name, status: 'success', progress: 100, errors: [], ...overrides };
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesFinanceUploadVariantBankingFilesFormComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
    fixture = TestBed.createComponent(FinesFinanceUploadVariantBankingFilesFormComponent);
    component = fixture.componentInstance;
  });

  it('shows an empty list and picker without hints, submission actions or removal controls', () => {
    fixture.componentRef.setInput('files', []);
    fixture.detectChanges();

    const emptyState: HTMLParagraphElement = fixture.nativeElement.querySelector('#fines-finance-upload-empty-state');
    const sharedFiles: HTMLElement = fixture.nativeElement.querySelector('opal-lib-moj-multi-file-upload-files');
    expect(emptyState.textContent).toBe('No files uploaded');
    expect(emptyState.nextElementSibling?.tagName).toBe('HR');
    expect(emptyState.nextElementSibling?.classList.contains('govuk-section-break--visible')).toBe(true);
    expect(emptyState.compareDocumentPosition(sharedFiles) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(sharedFiles.contains(emptyState)).toBe(false);
    expect(sharedFiles.textContent).not.toContain('No files uploaded');
    expect(fixture.nativeElement.querySelector('#files-hint')).toBeNull();
    expect(fixture.nativeElement.querySelector('#files').getAttribute('aria-describedby')).not.toContain('files-hint');
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
    expect(fixture.nativeElement.querySelector('#fines-finance-upload-cancel')).toBeNull();
    expect(fixture.nativeElement.querySelector('#fines-finance-upload-submit')).toBeNull();
    expect(fixture.nativeElement.querySelector('.moj-multi-file-upload__delete')).toBeNull();
    expect(fixture.nativeElement.querySelector('.govuk-error-summary')).toBeNull();
    expect(component.form.controls.files.hasError('required')).toBe(false);
  });

  it.each(['empty', 'populated'])('hides the inbound-files paragraph by default for an %s list', (state) => {
    fixture.componentRef.setInput('files', state === 'empty' ? [] : [row()]);
    fixture.detectChanges();

    const wrapper: HTMLElement = fixture.nativeElement.querySelector('opal-lib-moj-multi-file-upload');
    expect(component.canViewInboundFiles).toBe(false);
    expect(fixture.nativeElement.querySelector('#fines-finance-upload-view-files')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('You can view the');
    expect(wrapper.nextElementSibling?.tagName).toBe('HR');
    expect(wrapper.nextElementSibling?.classList.contains('govuk-section-break--visible')).toBe(true);
    expect(fixture.nativeElement.querySelector('#files')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[role="status"]')).not.toBeNull();
  });

  it.each(['empty', 'populated'])(
    'shows the inbound-files link below the picker when permitted for an %s list',
    (state) => {
      fixture.componentRef.setInput('files', state === 'empty' ? [] : [row()]);
      fixture.componentRef.setInput('canViewInboundFiles', true);
      fixture.detectChanges();

      const link: HTMLAnchorElement = fixture.nativeElement.querySelector('#fines-finance-upload-view-files');
      const paragraph = link.closest('p')!;
      const wrapper: HTMLElement = fixture.nativeElement.querySelector('opal-lib-moj-multi-file-upload');
      const input: HTMLInputElement = fixture.nativeElement.querySelector('#files');
      expect(link.textContent.trim()).toBe('files you uploaded here');
      expect(link.getAttribute('href')).toBe('/fines/finance/inbound-files/search');
      expect(paragraph.textContent?.replace(/\s+/g, ' ').trim()).toBe('You can view the files you uploaded here.');
      expect(paragraph.previousElementSibling?.tagName).toBe('HR');
      expect(paragraph.previousElementSibling?.classList.contains('govuk-section-break--visible')).toBe(true);
      expect(input.compareDocumentPosition(paragraph) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(wrapper.contains(link)).toBe(false);
    },
  );

  it('forwards a native picker selection through the shared file control without a submit action', () => {
    const selected = row().file;
    const filesSelected = vi.spyOn(component.filesSelected, 'emit');
    fixture.componentRef.setInput('files', []);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#files');
    Object.defineProperty(input, 'files', { value: [selected], configurable: true });

    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(filesSelected).toHaveBeenCalledExactlyOnceWith([selected]);
    expect(component.form.controls.files.value).toEqual([selected]);
    expect(input.value).toBe('');
  });

  it('forwards dropped files and renders the parent announcement in a persistent live region', () => {
    const selected = row().file;
    const filesSelected = vi.spyOn(component.filesSelected, 'emit');
    fixture.componentRef.setInput('files', []);
    fixture.componentRef.setInput('announcement', 'One file is uploading.');
    fixture.detectChanges();
    const drop = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(drop, 'dataTransfer', { value: { files: [selected] } });

    fixture.nativeElement.querySelector('.moj-multi-file-upload__dropzone').dispatchEvent(drop);

    expect(filesSelected).toHaveBeenCalledExactlyOnceWith([selected]);
    expect(component.form.controls.files.value).toEqual([selected]);
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toBe('One file is uploading.');
  });

  it('keeps cumulative original files in the control as parent upload statuses change', () => {
    const first = row({ status: 'uploading', progress: 33 });
    const second = row({ id: 'second-file', status: 'pending', progress: null });
    fixture.componentRef.setInput('files', [first, second]);
    fixture.detectChanges();
    expect(component.form.controls.files.value).toEqual([first.file, second.file]);
    expect(component.form.controls.files.hasError('uploadPending')).toBe(true);

    fixture.componentRef.setInput('files', [
      { ...first, status: 'success', progress: 100 },
      { ...second, status: 'success', progress: 100 },
    ]);
    fixture.detectChanges();

    expect(component.form.controls.files.value).toEqual([first.file, second.file]);
    expect(component.form.controls.files.valid).toBe(true);
    expect(fixture.nativeElement.querySelectorAll('.moj-multi-file-upload__filename')).toHaveLength(2);
  });

  it('keeps rejected and failed messages with their rows without adding input errors or a summary', () => {
    fixture.componentRef.setInput('files', [
      row({ status: 'rejected', errors: ['Choose a DAT file.'] }),
      row({ id: 'server-failure', status: 'failed', errors: ['Server rejected this file.'] }),
    ]);
    fixture.detectChanges();

    const list: HTMLElement = fixture.nativeElement.querySelector('.moj-multi-file-upload__list');
    expect(list.textContent).toContain('Choose a DAT file.');
    expect(list.textContent).toContain('Server rejected this file.');
    expect(list.querySelectorAll('.moj-multi-file-upload__filename')).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('#files-error')).toBeNull();
    expect(fixture.nativeElement.querySelector('.govuk-error-summary')).toBeNull();
    expect(fixture.nativeElement.querySelector('.moj-multi-file-upload__delete')).toBeNull();
  });

  it('keeps successful rows and the file picker available without a completion action', () => {
    const uploaded = row();
    fixture.componentRef.setInput('files', [uploaded]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.moj-multi-file-upload__filename').textContent).toBe(uploaded.name);
    expect(
      fixture.nativeElement.querySelector('.moj-multi-file-upload__filename').classList.contains('govuk-body'),
    ).toBe(true);
    expect(fixture.nativeElement.querySelector('.moj-multi-file-upload__list').textContent).not.toContain('Uploaded');
    expect(fixture.nativeElement.querySelector('#files').disabled).toBe(false);
    expect(fixture.nativeElement.querySelector('#fines-finance-upload-submit')).toBeNull();
    expect(fixture.nativeElement.querySelector('.moj-multi-file-upload__delete')).toBeNull();
    expect(fixture.nativeElement.querySelector('#fines-finance-upload-empty-state')).toBeNull();
  });
});
