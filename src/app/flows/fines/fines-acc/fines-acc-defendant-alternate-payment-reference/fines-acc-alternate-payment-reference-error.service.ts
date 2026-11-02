import { Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export const ALTERNATE_PAYMENT_REFERENCE_DUPLICATE_MESSAGE = 'The payment reference already exists';

export interface IFinesAccAlternatePaymentReferenceErrorContext {
  accountId: number;
  action: 'add' | 'edit';
  referenceId?: number;
  text: string;
  message: string;
}

/** Holds a failed submission only for the current APR journey; reference text is never persisted. */
@Injectable({ providedIn: 'root' })
export class FinesAccAlternatePaymentReferenceErrorService {
  private readonly storedContext = signal<IFinesAccAlternatePaymentReferenceErrorContext | null>(null);
  public readonly context = this.storedContext.asReadonly();

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        const context = this.context();
        if (!context) return;
        const root = `/fines/account/defendant/${context.accountId}/alternate/payment/reference/`;
        const destination = event.urlAfterRedirects.split(/[?#]/)[0];
        if (![`${root}error`, `${root}${context.action}`].includes(destination)) this.clear();
      });
  }

  public remember(context: IFinesAccAlternatePaymentReferenceErrorContext): void {
    this.storedContext.set(context);
  }

  public consumeDraft(accountId: number, action: 'add' | 'edit', referenceId?: number): string | null {
    const context = this.context();
    this.clear();
    return context?.accountId === accountId && context.action === action && context.referenceId === referenceId
      ? context.text
      : null;
  }

  public clear(): void {
    this.storedContext.set(null);
  }
}
