import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccDefendantDetailsDefendantTabComponent } from './fines-acc-defendant-details-defendant-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES } from '../../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-party-types.constant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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

  it('should not render the actions column when convert-to-company is not enabled', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).not.toContain('Actions');
    expect(compiled.textContent).not.toContain('Convert to a company account');
  });

  it('should render a fixed convert-to-company action when enabled', () => {
    component.showConvertToCompanyAction = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Actions');
    expect(compiled.textContent).toContain('Convert to a company account');
  });

  it('should handle change defendant details when partyType is a company', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.changeDefendantDetails, 'emit');
    component.tabData.defendant_account_party.party_details.organisation_flag = true;
    component.handleChangeDefendantDetails();
    expect(component.changeDefendantDetails.emit).toHaveBeenCalledWith(
      FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY,
    );
  });

  it('should handle change defendant details when partyType is an individual', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.changeDefendantDetails, 'emit');
    component.tabData.defendant_account_party.party_details.organisation_flag = false;
    component.handleChangeDefendantDetails();
    expect(component.changeDefendantDetails.emit).toHaveBeenCalledWith(
      FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL,
    );
  });

  it('should emit convert-to-company when the action is clicked', () => {
    component.showConvertToCompanyAction = true;
    fixture.detectChanges();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.convertToCompanyAccount, 'emit');

    const convertLink = fixture.nativeElement.querySelector('.govuk-grid-column-one-third a') as HTMLAnchorElement;
    convertLink.click();

    expect(component.convertToCompanyAccount.emit).toHaveBeenCalledWith();
  });
});
