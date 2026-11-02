import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from '../routing/constants/fines-acc-routing-paths.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_DEFENDANT_DETAILS_TABS_KEYS } from '../fines-acc-defendant-details/constants/fines-acc-defendant-details-tabs-keys.constant';

@Component({
  selector: 'app-fines-acc-defendant-alternate-payment-reference-access-denied',
  imports: [RouterLink],
  templateUrl: './fines-acc-defendant-alternate-payment-reference-access-denied.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantAlternatePaymentReferenceAccessDeniedComponent {
  private readonly route = inject(ActivatedRoute);

  public readonly accountDetailsLink = [
    `/${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_DEFENDANT_ROUTING_PATHS.root}`,
    this.route.snapshot.paramMap.get('accountId'),
    FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
  ];
  public readonly paymentTermsFragment = FINES_ACC_DEFENDANT_DETAILS_TABS_KEYS['payment-terms'];
}
