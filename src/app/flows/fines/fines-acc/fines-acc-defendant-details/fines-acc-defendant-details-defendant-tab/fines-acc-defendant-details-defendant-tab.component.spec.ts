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

  it('should not render the actions column when no convert action is configured', () => {
    fixture.componentRef.setInput('hasAccountMaintenencePermission', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).not.toContain('Actions');
    expect(compiled.textContent).not.toContain('Convert to a company account');
    expect(compiled.textContent).not.toContain('Convert to an individual account');
  });

  it('should render an interactive convert-to-company action for paying individual accounts with permission', () => {
    fixture.componentRef.setInput('hasAccountMaintenencePermission', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Actions');
    expect(compiled.textContent).toContain('Convert to a company account');
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
    expect(compiled.textContent).toContain('Convert to an individual account');
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
    expect(compiled.textContent).not.toContain('Convert to a company account');
    expect(compiled.textContent).not.toContain('Convert to an individual account');
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

  it('should emit the company party type when the convert link is clicked', () => {
    fixture.componentRef.setInput('hasAccountMaintenencePermission', true);
    fixture.detectChanges();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.convertAccount, 'emit');
    component.handleConvertAccount();

    expect(component.convertAccount.emit).toHaveBeenCalledWith(FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY);
  });

  it('should emit the individual party type when the company convert link is clicked', () => {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.convertAccount, 'emit');
    component.handleConvertAccount();

    expect(component.convertAccount.emit).toHaveBeenCalledWith(
      FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL,
    );
  });
});
