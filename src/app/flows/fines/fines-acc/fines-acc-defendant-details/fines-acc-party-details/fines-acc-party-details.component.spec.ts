import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpperCasePipe } from '@angular/common';
import { FinesAccPartyDetails } from './fines-acc-party-details.component';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { IOpalFinesAccountPartyDetails } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';

describe('FinesAccPartyDetails', () => {
  let component: FinesAccPartyDetails;
  let fixture: ComponentFixture<FinesAccPartyDetails>;
  let mockPartyDetails: IOpalFinesAccountPartyDetails;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FinesAccPartyDetails,
        FinesNotProvidedComponent,
        UpperCasePipe,
        GovukSummaryCardListComponent,
        GovukSummaryListComponent,
        GovukSummaryListRowComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccPartyDetails);
    component = fixture.componentInstance;
    mockPartyDetails = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK.defendant_account_party);
  });

  it('should create the component', () => {
    fixture.componentRef.setInput('party', mockPartyDetails);
    fixture.componentRef.setInput('cardTitle', 'Test Card Title');
    fixture.componentRef.setInput('summaryCardListId', 'test-card-list');
    fixture.componentRef.setInput('summaryListId', 'test-summary-list');
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should accept required inputs', () => {
    fixture.componentRef.setInput('party', mockPartyDetails);
    fixture.componentRef.setInput('cardTitle', 'Party Details');
    fixture.componentRef.setInput('summaryCardListId', 'party-card');
    fixture.componentRef.setInput('summaryListId', 'party-list');
    fixture.detectChanges();

    expect(component.party).toEqual(mockPartyDetails);
    expect(component.cardTitle).toBe('Party Details');
    expect(component.summaryCardListId).toBe('party-card');
    expect(component.summaryListId).toBe('party-list');
  });

  it('should initialize language preferences constants', () => {
    fixture.componentRef.setInput('party', mockPartyDetails);
    fixture.componentRef.setInput('cardTitle', 'Test');
    fixture.componentRef.setInput('summaryCardListId', 'test');
    fixture.componentRef.setInput('summaryListId', 'test');
    fixture.detectChanges();

    expect(component.languages).toBeDefined();
  });

  it('should initialize date and utils services', () => {
    fixture.componentRef.setInput('party', mockPartyDetails);
    fixture.componentRef.setInput('cardTitle', 'Test');
    fixture.componentRef.setInput('summaryCardListId', 'test');
    fixture.componentRef.setInput('summaryListId', 'test');
    fixture.detectChanges();

    expect(component.dateService).toBeDefined();
    expect(component.utilsService).toBeDefined();
  });

  it('should handle organisation party details', () => {
    const organisationParty = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK.defendant_account_party);
    organisationParty.party_details.organisation_flag = true;
    organisationParty.party_details.organisation_details = {
      organisation_name: 'Test Company Ltd',
      organisation_aliases: [
        {
          alias_id: 'TRADING_NAME',
          sequence_number: 1,
          organisation_name: 'Test Co',
        },
      ],
    };

    fixture.componentRef.setInput('party', organisationParty);
    fixture.componentRef.setInput('cardTitle', 'Organisation');
    fixture.componentRef.setInput('summaryCardListId', 'org-card');
    fixture.componentRef.setInput('summaryListId', 'org-list');
    fixture.detectChanges();

    expect(component.party.party_details.organisation_flag).toBe(true);
    expect(component.party.party_details.organisation_details?.organisation_name).toBe('Test Company Ltd');
  });
});
