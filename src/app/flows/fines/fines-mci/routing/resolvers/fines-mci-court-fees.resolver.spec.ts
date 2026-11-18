import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, ResolveStart, Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { IOpalFinesCourtFeesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-fees.interface';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { Observable, Subject, filter, firstValueFrom, of, take, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { FinesMciCreateTillCourtFeeDetailsComponent } from '../../fines-mci-create-till/fines-mci-create-till-court-fee-details/fines-mci-create-till-court-fee-details.component';
import { FinesMciCreateTillOverUnderpaymentConfirmationComponent } from '../../fines-mci-create-till/fines-mci-create-till-over-underpayment-confirmation/fines-mci-create-till-over-underpayment-confirmation.component';
import { finesMciCourtFeesResolver } from './fines-mci-court-fees.resolver';

@Component({ selector: 'app-test-previous-page', template: 'Previous page' })
class PreviousPageComponent {}

@Component({ selector: 'app-test-court-fee-page', template: 'Court fee page' })
class CourtFeePageComponent {
  public readonly fees = inject(ActivatedRoute).snapshot.data['courtFees'] as IOpalFinesCourtFeesResponse | null;
}

describe('finesMciCourtFeesResolver', () => {
  const getCourtFees = vi.fn();
  const response = {
    court_fees: [{ court_fee_id: 1, court_fee_code: 'CF001', description: 'Application', amount: 12.5 }],
  };
  const resolve = () =>
    firstValueFrom(
      TestBed.runInInjectionContext(() =>
        finesMciCourtFeesResolver({} as never, {} as never),
      ) as Observable<IOpalFinesCourtFeesResponse | null>,
    );

  beforeEach(() => {
    getCourtFees.mockReset();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'previous', component: PreviousPageComponent },
          { path: 'court-fee', component: CourtFeePageComponent, resolve: { courtFees: finesMciCourtFeesResolver } },
          {
            path: 'form',
            component: FinesMciCreateTillCourtFeeDetailsComponent,
            canDeactivate: [canDeactivateGuard],
            resolve: { courtFees: finesMciCourtFeesResolver },
          },
          {
            path: 'over-underpayment-confirmation',
            component: FinesMciCreateTillOverUnderpaymentConfirmationComponent,
            resolve: { courtFees: finesMciCourtFeesResolver },
          },
        ]),
        FinesMciStore,
        { provide: OpalFines, useValue: { getCourtFees } },
      ],
    });
  });

  it.each([response, { court_fees: [] }])(
    'loads the selected business unit’s fees, including an empty list',
    async (fees) => {
      const businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
      TestBed.inject(FinesMciStore).setBusinessUnit(businessUnit);
      getCourtFees.mockReturnValue(of(fees));

      expect(await resolve()).toEqual(fees);
      expect(getCourtFees).toHaveBeenCalledExactlyOnceWith(businessUnit.business_unit_id);
    },
  );

  it('does not request fees when no business unit is selected', async () => {
    expect(await resolve()).toBeNull();
    expect(getCourtFees).not.toHaveBeenCalled();
  });

  it('resolves an error state when the request fails', async () => {
    TestBed.inject(FinesMciStore).setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    getCourtFees.mockReturnValue(throwError(() => new Error('Unavailable')));

    expect(await resolve()).toBeNull();
  });

  it('requests the current business unit on each visit', async () => {
    const [firstUnit, secondUnit] = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData;
    const store = TestBed.inject(FinesMciStore);
    getCourtFees.mockReturnValue(of(response));
    store.setBusinessUnit(firstUnit);

    await resolve();
    store.setBusinessUnit(secondUnit);
    await resolve();

    expect(getCourtFees.mock.calls).toEqual([[firstUnit.business_unit_id], [secondUnit.business_unit_id]]);
  });

  it('waits for the fees before activating the destination', async () => {
    TestBed.inject(FinesMciStore).setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    const request = new Subject<IOpalFinesCourtFeesResponse>();
    getCourtFees.mockReturnValue(request.asObservable());
    const harness = await RouterTestingHarness.create('/previous');
    const router = TestBed.inject(Router);
    const resolveStarted = firstValueFrom(
      router.events.pipe(
        filter((event) => event instanceof ResolveStart),
        take(1),
      ),
    );

    const navigation = harness.navigateByUrl('/court-fee', CourtFeePageComponent);
    await resolveStarted;

    expect(router.url).toBe('/previous');
    expect(harness.routeNativeElement?.textContent).toContain('Previous page');
    request.next(response);
    request.complete();

    const component = await navigation;
    expect(component.fees).toEqual(response);
    expect(harness.routeNativeElement?.textContent).toContain('Court fee page');
  });

  it.each(['loaded', 'failed'])('protects the draft while the confirmation fees are %s', async (outcome) => {
    const store = TestBed.inject(FinesMciStore);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    store.setDraftJourney('courtFee');
    const request = new Subject<IOpalFinesCourtFeesResponse>();
    getCourtFees.mockReturnValueOnce(of(response)).mockReturnValueOnce(request.asObservable());
    const harness = await RouterTestingHarness.create();
    const form = await harness.navigateByUrl('/form', FinesMciCreateTillCourtFeeDetailsComponent);
    const router = TestBed.inject(Router);
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const resolveStarted = firstValueFrom(
      router.events.pipe(
        filter((event) => event instanceof ResolveStart),
        take(1),
      ),
    );
    const navigationCompleted = firstValueFrom(
      router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
      ),
    );
    const draft = { courtFeeId: 1, amountPaid: '30', numberOfItems: '2' };

    form.handleSubmit({ formData: draft, nestedFlow: false });
    await resolveStarted;
    harness.detectChanges();

    expect(confirm).not.toHaveBeenCalled();
    expect(form.handleBeforeUnload()).toBe(false);
    expect(form['canDeactivate']()).toBe(false);
    expect(harness.routeNativeElement?.textContent).toContain('Loading next screen');
    if (outcome === 'loaded') {
      request.next(response);
      request.complete();
    } else {
      request.error(new Error('Unavailable'));
    }
    await navigationCompleted;
    harness.detectChanges();

    expect(store.courtFeeDraft()).toEqual(draft);
    expect(harness.routeNativeElement?.textContent).toContain(
      outcome === 'loaded' ? 'Confirm overpayment' : 'Court fee payment details could not be loaded',
    );
  });
});
