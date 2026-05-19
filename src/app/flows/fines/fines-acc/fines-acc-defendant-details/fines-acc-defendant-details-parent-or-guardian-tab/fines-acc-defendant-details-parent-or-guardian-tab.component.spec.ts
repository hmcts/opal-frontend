import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDefendantDetailsParentOrGuardianTabComponent } from './fines-acc-defendant-details-parent-or-guardian-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PARENT_OR_GUARDIAN_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-parent-or-guardian-tab-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesAccDefendantDetailsAtAGlanceTabComponent', () => {
  let component: FinesAccDefendantDetailsParentOrGuardianTabComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsParentOrGuardianTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsParentOrGuardianTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsParentOrGuardianTabComponent);
    component = fixture.componentInstance;
    component.tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PARENT_OR_GUARDIAN_TAB_REF_DATA_MOCK);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle remove parent or guardian details click', () => {
    const event = { preventDefault: vi.fn() } as unknown as Event;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.removeParentOrGuardianDetails, 'emit');
    component.handleRemoveParentOrGuardianDetails(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.removeParentOrGuardianDetails.emit).toHaveBeenCalledWith(event);
  });

  it('should handle change parent or guardian details click', () => {
    const event = { preventDefault: vi.fn() } as unknown as Event;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.changeParentOrGuardianDetails, 'emit');
    component.handleChangeParentOrGuardianDetails(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.changeParentOrGuardianDetails.emit).toHaveBeenCalled();
  });

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

  it('should not make remove parent or guardian action available when tab data is missing', () => {
    fixture.componentRef.setInput('hasAccountMaintenencePermission', true);
    fixture.componentRef.setInput('tabData', null);
    fixture.detectChanges();

    expect(component.removeParentOrGuardianAction).toBe(false);
  });
});
