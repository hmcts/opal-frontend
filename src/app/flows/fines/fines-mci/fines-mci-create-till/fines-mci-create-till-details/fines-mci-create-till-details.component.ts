import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';
import {
  FinesMciJourney,
  IFinesMciSuspensePayerDetails,
  IFinesMciSuspensePayment,
} from '../../stores/interfaces/fines-mci.interface';
import { formatPoundsFromDecimal } from '../utils/fines-mci-currency.utils';

@Component({
  selector: 'app-fines-mci-create-till-details',
  imports: [GovukBackLinkComponent, GovukButtonComponent, GovukSummaryListComponent, GovukSummaryListRowComponent],
  templateUrl: './fines-mci-create-till-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillDetailsComponent {
  private allowIntendedNavigation = false;
  private readonly router = inject(Router);
  protected readonly finesMciStore = inject(FinesMciStore);

  /** Opens a page within the till journey and allows that navigation past the leave guard. */
  private navigateTo(path: string, extras?: NavigationExtras): void {
    this.allowIntendedNavigation = true;
    void this.router.navigate(
      [
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.children.create,
        FINES_MCI_ROUTING_PATHS.children.till,
        path,
      ],
      extras,
    );
  }

  /** Formats a saved amount in pounds, or shows a dash when it is missing. */
  protected formatAmount(amount: string | undefined): string {
    return formatPoundsFromDecimal(amount);
  }

  /** Returns the label shown in the Category column for a payment journey. */
  protected paymentCategory(journey: FinesMciJourney): string {
    const categories: Record<FinesMciJourney, string> = {
      criminal: 'Criminal',
      courtFee: 'Court fee',
      suspense: 'Suspense',
    };
    return categories[journey];
  }

  /** Returns the label for who supplied a suspense payment. */
  protected receivedFrom(payerType: IFinesMciSuspensePayment['payerType'] | undefined): string {
    if (payerType === 'defendant') return 'Defendant';
    if (payerType === 'thirdParty') return '3rd party';
    return '—';
  }

  /** Returns the display name of a suspense payment method. */
  protected paymentMethod(method: IFinesMciSuspensePayment['methodOfPayment'] | undefined): string {
    if (!method) return '—';
    const methods: Record<NonNullable<IFinesMciSuspensePayment['methodOfPayment']>, string> = {
      notesCoins: 'Notes and coins',
      postalOrder: 'Postal order',
      cheque: 'Cheque',
      creditTransfer: 'Credit transfer',
    };
    return methods[method];
  }

  /** Returns the company or individual payer name, or a dash when no name was supplied. */
  protected payerName(payer: IFinesMciSuspensePayerDetails | null | undefined): string {
    return payer?.payerType === 'company'
      ? payer.companyName || '—'
      : [payer?.firstNames, payer?.lastName].filter(Boolean).join(' ') || '—';
  }

  /** Blocks navigation away from the till except through an action on this page. */
  public canDeactivate(): CanDeactivateTypes {
    return this.allowIntendedNavigation;
  }

  /** Prevents browser unload while the till is being created. */
  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return false;
  }

  /** Returns to business unit selection while preserving the current choice. */
  public navigateBack(): void {
    this.navigateTo(FINES_MCI_ROUTING_PATHS.children.selectBusinessUnit, { state: { preserveBusinessUnit: true } });
  }

  /** Clears any abandoned suspense edit before opening payment category selection. */
  public addPayment(): void {
    this.finesMciStore.discardSuspensePayment();
    this.navigateTo(FINES_MCI_ROUTING_PATHS.children.paymentCategory);
  }

  /** Restores a saved suspense payment and opens its check page for amendment. */
  public changeSuspensePayment(paymentId: string): void {
    this.finesMciStore.editSuspensePayment(paymentId);
    this.navigateTo(FINES_MCI_ROUTING_PATHS.children.checkSuspensePayment);
  }

  /** Opens the cancel journey after suppressing the link's default navigation. */
  public cancel(event: Event): void {
    event.preventDefault();
    this.navigateTo(FINES_MCI_ROUTING_PATHS.children.cancel);
  }
}
