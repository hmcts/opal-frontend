import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccMinorCreditorDetailsCreditorTab } from './fines-acc-minor-creditor-details-creditor-tab.component';
import { beforeEach, describe, expect, it } from 'vitest';
import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-minor-creditor-creditor.mock';
import { provideRouter } from '@angular/router';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from '../../routing/constants/fines-acc-minor-creditor-routing-paths.constant';

describe('FinesAccMinorCreditorDetailsCreditorTab', () => {
  let component: FinesAccMinorCreditorDetailsCreditorTab;
  let fixture: ComponentFixture<FinesAccMinorCreditorDetailsCreditorTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccMinorCreditorDetailsCreditorTab],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccMinorCreditorDetailsCreditorTab);
    component = fixture.componentInstance;
    component.tabData = structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK);
  });

  const getElement = (): HTMLElement => fixture.nativeElement as HTMLElement;

  const getChangeLink = (): HTMLAnchorElement | null =>
    (Array.from(getElement().querySelectorAll('a')) as HTMLAnchorElement[]).find(
      (anchor) => anchor.textContent?.trim() === 'Change',
    ) ?? null;

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should show the change link when the user has account maintenance permission', () => {
    component.hasAccountMaintenancePermission = true;

    fixture.detectChanges();

    expect(getChangeLink()).toBeTruthy();
  });

  it('should not show the change link when the user does not have account maintenance permission', () => {
    component.hasAccountMaintenancePermission = false;

    fixture.detectChanges();

    expect(getChangeLink()).toBeNull();
  });

  it('should return the amend route for the change link when the user has account maintenance permission in the BU', () => {
    component.hasAccountMaintenancePermissionInBU = true;

    expect(component.changeCreditorDetailsLink()).toBe(`../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.amend}`);
  });

  it('should return the access denied route for the change link when the user lacks account maintenance permission in the BU', () => {
    component.hasAccountMaintenancePermissionInBU = false;

    expect(component.changeCreditorDetailsLink()).toBe('/access-denied');
  });

  it('should show BACS details when the user has view creditor BACS permission', () => {
    component.hasViewCreditorBacsPermission = true;

    fixture.detectChanges();

    const textContent = getElement().textContent;
    expect(textContent).toContain('Name on account');
    expect(textContent).toContain('Test Account');
    expect(textContent).toContain('Sort code');
    expect(textContent).toContain('12-34-56');
    expect(textContent).toContain('Account number');
    expect(textContent).toContain('12345678');
    expect(textContent).toContain('Payment reference');
    expect(textContent).toContain('REF-001');
    expect(textContent).not.toContain('You do not have permission to view payment details on this account');
  });

  it('should hide BACS details and show the permission message when the user lacks view creditor BACS permission', () => {
    component.hasViewCreditorBacsPermission = false;

    fixture.detectChanges();

    const textContent = getElement().textContent;
    expect(textContent).not.toContain('Test Account');
    expect(textContent).not.toContain('12-34-56');
    expect(textContent).not.toContain('12345678');
    expect(textContent).not.toContain('REF-001');
    expect(textContent).toContain('You do not have permission to view payment details on this account');
  });
});
