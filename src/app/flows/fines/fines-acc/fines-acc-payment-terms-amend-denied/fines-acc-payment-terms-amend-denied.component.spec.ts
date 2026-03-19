import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccPaymentTermsAmendDeniedComponent } from './fines-acc-payment-terms-amend-denied.component';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FINES_ACCOUNT_STATE } from '../constants/fines-acc-state.constant';
import { ActivatedRoute } from '@angular/router';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-payment-terms-latest.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockAccountStore: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockActivatedRoute: any;

describe('FinesAccPaymentTermsAmendDeniedComponent', () => {
  let component: FinesAccPaymentTermsAmendDeniedComponent;
  let fixture: ComponentFixture<FinesAccPaymentTermsAmendDeniedComponent>;
  beforeEach(async () => {
    mockAccountStore = {
      getAccountState: vi.fn().mockName('FinesAccountStore.getAccountState'),
    };
    mockAccountStore.getAccountState.mockReturnValue(FINES_ACCOUNT_STATE);

    mockActivatedRoute = {
      snapshot: vi.fn().mockName('ActivatedRoute.snapshot'),
    };
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockActivatedRoute.snapshot = {
      paramMap: new Map([['type', 'permission']]) as any,
      data: {
        defendantAccountHeadingData: structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
        defendantAccountPaymentTermsData: structuredClone(
          OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK,
        ),
      },
    } as unknown as ActivatedRoute['snapshot'];

    await TestBed.configureTestingModule({
      imports: [FinesAccPaymentTermsAmendDeniedComponent],
      providers: [
        { provide: FinesAccountStore, useValue: mockAccountStore },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccPaymentTermsAmendDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enforce go back link template semantics', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const templateConsts = ((FinesAccPaymentTermsAmendDeniedComponent as any).ɵcmp?.consts ?? []).filter(
      (entry: unknown) => Array.isArray(entry),
    ) as unknown[][];
    const templateFunction =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((FinesAccPaymentTermsAmendDeniedComponent as any).ɵcmp?.template?.toString() as string | undefined) ?? '';
    const goBackLinkConst = templateConsts.find(
      (entry) => entry.includes('govuk-link') && entry.includes('govuk-!-margin-top-4') && entry.includes('click'),
    );

    expect(goBackLinkConst).toBeTruthy();
    expect(goBackLinkConst).toContain('href');
    expect(goBackLinkConst).toContain('');
    expect(goBackLinkConst).toContain('govuk-link--no-visited-state');
    expect(goBackLinkConst).not.toContain('tabindex');
    expect(templateFunction).not.toContain('keydown.enter');
    expect(templateFunction).not.toContain('keyup.enter');
  });

  it('should pass $event from go back link click and preserve logic', () => {
    const link = fixture.nativeElement.querySelector('a.govuk-link') as HTMLAnchorElement | null;
    expect(link).toBeTruthy();
    if (!link) throw new Error('Go back link not found');

    expect(link.textContent?.trim()).toBe('Go back');
    expect(link.classList.contains('govuk-link--no-visited-state')).toBe(true);
    expect(link.getAttribute('href')).toBe('');
    expect(link.getAttribute('tabindex')).toBeNull();

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlerSpy = vi.spyOn<any, any>(component, 'navigateBackToAccountSummary');
    const routerSpy = vi.spyOn<any, any>(component['router'], 'navigate');

    link.dispatchEvent(clickEvent);

    expect(handlerSpy).toHaveBeenCalledWith(clickEvent);
    expect(clickEvent.defaultPrevented).toBe(true);
    expect(routerSpy).toHaveBeenCalledWith([`../../../details`], { relativeTo: component['route'] });
  });

  it('should prevent default and navigate back to account summary on navigateBackToAccountSummary', () => {
    const routerSpy = vi.spyOn<any, any>(component['router'], 'navigate');
    const event = new Event('click');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    component.navigateBackToAccountSummary(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith([`../../../details`], { relativeTo: component['route'] });
  });
});
