import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccDefendantDetailsDefendantTabComponent } from './fines-acc-defendant-details-defendant-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';
import { FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES } from '../../fines-acc-debtor-add-amend/constants/fines-acc-debtor-add-amend-party-types.constant';

describe('FinesAccDefendantDetailsAtAGlanceTabComponent', () => {
  let component: FinesAccDefendantDetailsDefendantTabComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsDefendantTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsDefendantTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsDefendantTabComponent);
    component = fixture.componentInstance;
    component.tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle convert account click when partyType is a company', () => {
    spyOn(component.convertAccount, 'emit');
    component.tabData.defendant_account_party.party_details.organisation_flag = true;
    component.handleConvertAccount();
    expect(component.convertAccount.emit).toHaveBeenCalledWith(FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES.COMPANY);
  });

  it('should handle convert account click when partyType is an individual', () => {
    spyOn(component.convertAccount, 'emit');
    component.tabData.defendant_account_party.party_details.organisation_flag = false;
    component.handleConvertAccount();
    expect(component.convertAccount.emit).toHaveBeenCalledWith(FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES.INDIVIDUAL);
  });

  it('should handle change defendant details when partyType is a company', () => {
    spyOn(component.changeDefendantDetails, 'emit');
    component.tabData.defendant_account_party.party_details.organisation_flag = true;
    component.handleChangeDefendantDetails();
    expect(component.changeDefendantDetails.emit).toHaveBeenCalledWith(FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES.COMPANY);
  });

  it('should handle change defendant details when partyType is an individual', () => {
    spyOn(component.changeDefendantDetails, 'emit');
    component.tabData.defendant_account_party.party_details.organisation_flag = false;
    component.handleChangeDefendantDetails();
    expect(component.changeDefendantDetails.emit).toHaveBeenCalledWith(
      FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES.INDIVIDUAL,
    );
  });
});
