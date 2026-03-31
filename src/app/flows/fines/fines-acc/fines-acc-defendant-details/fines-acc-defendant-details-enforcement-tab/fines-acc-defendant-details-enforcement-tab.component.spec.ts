import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccDefendantDetailsEnforcementTab } from './fines-acc-defendant-details-enforcement-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesAccDefendantDetailsEnforcementTab', () => {
  let component: FinesAccDefendantDetailsEnforcementTab;
  let fixture: ComponentFixture<FinesAccDefendantDetailsEnforcementTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsEnforcementTab],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsEnforcementTab);
    component = fixture.componentInstance;
    component.tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handleAddEnforcementOverride when add enforcement override button is clicked', () => {
    const eventEmitterSpy = vi.spyOn(component.addEnforcementOverride, 'emit');
    const event = { preventDefault: vi.fn() } as unknown as Event;
    component.hasAccountMaintenancePermission = true;
    component.tabData.enforcement_override = null; // Ensure there is no existing enforcement override result
    component.handleAddEnforcementOverride(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(eventEmitterSpy).toHaveBeenCalled();
  });
});
