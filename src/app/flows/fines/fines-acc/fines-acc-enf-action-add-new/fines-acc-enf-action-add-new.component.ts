import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ENF_ACTION_ROUTING_PATHS } from '../fines-acc-enf-action-select/constants/fines-acc-enf-action-select-routing-paths.constant';
import { FinesAccBannerMessagesComponent } from '../fines-acc-banner-messages/fines-acc-banner-messages.component';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccEnfActionAddNewFormComponent } from './fines-acc-enf-action-add-new-form/fines-acc-enf-action-add-new-form.component';
import { IFinesAccEnfActionAddNewFormState } from './interfaces/fines-acc-enf-action-add-new-form-state.interface';

@Component({
  selector: 'app-fines-acc-enf-action-add-new',
  templateUrl: './fines-acc-enf-action-add-new.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FinesAccBannerMessagesComponent, FinesAccEnfActionAddNewFormComponent],
})
export class FinesAccEnfActionAddNewComponent extends AbstractFormParentBaseComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly payloadService = inject(FinesAccPayloadService);
  private readonly accountId = Number(this.route.snapshot.paramMap.get('accountId'));
  private readonly defendantAccountHeadingData = this.route.snapshot.data[
    'defendantAccountHeadingData'
  ] as IOpalFinesAccountDefendantDetailsHeader;
  private readonly accountState = this.payloadService.transformDefendantAccountHeaderForStore(
    this.accountId,
    this.defendantAccountHeadingData,
  );
  public readonly finesAccStore = inject(FinesAccountStore);
  public readonly accountNumber = this.accountState.account_number ?? '';
  public readonly partyName = this.accountState.party_name ?? '';

  public handleSubmit(form: IAbstractFormBaseForm<IFinesAccEnfActionAddNewFormState>): void {
    this.finesAccStore.clearSuccessMessage();

    if (form.formData.facc_enf_action_add_new) {
      this.routerNavigate(
        `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.root}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children.select}`,
      );
      return;
    }

    this.routerNavigate(
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
      false,
      undefined,
      null,
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement,
    );
  }

  public ngOnInit(): void {
    this.finesAccStore.setAccountState(this.accountState);
  }
}
