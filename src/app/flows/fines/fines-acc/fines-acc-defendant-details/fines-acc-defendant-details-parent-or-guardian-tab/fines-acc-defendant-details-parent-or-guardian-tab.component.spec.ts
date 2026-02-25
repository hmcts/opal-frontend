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
    component.tabData = OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PARENT_OR_GUARDIAN_TAB_REF_DATA_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle remove parent or guardian details click', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.removeParentOrGuardianDetails, 'emit');
    component.handleRemoveParentOrGuardianDetails();
    expect(component.removeParentOrGuardianDetails.emit).toHaveBeenCalled();
  });

  it('should handle change parent or guardian details click', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.changeParentOrGuardianDetails, 'emit');
    component.handleChangeParentOrGuardianDetails();
    expect(component.changeParentOrGuardianDetails.emit).toHaveBeenCalled();
  });
});
