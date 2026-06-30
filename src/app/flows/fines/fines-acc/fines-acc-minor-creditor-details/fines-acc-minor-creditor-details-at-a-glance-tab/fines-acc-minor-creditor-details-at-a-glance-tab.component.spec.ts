import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccMinorCreditorDetailsAtAGlanceTabComponent } from './fines-acc-minor-creditor-details-at-a-glance-tab.component';
import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-minor-creditor-at-a-glance-with-defendant.mock';
import { provideRouter, Router } from '@angular/router';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from '../../routing/constants/fines-acc-minor-creditor-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '../../../routing/constants/fines-routing-paths.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from '../../routing/constants/fines-acc-routing-paths.constant';
import { beforeEach, describe, expect, it } from 'vitest';

describe('FinesAccMinorCreditorDetailsAtAGlanceTabComponent', () => {
  let component: FinesAccMinorCreditorDetailsAtAGlanceTabComponent;
  let fixture: ComponentFixture<FinesAccMinorCreditorDetailsAtAGlanceTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccMinorCreditorDetailsAtAGlanceTabComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccMinorCreditorDetailsAtAGlanceTabComponent);
    component = fixture.componentInstance;
    component.tabData = structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the add payment hold route when the user has the permission in the current BU', () => {
    component.hasAddRemovePaymentHoldPermissionInBU = true;

    expect(component.addPaymentHoldLink()).toBe(
      `../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children['payment-hold']}/add`,
    );
  });

  it('should return the payment hold denied route when the user lacks the permission in the current BU', () => {
    component.hasAddRemovePaymentHoldPermissionInBU = false;

    expect(component.addPaymentHoldLink()).toBe(
      `../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children['payment-hold']}/denied`,
    );
  });

  it('should return the remove payment hold route when the user has the permission in the current BU', () => {
    component.hasAddRemovePaymentHoldPermissionInBU = true;

    expect(component.removePaymentHoldLink()).toBe(
      `../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children['payment-hold']}/remove`,
    );
  });

  it('should return the defendant account details url', () => {
    const router = TestBed.inject(Router);
    const accountId = component.tabData.defendant!.account_id;
    const expectedUrl = `/${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.children.defendant}/${accountId}/${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`;

    expect(component.defendantAccountLink(accountId)).toBe(expectedUrl);
    expect(
      router.serializeUrl(
        router.createUrlTree([
          FINES_ROUTING_PATHS.root,
          FINES_ACC_ROUTING_PATHS.root,
          FINES_ACC_ROUTING_PATHS.children.defendant,
          accountId,
          FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
        ]),
      ),
    ).toBe(expectedUrl);
  });

  it('should render the defendant account link with target blank when an associated defendant exists', () => {
    fixture.componentRef.setInput('hasAssociatedDefendant', true);
    fixture.detectChanges();

    const defendantLink = fixture.nativeElement.querySelector('a.govuk-link--no-visited-state') as HTMLAnchorElement;

    expect(defendantLink).toBeTruthy();
    expect(defendantLink.getAttribute('target')).toBe('_blank');
  });
});
