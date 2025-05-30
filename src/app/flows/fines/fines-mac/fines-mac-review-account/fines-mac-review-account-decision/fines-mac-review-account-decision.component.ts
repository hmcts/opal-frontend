import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FinesMacReviewAccountDecisionFormComponent } from './fines-mac-review-account-decision-form/fines-mac-review-account-decision-form.component';
import { IFinesMacReviewAccountDecisionForm } from './interfaces/fines-mac-review-account-decision-form.interface';
import { FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS } from '../../../fines-draft/fines-draft-check-and-validate/routing/constants/fines-draft-check-and-validate-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_DRAFT_ROUTING_PATHS } from '../../../fines-draft/routing/constants/fines-draft-routing-paths.constant';
import { FinesDraftStore } from '../../../fines-draft/stores/fines-draft.store';

@Component({
  selector: 'app-fines-mac-review-account-decision',
  imports: [FinesMacReviewAccountDecisionFormComponent],
  templateUrl: './fines-mac-review-account-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountDecisionComponent extends AbstractFormParentBaseComponent {
  @Input({ required: true }) public accountId!: number;
  private readonly finesDraftStore = inject(FinesDraftStore);
  private readonly finesRoutes = FINES_ROUTING_PATHS;
  private readonly finesDraftRoutes = FINES_DRAFT_ROUTING_PATHS;
  private readonly finesDraftCheckAndValidateRoutes = FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS;
  private readonly checkAndValidateTabs = `${this.finesRoutes.root}/${this.finesDraftRoutes.root}/${this.finesDraftRoutes.children.checkAndValidate}/${this.finesDraftCheckAndValidateRoutes.children.tabs}`;

  /**
   * Handles the submission of the fines MAC review account decision form.
   *
   * @param formData - The data submitted from the fines MAC review account decision form.
   * Logs the form data and navigates to the validated tab, preserving the current fragment from the fines draft store.
   */
  public handleFormSubmit(formData: IFinesMacReviewAccountDecisionForm): void {
    console.log(formData);
    this['router'].navigate([this.checkAndValidateTabs], {
      fragment: this.finesDraftStore.fragment(),
    });
  }
}
