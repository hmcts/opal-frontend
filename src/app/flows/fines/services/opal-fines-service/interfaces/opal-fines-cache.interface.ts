import { Observable } from 'rxjs';
import { IOpalFinesCourtRefData } from './opal-fines-court-ref-data.interface';
import { IOpalFinesBusinessUnitRefData } from './opal-fines-business-unit-ref-data.interface';
import { IOpalFinesLocalJusticeAreaRefData } from './opal-fines-local-justice-area-ref-data.interface';
import { IOpalFinesResultsRefData } from './opal-fines-results-ref-data.interface';
import { IOpalFinesOffencesRefData } from './opal-fines-offences-ref-data.interface';
import { IOpalFinesMajorCreditorRefData } from './opal-fines-major-creditor-ref-data.interface';
import { IOpalFinesDraftAccountsResponse } from './opal-fines-draft-account-data.interface';
import { IOpalFinesProsecutorRefData } from './opal-fines-prosecutor-ref-data.interface';
import { IOpalFinesAccountDefendantAtAGlance } from './opal-fines-account-defendant-at-a-glance.interface';
import { IOpalFinesAccountDefendantAccountParty } from './opal-fines-account-defendant-account-party.interface';
import { IOpalFinesAccountDefendantDetailsEnforcementTabRefData } from './opal-fines-account-defendant-details-enforcement-tab-ref-data.interface';
import { IOpalFinesAccountDefendantDetailsImpositionsTabRefData } from './opal-fines-account-defendant-details-impositions-tab-ref-data.interface';
import { IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData } from './opal-fines-account-defendant-details-history-and-notes-tab-ref-data.interface';
import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from './opal-fines-account-defendant-details-payment-terms-latest.interface';

export interface IOpalFinesCache {
  courtRefDataCache$: { [key: string]: Observable<IOpalFinesCourtRefData> };
  businessUnitsCache$: Observable<IOpalFinesBusinessUnitRefData> | null;
  businessUnitsPermissionCache$: { [key: string]: Observable<IOpalFinesBusinessUnitRefData> };
  localJusticeAreasCache$: Observable<IOpalFinesLocalJusticeAreaRefData> | null;
  resultsCache$: Observable<IOpalFinesResultsRefData> | null;
  offenceCodesCache$: { [key: string]: Observable<IOpalFinesOffencesRefData> };
  majorCreditorsCache$: { [key: string]: Observable<IOpalFinesMajorCreditorRefData> };
  draftAccountsCache$: { [key: string]: Observable<IOpalFinesDraftAccountsResponse> };
  prosecutorDataCache$: { [key: string]: Observable<IOpalFinesProsecutorRefData> };
  defendantAccountAtAGlanceCache$: Observable<IOpalFinesAccountDefendantAtAGlance> | null;
  defendantAccountPartyCache$: Observable<IOpalFinesAccountDefendantAccountParty> | null;
  defendantAccountparentOrGuardianAccountPartyCache$: Observable<IOpalFinesAccountDefendantAccountParty> | null;
  defendantAccountEnforcementCache$: Observable<IOpalFinesAccountDefendantDetailsEnforcementTabRefData> | null;
  defendantAccountImpositionsCache$: Observable<IOpalFinesAccountDefendantDetailsImpositionsTabRefData> | null;
  defendantAccountHistoryAndNotesCache$: Observable<IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData> | null;
  defendantAccountPaymentTermsLatestCache$: Observable<IOpalFinesAccountDefendantDetailsPaymentTermsLatest> | null;
}
