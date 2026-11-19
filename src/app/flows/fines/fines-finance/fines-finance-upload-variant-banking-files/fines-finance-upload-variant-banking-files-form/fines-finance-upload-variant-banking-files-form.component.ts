import {
  afterNextRender,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Injector,
  Input,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { distinctUntilChanged, map, takeUntil } from 'rxjs';
import { AbstractMultiFileUploadComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-multi-file-upload';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
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
    GovukErrorSummaryComponent,
    MojMultiFileUploadComponent,
    MojMultiFileUploadInputComponent,
    MojMultiFileUploadFilesComponent,
  ],
  templateUrl: './fines-finance-upload-variant-banking-files-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFinanceUploadVariantBankingFilesFormComponent extends AbstractMultiFileUploadComponent {
  private readonly injector = inject(Injector);
  private readonly viewChangeDetectorRef = inject(ChangeDetectorRef);

  @ViewChild(GovukErrorSummaryComponent, { read: ElementRef })
  private readonly errorSummary?: ElementRef<HTMLElement>;

  protected override fieldErrors = {
    files: {
      maxFiles: {
        message: `You can only select up to ${FINES_FINANCE_VARIANT_BANKING_UPLOAD.maxFiles} files at the same time.`,
        priority: 1,
      },
      fileUpload: { message: 'One or more files could not be uploaded.', priority: 2 },
      uploadPending: { message: 'Wait for all files to finish uploading.', priority: 3 },
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
  public readonly maxFiles = FINES_FINANCE_VARIANT_BANKING_UPLOAD.maxFiles;
  public readonly maxFilesErrorMessage = this.fieldErrors.files.maxFiles.message;
  public readonly inboundFilesPath = `/${FINES_ROUTING_PATHS.root}/${FINES_FINANCE_ROUTING_PATHS.root}/${FINES_FINANCE_ROUTING_PATHS.children.inbound}/${FINES_FINANCE_ROUTING_PATHS.children.search}`;

  /** Shows selection-limit errors immediately; individual file outcomes remain in their rows. */
  public override ngOnInit(): void {
    super.ngOnInit();
    this.form.controls.files.statusChanges
      .pipe(
        map(() => this.form.controls.files.hasError('maxFiles')),
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe((exceedsMaxFiles) => {
        if (exceedsMaxFiles) {
          this.handleErrorMessages();
          afterNextRender(
            () => this.errorSummary?.nativeElement.querySelector<HTMLElement>('.govuk-error-summary')?.focus(),
            { injector: this.injector },
          );
        } else {
          this.setInitialErrorMessages();
        }
        this.viewChangeDetectorRef.markForCheck();
      });
  }
}
