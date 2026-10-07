import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import {
  InterfaceFileViewerFileSource,
  InterfaceFileViewerFileType,
  InterfaceFileViewerSupportedDomain,
} from '../constants/fines-finance-enums.constant';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IOpalFinesBusinessUnitRefData } from '../../services/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import {
  FINES_FINANCE_INBOUND_FILES_ALL_BUSINESS_UNITS,
  FINES_FINANCE_INBOUND_FILES_ALL_FILE_SOURCES,
  FINES_FINANCE_INBOUND_FILES_ALL_FILE_TYPES,
} from '../constants/fines-finance-autocomplete.constant';
import { CustomInboundFileViewerComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer';
import { FinesFinancePayloadService } from '../services/fines-finance-payload.service';
import { IFinesFinanceInboundFilesForm } from '../services/interfaces/fines-finance-inbound-files-form.interface';
import { OpalFileHandlingService } from '@hmcts/opal-frontend-common/services/opal-file-handling-service';

@Component({
  selector: 'app-fines-ext-finance-inbound-files',
  imports: [ReactiveFormsModule, CustomInboundFileViewerComponent],
  templateUrl: './fines-finance-inbound-files.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFinanceInboundFilesComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly payloadService = inject(FinesFinancePayloadService);
  private readonly opalFileHandlingService = inject(OpalFileHandlingService);
  public data: IAlphagovAccessibleAutocompleteItem[] = [];
  public readonly isInbound = true;
  public readonly domain = InterfaceFileViewerSupportedDomain.Fines;

  public readonly source: IAlphagovAccessibleAutocompleteItem[] = [
    {
      name: FINES_FINANCE_INBOUND_FILES_ALL_FILE_TYPES,
      value: FINES_FINANCE_INBOUND_FILES_ALL_FILE_TYPES,
    },
    ...Object.values(InterfaceFileViewerFileType).map((fileType) => ({
      name: fileType,
      value: fileType,
    })),
  ];

  public readonly sourceList: IAlphagovAccessibleAutocompleteItem[] = [
    {
      name: FINES_FINANCE_INBOUND_FILES_ALL_FILE_SOURCES,
      value: FINES_FINANCE_INBOUND_FILES_ALL_FILE_SOURCES,
    },
    ...Object.values(InterfaceFileViewerFileSource).map((fileSource) => ({
      name: fileSource,
      value: fileSource,
    })),
  ];

  public readonly businessUnits: IAlphagovAccessibleAutocompleteItem[] = this.createBusinessUnitAutoCompleteItems(
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

  public onFormSubmit(form: IAbstractFormBaseForm<unknown>): void {
    const searchParams = this.payloadService.buildInboundFilesSearchParams(
      form.formData as IFinesFinanceInboundFilesForm,
    );

    this.opalFileHandlingService.getInterfaceFilesRefData(searchParams).subscribe((response) => {
      console.log('File handling response:', response);
    });

    console.log(`top level Form submitted with payload: ${JSON.stringify(searchParams)}`);
  }
}
