import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccMinorCreditorDetailsCreditorTab } from './fines-acc-minor-creditor-details-creditor-tab.component';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-minor-creditor-creditor.mock';
describe('FinesAccMinorCreditorDetailsCreditorTab', () => {
  let component: FinesAccMinorCreditorDetailsCreditorTab;
  let fixture: ComponentFixture<FinesAccMinorCreditorDetailsCreditorTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccMinorCreditorDetailsCreditorTab],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccMinorCreditorDetailsCreditorTab);
    component = fixture.componentInstance;
    component.tabData = structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK);
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should prevent default and emit changeCreditorDetails when changing creditor details', () => {
    const preventDefault = vi.fn();
    const event = { preventDefault } as unknown as Event;
    const emitSpy = vi.spyOn(component.changeCreditorDetails, 'emit');

    component.handleChangeCreditorDetails(event);

    expect(preventDefault).toHaveBeenCalledOnce();
    expect(emitSpy).toHaveBeenCalledOnce();
    expect(emitSpy.mock.calls[0]).toEqual([]);
  });
});
