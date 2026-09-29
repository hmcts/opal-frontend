import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { InterfaceFileViewerFileSource, InterfaceFileViewerFileType } from '../constants/fines-finance-enums.constant';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CustomInboundFileViewerComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer';
import type { CustomInboundFileViewerItem } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer';
import { IOpalFinesBusinessUnitRefData } from '../../services/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import {
  FINES_FINANCE_INBOUND_FILES_ALL_BUSINESS_UNITS,
  FINES_FINANCE_INBOUND_FILES_ALL_FILE_SOURCES,
  FINES_FINANCE_INBOUND_FILES_ALL_FILE_TYPES,
} from '../constants/fines-finance-autocomplete.constant';

@Component({
  selector: 'app-fines-ext-finance-inbound-files',
  imports: [CustomInboundFileViewerComponent, ReactiveFormsModule],
  templateUrl: './fines-finance-inbound-files.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFinanceInboundFilesComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  public data: IAlphagovAccessibleAutocompleteItem[] = [];

  public readonly filtersForm = new FormGroup({
    businessUnit: new FormControl<string | null>(null),
    fileType: new FormControl<string | null>(null),
    fileSource: new FormControl<string | null>(null),
  });

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

  public readonly inboundViewerItems: CustomInboundFileViewerItem[] = [
    {
      id: 'inbound-file-viewer-business-units',
      type: 'autocomplete',
      labelText: 'Filter by business unit',
      inputId: 'inbound-file-viewer-business-unit',
      inputName: 'inbound-file-viewer-business-unit',
      control: this.filtersForm.controls.businessUnit,
      autoCompleteItems: this.businessUnitAutoCompleteItems,
    },
    {
      id: 'inbound-file-viewer-file-types',
      type: 'autocomplete',
      labelText: 'Filter by type',
      inputId: 'inbound-file-viewer-file-types',
      inputName: 'inbound-file-viewer-file-types',
      control: this.filtersForm.controls.fileType,
      autoCompleteItems: this.fileTypeAutoCompleteItems,
    },
    {
      id: 'inbound-file-viewer-file-sources',
      type: 'autocomplete',
      labelText: 'Filter by source',
      inputId: 'inbound-file-viewer-file-sources',
      inputName: 'inbound-file-viewer-file-sources',
      control: this.filtersForm.controls.fileSource,
      autoCompleteItems: this.fileSourceAutoCompleteItems,
    },
  ];

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
  }
}
