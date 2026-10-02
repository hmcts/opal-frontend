import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { InterfaceFileViewerFileSource, InterfaceFileViewerFileType } from '../constants/fines-finance-enums.constant';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IOpalFinesBusinessUnitRefData } from '../../services/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import {
  FINES_FINANCE_INBOUND_FILES_ALL_BUSINESS_UNITS,
  FINES_FINANCE_INBOUND_FILES_ALL_FILE_SOURCES,
  FINES_FINANCE_INBOUND_FILES_ALL_FILE_TYPES,
} from '../constants/fines-finance-autocomplete.constant';
import { CustomInboundFileViewerComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer';
import { OpalFileHandlingService } from '@hmcts/opal-frontend-common/services/opal-file-handling-service';

@Component({
  selector: 'app-fines-ext-finance-inbound-files',
  imports: [ ReactiveFormsModule, CustomInboundFileViewerComponent  ],
  templateUrl: './fines-finance-inbound-files.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FinesFinanceInboundFilesComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly opalFileHandlingService = inject(OpalFileHandlingService);
  public data: IAlphagovAccessibleAutocompleteItem[] = [];
  
  public readonly direction = "inbound"
  public readonly fileTypeAutoCompleteItems: IAlphagovAccessibleAutocompleteItem[] = [
    {
      name: FINES_FINANCE_INBOUND_FILES_ALL_FILE_TYPES,
      value: FINES_FINANCE_INBOUND_FILES_ALL_FILE_TYPES,
    },
    ...Object.values(InterfaceFileViewerFileType).map((fileType) => ({
      name: fileType,
      value: fileType,
    })),
  ];

  public readonly fileSourceAutoCompleteItems: IAlphagovAccessibleAutocompleteItem[] = [
    {
      name: FINES_FINANCE_INBOUND_FILES_ALL_FILE_SOURCES,
      value: FINES_FINANCE_INBOUND_FILES_ALL_FILE_SOURCES,
    },
    ...Object.values(InterfaceFileViewerFileSource).map((fileSource) => ({
      name: fileSource,
      value: fileSource,
    })),
  ];

  public readonly businessUnitAutoCompleteItems: IAlphagovAccessibleAutocompleteItem[] =
    this.createBusinessUnitAutoCompleteItems(
      this.activatedRoute.snapshot.data['businessUnits'] as IOpalFinesBusinessUnitRefData | null,
    );

  /**
   * Creates an array of autocomplete items based on the business unit data.
   * @param result - The resolved business unit reference data.
   * @returns An array of autocomplete items.
   */
  private createBusinessUnitAutoCompleteItems(
    result: IOpalFinesBusinessUnitRefData | null,
  ): IAlphagovAccessibleAutocompleteItem[] {
    const options =
      result?.refData.map((item) => ({
        value: item.business_unit_id.toString(),
        name: item.business_unit_name,
      })) ?? [];

    return [{ value: FINES_FINANCE_INBOUND_FILES_ALL_BUSINESS_UNITS, name: 'All business units' }, ...options];
  }

  public ngOnInit(): void {
    console.log(`Types...`);
    this.fileTypeAutoCompleteItems.forEach((item) => {
      console.log(`name ${item.name} value ${item.value}`);
    });

    console.log(`Sources...`);
    this.fileSourceAutoCompleteItems.forEach((item) => {
      console.log(`name ${item.name} value ${item.value}`);
    });
 
    this.opalFileHandlingService
      .getInterfaceFilesRefData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((files) => {
        console.log(`Inbound files: ${JSON.stringify(files)}`);
        //this.data = files;
      });
  }

  public onFormSubmit(event: any): void {
    console.log(`Form submitted with event: ${JSON.stringify(event)}`);
  }

}
