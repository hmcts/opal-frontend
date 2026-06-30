import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccDefendantDetailsDefendantTabComponent } from './fines-acc-defendant-details-defendant-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES } from '../../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-party-types.constant';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT } from '../../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-text.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesAccDefendantDetailsDefendantTabComponent', () => {
  let component: FinesAccDefendantDetailsDefendantTabComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsDefendantTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsDefendantTabComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsDefendantTabComponent);
    component = fixture.componentInstance;
    component.tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render the actions column when no convert action is configured', () => {
    fixture.componentRef.setInput('hasAccountMaintenencePermission', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).not.toContain('Actions');
    expect(compiled.textContent).not.toContain(
      FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT[FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY].convertActionLabel,
    );
    expect(compiled.textContent).not.toContain(
      FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT[FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL]
        .convertActionLabel,
    );
  });

  it('should render an interactive convert-to-company action for paying individual accounts with permission', () => {
    fixture.componentRef.setInput('hasAccountMaintenencePermission', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Actions');
    expect(compiled.textContent).toContain(
      FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT[FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY].convertActionLabel,
    );
  });

  it('should render an interactive convert-to-individual action for paying company accounts with permission', () => {
    fixture.componentRef.setInput('hasAccountMaintenencePermission', true);
    fixture.componentRef.setInput('tabData', {
      ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK),
      defendant_account_party: {
        ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK.defendant_account_party),
        party_details: {
          ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK.defendant_account_party.party_details),
          organisation_flag: true,
        },
      },
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const convertLink = fixture.nativeElement.querySelector('.govuk-link');

    expect(compiled.textContent).toContain('Actions');
    expect(compiled.textContent).toContain(
      FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT[FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL]
        .convertActionLabel,
    );
    expect(convertLink).not.toBeNull();
  });

  it('should not render a convert action for non-paying accounts', () => {
    fixture.componentRef.setInput('hasAccountMaintenencePermission', true);
    fixture.componentRef.setInput('tabData', {
      ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK),
      defendant_account_party: {
        ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK.defendant_account_party),
        is_debtor: false,
      },
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).not.toContain('Actions');
    expect(compiled.textContent).not.toContain(
      FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT[FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY].convertActionLabel,
    );
    expect(compiled.textContent).not.toContain(
      FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT[FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL]
        .convertActionLabel,
    );
  });

  it('should show the change link when the user has account maintenance permission', () => {
    fixture.componentRef.setInput('hasAccountMaintenencePermission', true);
    fixture.detectChanges();

    const changeLink = (Array.from(fixture.nativeElement.querySelectorAll('a')) as HTMLAnchorElement[]).find(
      (anchor) => anchor.textContent?.trim() === 'Change',
    );

    expect(changeLink).toBeTruthy();
  });

  it('should not show the change link when the user does not have account maintenance permission', () => {
    fixture.componentRef.setInput('hasAccountMaintenencePermission', false);
    fixture.detectChanges();

    const changeLink = (Array.from(fixture.nativeElement.querySelectorAll('a')) as HTMLAnchorElement[]).find(
      (anchor) => anchor.textContent?.trim() === 'Change',
    );

    expect(changeLink).toBeFalsy();
  });

  it('should return the amend route for an individual defendant when the user has account maintenance permission in the BU', () => {
    component.hasAccountMaintenancePermissionInBU = true;
    component.tabData.defendant_account_party.party_details.organisation_flag = false;

    expect(component.changeDefendantDetailsLink()).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.party}/${FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL}/amend`,
    );
  });

  it('should return the amend route for a company defendant when the user has account maintenance permission in the BU', () => {
    component.hasAccountMaintenancePermissionInBU = true;
    component.tabData.defendant_account_party.party_details.organisation_flag = true;

    expect(component.changeDefendantDetailsLink()).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.party}/${FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY}/amend`,
    );
  });

  it('should return the access denied route when the user lacks account maintenance permission in the BU', () => {
    component.hasAccountMaintenancePermissionInBU = false;

    expect(component.changeDefendantDetailsLink()).toBe('/access-denied');
  });

  it('should return the convert route for an individual defendant when the user has account maintenance permission in the BU', () => {
    component.hasAccountMaintenencePermission = true;
    component.hasAccountMaintenancePermissionInBU = true;
    component.tabData.defendant_account_party.party_details.organisation_flag = false;

    expect(component.convertAccountLink()).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.convert}/${FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY}`,
    );
  });

  it('should return the convert route for a company defendant when the user has account maintenance permission in the BU', () => {
    component.hasAccountMaintenencePermission = true;
    component.hasAccountMaintenancePermissionInBU = true;
    component.tabData.defendant_account_party.party_details.organisation_flag = true;

    expect(component.convertAccountLink()).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.convert}/${FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL}`,
    );
  });

  it('should return the access denied route for convert when the user lacks account maintenance permission in the BU', () => {
    component.hasAccountMaintenencePermission = true;
    component.hasAccountMaintenancePermissionInBU = false;

    expect(component.convertAccountLink()).toBe('/access-denied');
  });

  it('should return the access denied route for convert when the action is not interactive', () => {
    component.hasAccountMaintenancePermissionInBU = true;
    vi.spyOn(component, 'convertAction', 'get').mockReturnValue({
      interactive: false,
      label: 'Convert',
      partyType: FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY,
    });

    expect(component.convertAccountLink()).toBe('/access-denied');
  });

  it('should return the add parent or guardian route when the user has account maintenance permission in the BU', () => {
    component.hasAccountMaintenencePermission = true;
    component.hasAccountMaintenancePermissionInBU = true;
    component.canAddParentOrGuardianDetails = true;

    expect(component.addParentOrGuardianDetailsLink()).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.party}/${FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.PARENT_GUARDIAN}/add`,
    );
  });

  it('should not render add parent or guardian details without permission', () => {
    fixture.componentRef.setInput('hasAccountMaintenencePermission', false);
    fixture.componentRef.setInput('canAddParentOrGuardianDetails', true);
    fixture.componentRef.setInput('tabData', {
      ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK),
      defendant_account_party: {
        ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK.defendant_account_party),
        is_debtor: false,
      },
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).not.toContain('Actions');
    expect(compiled.textContent).not.toContain('Add parent or guardian details');
  });

  it('should return the access denied route for add parent or guardian when the user lacks account maintenance permission in the BU', () => {
    component.hasAccountMaintenencePermission = true;
    component.hasAccountMaintenancePermissionInBU = false;
    component.canAddParentOrGuardianDetails = true;

    expect(component.addParentOrGuardianDetailsLink()).toBe('/access-denied');
  });

  it('should return the access denied route for add parent or guardian when the action is unavailable', () => {
    component.hasAccountMaintenencePermission = true;
    component.hasAccountMaintenancePermissionInBU = true;
    component.canAddParentOrGuardianDetails = false;

    expect(component.addParentOrGuardianDetailsLink()).toBe('/access-denied');
  });

  it('should return the access denied route for convert when no convert action is available', () => {
    component.hasAccountMaintenancePermissionInBU = true;

    expect(component.convertAccountLink()).toBe('/access-denied');
  });
});
