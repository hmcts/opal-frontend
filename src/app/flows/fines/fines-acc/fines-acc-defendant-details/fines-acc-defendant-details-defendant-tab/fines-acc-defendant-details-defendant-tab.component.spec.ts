import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDefendantDetailsDefendantTabComponent } from './fines-acc-defendant-details-defendant-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';

describe('FinesAccDefendantDetailsAtAGlanceTabComponent', () => {
  let component: FinesAccDefendantDetailsDefendantTabComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsDefendantTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsDefendantTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsDefendantTabComponent);
    component = fixture.componentInstance;
    component.tabData = OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle convert account click', () => {
    spyOn(component.convertAccount, 'emit');
    component.handleConvertAccount(new Event('click'));
    expect(component.convertAccount.emit).toHaveBeenCalled();
  });

  it('should handle change defendant details click', () => {
    spyOn(component.changeDefendantDetails, 'emit');
    component.handleChangeDefendantDetails(new Event('click'));
    expect(component.changeDefendantDetails.emit).toHaveBeenCalled();
  });
});
