import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { OpalFileHandlingService } from '@hmcts/opal-frontend-common/services/opal-file-handling-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { mount } from 'cypress/angular';
import { of, throwError } from 'rxjs';
import { FINES_PERMISSIONS } from 'src/app/constants/fines-permissions.constant';
import { FinesFinanceUploadVariantBankingFilesComponent } from 'src/app/flows/fines/fines-finance/fines-finance-upload-variant-banking-files/fines-finance-upload-variant-banking-files.component';

export type VariantBankingUploadSetupOptions = {
  permissionIds?: readonly number[];
};

/** Mounts the upload page with controlled permissions and a deterministic upload API response. */
export const setupVariantBankingUploadComponent = ({
  permissionIds = [FINES_PERMISSIONS['upload-variant-banking-files'], FINES_PERMISSIONS['view-interface-files']],
}: VariantBankingUploadSetupOptions = {}) => {
  const uploadInterfaceFile = (file: File) =>
    file.name.endsWith('_03.dat')
      ? throwError(() => new Error('The banking file is invalid.'))
      : of(
          new HttpResponse({
            status: 201,
            body: {
              interface_file_id: 9001,
              source: 'VARIANT_BANKING',
              target: 'OPAL',
              type: 'SOURCE',
              domain: 'FINES',
              status: 'SUCCESS',
              errors: null,
            },
          }),
        );

  return mount(FinesFinanceUploadVariantBankingFilesComponent, {
    providers: [
      provideHttpClient(),
      provideRouter([]),
      {
        provide: GlobalStore,
        useValue: {
          userState: () => ({
            business_unit_users: [
              { business_unit_id: 77, permissions: permissionIds.map((permission_id) => ({ permission_id })) },
            ],
          }),
        },
      },
      { provide: OpalFileHandlingService, useValue: { uploadInterfaceFile } },
    ],
  });
};
