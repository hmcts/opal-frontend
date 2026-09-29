import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { InterfaceFileViewerFileSource, InterfaceFileViewerFileType} from '../constants/fines-finance-enums.constant';
import { ActivatedRoute, } from '@angular/router';
import { FormControl, FormGroup , ReactiveFormsModule} from '@angular/forms';
import {CustomInboundFileViewerComponent,} from "@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer"
import type {CustomInboundFileViewerItem} from "@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer"
import { IOpalFinesBusinessUnitRefData } from '../../services/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';

@Component({
  selector: 'app-fines-ext-finance-inbound-files',
  imports: [CustomInboundFileViewerComponent, ReactiveFormsModule],
  templateUrl: './fines-finance-inbound-files.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFinanceInboundFilesComponent {

  private readonly activatedRoute = inject(ActivatedRoute);
  public data: IAlphagovAccessibleAutocompleteItem[] = [];
  private businessUnitsRefData: IOpalFinesBusinessUnitRefData | null = null;

  public readonly filtersForm = new FormGroup({
    businessUnit: FormControl<string | null>(null),
    fileType: new FormControl<string | null>(null),
    fileSource: new FormControl<string | null>(null),
  });
  
  public readonly fileTypeAutoCompleteItems: IAlphagovAccessibleAutocompleteItem[] =
  Object.values(InterfaceFileViewerFileType).map((fileType) => ({
    name: fileType,
    value: fileType,
  })
);

public readonly fileSourceAutoCompleteItems: IAlphagovAccessibleAutocompleteItem[] =
  Object.values(InterfaceFileViewerFileSource).map((fileSource) => ({
    name: fileSource,
    value: fileSource,
  })
);

  public readonly inboundViewerItems: CustomInboundFileViewerItem[] = [
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
private createBusinessUnitAutoCompleteItems(result: IOpalFinesBusinessUnitRefData | null): IAlphagovAccessibleAutocompleteItem[] {
  const options = result?.refData.map((item) => ({
    value: item.business_unit_id.toString(),
    name: item.business_unit_name,
  })) ?? [];

  return [{ value: FINES_FINANCE_INBOUND_FILES_ALL_BUSINESS_UNITS, name: 'All business units' }, ...options];
}

public businessUnitAutocompleteOptionSets() {
  const items = this.data;
  return [
    {
      key: 'businessUnit',
      items: items,     
    }
  ]
}
  
public ngOnInit(): void {

  console.log(`Types...`);
  this.fileTypeAutoCompleteItems.forEach((item) =>{
    console.log(`name ${item.name} value ${item.value}`);
  });
  
  console.log(`Sources...`);
  this.fileSourceAutoCompleteItems.forEach((item)=>{
    console.log(`name ${item.name} value ${item.value}`);
  });
  
  this.businessUnitsRefData = this.activatedRoute.snapshot.data['businessUnits'] as IOpalFinesBusinessUnitRefData | null;
  this.data = this.createBusinessUnitAutoCompleteItems(this.businessUnitsRefData);



}

}
