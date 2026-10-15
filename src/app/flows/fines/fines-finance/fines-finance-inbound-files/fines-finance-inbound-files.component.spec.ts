import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CustomInboundFileViewerComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer';
import { CustomFileInterfaceViewerInboundTableWrapperComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-inbound-table-wrapper';
import { OpalFileHandlingService } from '@hmcts/opal-frontend-common/services/opal-file-handling-service';
import { IOpalFileHandlingInterfaceFilesRefData } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';
import { FinesFinancePayloadService } from '../services/fines-finance-payload.service';
import { FinesFinanceInboundFilesComponent } from './fines-finance-inbound-files.component';

describe('FinesFinanceInboundFiles', () => {
  let component: FinesFinanceInboundFilesComponent;
  let fixture: ComponentFixture<FinesFinanceInboundFilesComponent>;
  let response$: Subject<IOpalFileHandlingInterfaceFilesRefData>;
  const searchParams = { domain: 'Fines' };
  const buildInboundFilesSearchParams = vi.fn();
  const getInterfaceFilesRefData = vi.fn();
  const form = { formData: {}, nestedFlow: false };

  beforeEach(async () => {
    response$ = new Subject<IOpalFileHandlingInterfaceFilesRefData>();
    buildInboundFilesSearchParams.mockReset().mockReturnValue(searchParams);
    getInterfaceFilesRefData.mockReset().mockReturnValue(response$);

    await TestBed.configureTestingModule({
      imports: [FinesFinanceInboundFilesComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { businessUnits: null } } } },
        { provide: FinesFinancePayloadService, useValue: { buildInboundFilesSearchParams } },
        { provide: OpalFileHandlingService, useValue: { getInterfaceFilesRefData } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesFinanceInboundFilesComponent);
    component = fixture.componentInstance;
  });

  it('hides results until a search response arrives', () => {
    fixture.detectChanges();

    expect(component.interfaceFilesRefData()).toBeNull();
    expect(fixture.debugElement.query(By.directive(CustomFileInterfaceViewerInboundTableWrapperComponent))).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('There are no inbound interface files to display.');
  });

  it('passes a search response through the viewer to the table rows', async () => {
    fixture.detectChanges();
    const viewer = fixture.debugElement.query(By.directive(CustomInboundFileViewerComponent))
      .componentInstance as CustomInboundFileViewerComponent;
    viewer.formSubmit.emit(form);

    expect(buildInboundFilesSearchParams).toHaveBeenCalledWith(form.formData);
    expect(getInterfaceFilesRefData).toHaveBeenCalledWith(searchParams);

    response$.next({
      count: 1,
      interface_files: [
        {
          file_id: 1,
          file_name: 'inbound-example.xml',
          date_and_time: '2026-10-15T10:00:00',
          source: 'Example source',
          target: null,
          type: 'XML',
          domain: 'Fines',
          status: 'Received',
          business_unit_code: '001',
          file_store_uuid: null,
          checksum: null,
          errors: null,
        },
      ],
    });
    fixture.detectChanges();
    await fixture.whenStable();

    const table = fixture.debugElement.query(By.directive(CustomFileInterfaceViewerInboundTableWrapperComponent))
      .componentInstance as CustomFileInterfaceViewerInboundTableWrapperComponent;
    expect(table.tableData).toEqual([
      {
        'File ID': 1,
        'Date and time': '2026-10-15T10:00:00',
        Title: 'inbound-example.xml',
        Type: 'XML',
        'Business unit': '001',
        Source: 'Example source',
        Status: 'Received',
        Actions: null,
      },
    ]);
    expect(fixture.nativeElement.querySelector('tbody').textContent).toContain('inbound-example.xml');

    response$.next({ count: 0, interface_files: [] });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.debugElement.query(By.directive(CustomFileInterfaceViewerInboundTableWrapperComponent))).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('There are no inbound interface files to display.');
  });

  it('shows the empty state when the response has a null file list', async () => {
    fixture.detectChanges();
    component.onFormSubmit(form);

    response$.next({ count: 0, interface_files: null });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.debugElement.query(By.directive(CustomFileInterfaceViewerInboundTableWrapperComponent))).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('There are no inbound interface files to display.');
  });
});
