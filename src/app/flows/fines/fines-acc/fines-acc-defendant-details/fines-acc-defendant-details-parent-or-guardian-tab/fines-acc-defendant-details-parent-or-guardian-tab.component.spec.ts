import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDefendantDetailsParentOrGuardianTabComponent } from './fines-acc-defendant-details-parent-or-guardian-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PARENT_OR_GUARDIAN_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-parent-or-guardian-tab-ref-data.mock';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES } from '../../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-party-types.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_REMOVE_NON_PAYING_PG_ROUTING_PATHS } from '../../fines-acc-remove-non-paying-pg/constants/fines-acc-remove-non-paying-pg-routing-paths.constant';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { FINES_ACC_RESTRICTED_ACCOUNT_STATUS_CODES } from '../../constants/fines-acc-restricted-account-status-codes.constant';

describe('FinesAccDefendantDetailsParentOrGuardianTabComponent', () => {
  let component: FinesAccDefendantDetailsParentOrGuardianTabComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsParentOrGuardianTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsParentOrGuardianTabComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsParentOrGuardianTabComponent);
    component = fixture.componentInstance;
    component.tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PARENT_OR_GUARDIAN_TAB_REF_DATA_MOCK);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the amend route when the user has account maintenance permission in the BU', () => {
    component.hasAccountMaintenancePermissionInBU = true;

    expect(component.changeParentOrGuardianDetailsLink()).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.party}/${FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.PARENT_GUARDIAN}/amend`,
    );
  });

  it('should return the access denied route for change when the user lacks account maintenance permission in the BU', () => {
    component.hasAccountMaintenancePermissionInBU = false;

    expect(component.changeParentOrGuardianDetailsLink()).toBe('/access-denied');
  });

  it('should make change parent or guardian action available when user has permission and account status is unrestricted', () => {
    fixture.componentRef.setInput('hasAccountMaintenencePermission', true);
    fixture.componentRef.setInput('accountStatusCode', 'L');
    fixture.detectChanges();

    expect(component.changeParentOrGuardianAction).toBe(true);
  });

  it.each(FINES_ACC_RESTRICTED_ACCOUNT_STATUS_CODES)(
    'should not make change parent or guardian action available for restricted account status %s',
    (statusCode) => {
      fixture.componentRef.setInput('hasAccountMaintenencePermission', true);
      fixture.componentRef.setInput('accountStatusCode', statusCode);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      expect(component.changeParentOrGuardianAction).toBe(false);
      expect(compiled.textContent).not.toContain('Change');
    },
  );

  it('should make remove parent or guardian action available when user has permission and party is not the debtor', () => {
    fixture.componentRef.setInput('hasAccountMaintenencePermission', true);
    fixture.detectChanges();

    expect(component.removeParentOrGuardianAction).toBe(true);
  });

  it('should not make remove parent or guardian action available when user does not have permission', () => {
    fixture.componentRef.setInput('hasAccountMaintenencePermission', false);
    fixture.detectChanges();

    expect(component.removeParentOrGuardianAction).toBe(false);
  });

  it('should not make remove parent or guardian action available when party is the debtor', () => {
    fixture.componentRef.setInput('hasAccountMaintenencePermission', true);
    fixture.componentRef.setInput('tabData', {
      ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PARENT_OR_GUARDIAN_TAB_REF_DATA_MOCK),
      defendant_account_party: {
        ...structuredClone(
          OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PARENT_OR_GUARDIAN_TAB_REF_DATA_MOCK.defendant_account_party,
        ),
        is_debtor: true,
      },
    });
    fixture.detectChanges();

    expect(component.removeParentOrGuardianAction).toBe(false);
  });

  it.each(FINES_ACC_RESTRICTED_ACCOUNT_STATUS_CODES)(
    'should not make remove parent or guardian action available for restricted account status %s',
    (statusCode) => {
      fixture.componentRef.setInput('hasAccountMaintenencePermission', true);
      fixture.componentRef.setInput('accountStatusCode', statusCode);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      expect(component.removeParentOrGuardianAction).toBe(false);
      expect(compiled.textContent).not.toContain('Remove Parent or guardian details');
    },
  );

  it('should return the remove route when the user has account maintenance permission in the BU and the action is available', () => {
    component.hasAccountMaintenencePermission = true;
    component.hasAccountMaintenancePermissionInBU = true;

    expect(component.removeParentOrGuardianDetailsLink()).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.remove}/${FINES_ACC_REMOVE_NON_PAYING_PG_ROUTING_PATHS.root}/${FINES_ACC_REMOVE_NON_PAYING_PG_ROUTING_PATHS.children.parentGuardian}`,
    );
  });

  it('should return the access denied route for remove when the user lacks account maintenance permission in the BU', () => {
    component.hasAccountMaintenencePermission = true;
    component.hasAccountMaintenancePermissionInBU = false;

    expect(component.removeParentOrGuardianDetailsLink()).toBe('/access-denied');
  });

  it('should not make remove parent or guardian action available when tab data is missing', () => {
    fixture.componentRef.setInput('hasAccountMaintenencePermission', true);
    fixture.componentRef.setInput('tabData', null);
    fixture.detectChanges();

    expect(component.removeParentOrGuardianAction).toBe(false);
  });
});
