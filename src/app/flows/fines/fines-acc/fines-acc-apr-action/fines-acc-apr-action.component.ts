import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FINES_ACC_APR_ROUTING_PATHS } from '../fines-acc-apr-manage/constants/fines-acc-apr-routing-paths.constant';

@Component({
  selector: 'app-fines-acc-apr-action',
  imports: [GovukBackLinkComponent, GovukHeadingWithCaptionComponent],
  templateUrl: './fines-acc-apr-action.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAprActionComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly accountStore = inject(FinesAccountStore);
  public readonly headingText = this.route.snapshot.routeConfig?.data?.['title'] as string;
  public readonly accountCaption = computed(
    () => `${this.accountStore.getAccountNumber()} - ${this.accountStore.party_name()}`,
  );

  public navigateToManage(): void {
    void this.router.navigate(['../', FINES_ACC_APR_ROUTING_PATHS.children.manage], { relativeTo: this.route });
  }
}
