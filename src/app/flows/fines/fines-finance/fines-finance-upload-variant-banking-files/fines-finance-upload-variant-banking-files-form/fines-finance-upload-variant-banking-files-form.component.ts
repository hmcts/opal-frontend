import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AbstractMultiFileUploadComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-multi-file-upload';
import { MojMultiFileUploadComponent } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload';
import { MojMultiFileUploadInputComponent } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/moj-multi-file-upload-input';
import { MojMultiFileUploadFilesComponent } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/moj-multi-file-upload-files';
import { FINES_ROUTING_PATHS } from '../../../routing/constants/fines-routing-paths.constant';
import { FINES_FINANCE_ROUTING_PATHS } from '../../routing/constants/fines-finance-routing-paths.constant';
import { FINES_FINANCE_VARIANT_BANKING_UPLOAD } from '../constants/fines-finance-variant-banking-upload.constant';

/** Connects parent-owned upload rows to the shared picker, list and accessible announcements. */
@Component({
  selector: 'app-fines-finance-upload-variant-banking-files-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MojMultiFileUploadComponent,
    MojMultiFileUploadInputComponent,
    MojMultiFileUploadFilesComponent,
  ],
  templateUrl: './fines-finance-upload-variant-banking-files-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFinanceUploadVariantBankingFilesFormComponent extends AbstractMultiFileUploadComponent {
  protected override fieldErrors = {
    files: {
      fileUpload: { message: 'One or more files could not be uploaded.', priority: 1 },
      uploadPending: { message: 'Wait for all files to finish uploading.', priority: 2 },
    },
  };

  @Input() public canViewInboundFiles = false;

  public override form = new FormGroup({
    files: new FormControl<readonly File[]>([], {
      nonNullable: true,
      validators: [this.fileUploadValidator],
    }),
  });

  public readonly acceptedTypes = FINES_FINANCE_VARIANT_BANKING_UPLOAD.acceptedTypes;
  public readonly inboundFilesPath = `/${FINES_ROUTING_PATHS.root}/${FINES_FINANCE_ROUTING_PATHS.root}/${FINES_FINANCE_ROUTING_PATHS.children.inbound}/${FINES_FINANCE_ROUTING_PATHS.children.search}`;
}
