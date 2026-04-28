import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccMinorCreditorDetailsAtAGlanceTabComponent } from './fines-acc-minor-creditor-details-at-a-glance-tab.component';
import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK } from '@app/flows/fines/services/opal-fines-service/mocks/opal-fines-account-minor-creditor-at-a-glance-with-defendant.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesAccMinorCreditorDetailsAtAGlanceTabComponent', () => {
  let component: FinesAccMinorCreditorDetailsAtAGlanceTabComponent;
  let fixture: ComponentFixture<FinesAccMinorCreditorDetailsAtAGlanceTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccMinorCreditorDetailsAtAGlanceTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccMinorCreditorDetailsAtAGlanceTabComponent);
    component = fixture.componentInstance;
    component.tabData = OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit addPaymentHold event when handleAddPaymentHold is called', () => {
    const clickEvent = new MouseEvent('click');
    vi.spyOn(component.addPaymentHold, 'emit');
    component.handleAddPaymentHold(clickEvent);
    expect(component.addPaymentHold.emit).toHaveBeenCalled();
  });

  it('should emit removePaymentHold event when handleRemovePaymentHold is called', () => {
    const clickEvent = new MouseEvent('click');
    vi.spyOn(component.removePaymentHold, 'emit');
    component.handleRemovePaymentHold(clickEvent);
    expect(component.removePaymentHold.emit).toHaveBeenCalled();
  });

  it('should emit defendantAccountClick event with accountId when handleDefendantAccountClick is called', () => {
    const accountId = 123;
    const clickEvent = new MouseEvent('click');
    vi.spyOn(component.defendantAccountClick, 'emit');
    component.handleDefendantAccountClick(accountId, clickEvent);
    expect(component.defendantAccountClick.emit).toHaveBeenCalledWith(accountId);
  });
});
