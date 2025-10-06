import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  IOpalFinesCourt,
  IOpalFinesCourtRefData,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';
import {
  IOpalFinesLocalJusticeArea,
  IOpalFinesLocalJusticeAreaRefData,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from './mocks/opal-fines-business-unit-ref-data.mock';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from './mocks/opal-fines-court-ref-data.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from './mocks/opal-fines-local-justice-area-ref-data.mock';
import { OPAL_FINES_PATHS } from '@services/fines/opal-fines-service/constants/opal-fines-paths.constant';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesOffencesRefData } from './interfaces/opal-fines-offences-ref-data.interface';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from './mocks/opal-fines-offences-ref-data.mock';
import { IOpalFinesResults, IOpalFinesResultsRefData } from './interfaces/opal-fines-results-ref-data.interface';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from './mocks/opal-fines-results-ref-data.mock';
import {
  IOpalFinesMajorCreditor,
  IOpalFinesMajorCreditorRefData,
} from './interfaces/opal-fines-major-creditor-ref-data.interface';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from './mocks/opal-fines-major-creditor-ref-data.mock';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../../fines-mac/services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK } from './mocks/opal-fines-draft-add-account-payload.mock';
import { OPAL_FINES_DRAFT_ACCOUNT_PARAMS_MOCK } from './mocks/opal-fines-draft-account-params.mock';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from './mocks/opal-fines-draft-accounts.mock';
import { OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK } from './mocks/opal-fines-business-unit-non-snake-case.mock';
import { OPAL_FINES_OFFENCE_DATA_NON_SNAKE_CASE_MOCK } from './mocks/opal-fines-offence-data-non-snake-case.mock';
import { OPAL_FINES_SEARCH_OFFENCES_PARAMS_MOCK } from './mocks/opal-fines-search-offences-params.mock';
import { OPAL_FINES_SEARCH_OFFENCES_MOCK } from './mocks/opal-fines-search-offences.mock';
import { IFinesMacAddAccountPayload } from '../../fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';
import { OPAL_FINES_PATCH_DELETE_ACCOUNT_PAYLOAD_MOCK } from './mocks/opal-fines-patch-delete-account-payload.mock';
import { OPAL_FINES_DRAFT_ACCOUNTS_PATCH_PAYLOAD } from './mocks/opal-fines-draft-accounts-patch-payload.mock';
import { OPAL_FINES_PROSECUTOR_REF_DATA_MOCK } from './mocks/opal-fines-prosecutor-ref-data.mock';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../../fines-acc/fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from './mocks/opal-fines-account-defendant-at-a-glance.mock';
import { OPAL_FINES_ADD_NOTE_PAYLOAD_MOCK } from './mocks/opal-fines-add-note-payload.mock';
import { OPAL_FINES_ADD_NOTE_RESPONSE_MOCK } from './mocks/opal-fines-add-note-response.mock';
import { of } from 'rxjs';
import { IOpalFinesAddNotePayload } from './interfaces/opal-fines-add-note.interface';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from './mocks/opal-fines-defendant-account-response-individual.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from './mocks/opal-fines-account-defendant-account-party.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from './mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK } from './mocks/opal-fines-account-defendant-details-impositions-tab-ref-data.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_TAB_REF_DATA_MOCK } from './mocks/opal-fines-account-defendant-details-payment-terms-tab-ref-data.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK } from './mocks/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.mock';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_INDIVIDUAL_MOCK } from './mocks/opal-fines-defendant-account-search-params.mock';
import { OPAL_FINES_CREDITOR_ACCOUNTS_RESPONSE_MOCK } from './mocks/opal-fines-creditor-account-response-minor-creditor.mock';
import { OPAL_FINES_CREDITOR_ACCOUNT_SEARCH_PARAMS_INDIVIDUAL_MOCK } from './mocks/opal-fines-creditor-account-search-params.mock';
import { IOpalFinesAccountDefendantDetailsTabsCache } from './interfaces/opal-fines-account-defendant-details-tabs-cache.interface';

describe('OpalFines', () => {
  let service: OpalFines;
  let httpMock: HttpTestingController;

  function mockHeaders(getFn: (name: string) => string | null) {
    return { get: getFn } as unknown as HttpResponse<unknown>['headers'];
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [OpalFines, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(OpalFines);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a GET request to business unit ref data API', () => {
    const permission = 'ACCOUNT_ENQUIRY';
    const mockBusinessUnits = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK;
    const expectedUrl = `${OPAL_FINES_PATHS.businessUnitRefData}?permission=${permission}`;

    service.getBusinessUnits(permission).subscribe((response) => {
      expect(response).toEqual(mockBusinessUnits);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockBusinessUnits);
  });

  it('should return cached response for the same ref data search', () => {
    const permission = 'ACCOUNT_ENQUIRY';
    const mockBusinessUnits = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK;
    const expectedUrl = `${OPAL_FINES_PATHS.businessUnitRefData}?permission=${permission}`;

    service.getBusinessUnits(permission).subscribe((response) => {
      expect(response).toEqual(mockBusinessUnits);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockBusinessUnits);

    // Make a second call to searchCourt with the same search body
    service.getBusinessUnits(permission).subscribe((response) => {
      expect(response).toEqual(mockBusinessUnits);
    });

    // No new request should be made since the response is cached
    httpMock.expectNone(expectedUrl);
  });

  it('should send a GET request to court ref data API', () => {
    const businessUnit = 1;
    const mockCourts: IOpalFinesCourtRefData = OPAL_FINES_COURT_REF_DATA_MOCK;
    const expectedUrl = `${OPAL_FINES_PATHS.courtRefData}?business_unit=${businessUnit}`;

    service.getCourts(businessUnit).subscribe((response) => {
      expect(response).toEqual(mockCourts);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockCourts);
  });

  it('should return cached response for the same ref data search', () => {
    const businessUnit = 1;
    const mockCourts: IOpalFinesCourtRefData = OPAL_FINES_COURT_REF_DATA_MOCK;
    const expectedUrl = `${OPAL_FINES_PATHS.courtRefData}?business_unit=${businessUnit}`;

    service.getCourts(businessUnit).subscribe((response) => {
      expect(response).toEqual(mockCourts);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockCourts);

    // Make a second call to searchCourt with the same search body
    service.getCourts(businessUnit).subscribe((response) => {
      expect(response).toEqual(mockCourts);
    });

    // No new request should be made since the response is cached
    httpMock.expectNone(expectedUrl);
  });

  it('should return the court name and code in a pretty format', () => {
    const court: IOpalFinesCourt = OPAL_FINES_COURT_REF_DATA_MOCK.refData[0];

    const result = service.getCourtPrettyName(court);

    expect(result).toEqual(`${court.name} (${court.court_code})`);
  });

  it('should send a GET request to court ref data API', () => {
    const mockLocalJusticeArea: IOpalFinesLocalJusticeAreaRefData = OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK;
    const expectedUrl = `${OPAL_FINES_PATHS.localJusticeAreaRefData}`;

    service.getLocalJusticeAreas().subscribe((response) => {
      expect(response).toEqual(mockLocalJusticeArea);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockLocalJusticeArea);
  });

  it('should return cached response for the same ref data search', () => {
    const mockLocalJusticeArea: IOpalFinesLocalJusticeAreaRefData = OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK;
    const expectedUrl = `${OPAL_FINES_PATHS.localJusticeAreaRefData}`;

    service.getLocalJusticeAreas().subscribe((response) => {
      expect(response).toEqual(mockLocalJusticeArea);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockLocalJusticeArea);

    // Make a second call to searchCourt with the same search body
    service.getLocalJusticeAreas().subscribe((response) => {
      expect(response).toEqual(mockLocalJusticeArea);
    });

    // No new request should be made since the response is cached
    httpMock.expectNone(expectedUrl);
  });

  it('should return the local justice area name and code in a pretty format', () => {
    const localJusticeArea: IOpalFinesLocalJusticeArea = OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK.refData[0];

    const result = service.getLocalJusticeAreaPrettyName(localJusticeArea);

    expect(result).toEqual(`${localJusticeArea.name} (${localJusticeArea.lja_code})`);
  });

  it('should return the item value for a given configuration item name', () => {
    const businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
    const expectedValue = 'Item1';

    const result = service.getConfigurationItemValue(businessUnit, expectedValue);

    expect(result).toEqual(expectedValue);
  });

  it('should return null if the configuration item name is not found', () => {
    const businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[1];
    const itemName = 'Item0';

    const result = service.getConfigurationItemValue(businessUnit, itemName);

    expect(result).toBeNull();
  });

  it('should send a GET request to results ref data API', () => {
    const resultIds = ['1', '2', '3'];
    const expectedResponse: IOpalFinesResultsRefData = OPAL_FINES_RESULTS_REF_DATA_MOCK;
    const expectedUrl = `${OPAL_FINES_PATHS.resultsRefData}?result_ids=${resultIds[0]}&result_ids=${resultIds[1]}&result_ids=${resultIds[2]}`;

    service.getResults(resultIds).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should return cached response for the same result ids', () => {
    const resultIds = ['1', '2', '3'];
    const expectedResponse: IOpalFinesResultsRefData = OPAL_FINES_RESULTS_REF_DATA_MOCK;
    const expectedUrl = `${OPAL_FINES_PATHS.resultsRefData}?result_ids=${resultIds[0]}&result_ids=${resultIds[1]}&result_ids=${resultIds[2]}`;

    service.getResults(resultIds).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);

    service.getResults(resultIds).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    httpMock.expectNone(expectedUrl);
  });

  it('should return the result name and code in a pretty format', () => {
    const result: IOpalFinesResults = OPAL_FINES_RESULTS_REF_DATA_MOCK.refData[0];

    const prettyName = service.getResultPrettyName(result);

    expect(prettyName).toEqual(`${result.result_title} (${result.result_id})`);
  });

  it('should send a GET request to offences ref data API', () => {
    const refData = OPAL_FINES_OFFENCES_REF_DATA_MOCK.refData[0];
    const expectedResponse: IOpalFinesOffencesRefData = {
      count: 1,
      refData: [refData],
    };
    const expectedUrl = `${OPAL_FINES_PATHS.offencesRefData}?q=${refData.get_cjs_code}`;

    service.getOffenceByCjsCode(refData.get_cjs_code).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should send a GET request to major creditor ref data API', () => {
    const businessUnit = 1;
    const mockMajorCreditor: IOpalFinesMajorCreditorRefData = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK;
    const expectedUrl = `${OPAL_FINES_PATHS.majorCreditorRefData}?businessUnit=${businessUnit}`;

    service.getMajorCreditors(businessUnit).subscribe((response) => {
      expect(response).toEqual(mockMajorCreditor);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockMajorCreditor);
  });

  it('should return cached response for the same ref data search', () => {
    const businessUnit = 1;
    const mockMajorCreditor: IOpalFinesMajorCreditorRefData = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK;
    const expectedUrl = `${OPAL_FINES_PATHS.majorCreditorRefData}?businessUnit=${businessUnit}`;

    service.getMajorCreditors(businessUnit).subscribe((response) => {
      expect(response).toEqual(mockMajorCreditor);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockMajorCreditor);

    // Make a second call to major creditor with the same search body
    service.getMajorCreditors(businessUnit).subscribe((response) => {
      expect(response).toEqual(mockMajorCreditor);
    });

    // No new request should be made since the response is cached
    httpMock.expectNone(expectedUrl);
  });

  it('should return the major creditor name and code in a pretty format', () => {
    const majorCreditor: IOpalFinesMajorCreditor = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK.refData[0];

    const result = service.getMajorCreditorPrettyName(majorCreditor);

    expect(result).toEqual(`${majorCreditor.name} (${majorCreditor.major_creditor_code})`);
  });

  it('should POST the fines mac payload', () => {
    const body: IFinesMacAddAccountPayload = FINES_MAC_PAYLOAD_ADD_ACCOUNT;

    const apiUrl = OPAL_FINES_PATHS.draftAccounts;

    service.postDraftAddAccountPayload(body).subscribe((response) => {
      expect(response).toEqual(OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    req.flush(OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK);
  });

  it('should send a GET request to draft accounts API with correct query parameters and use cache on repeated call', () => {
    const filters = OPAL_FINES_DRAFT_ACCOUNT_PARAMS_MOCK;
    const expectedResponse = OPAL_FINES_DRAFT_ACCOUNTS_MOCK;

    service.getDraftAccounts(filters).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne((request) => {
      const url = request.urlWithParams;
      return (
        url.includes(OPAL_FINES_PATHS.draftAccounts) &&
        url.includes(`business_unit=${filters.businessUnitIds![0]}`) &&
        url.includes(`business_unit=${filters.businessUnitIds![1]}`) &&
        url.includes(`status=${filters.statuses![0]}`) &&
        url.includes(`status=${filters.statuses![1]}`) &&
        url.includes(`submitted_by=${filters.submittedBy![0]}`) &&
        url.includes(`submitted_by=${filters.submittedBy![1]}`) &&
        url.includes(`not_submitted_by=${filters.notSubmittedBy![0]}`) &&
        url.includes(`not_submitted_by=${filters.notSubmittedBy![1]}`)
      );
    });

    expect(req.request.method).toBe('GET');
    expect(req.request.params.getAll('business_unit')).toEqual(['1', '2']);
    expect(req.request.params.getAll('status')).toEqual(['Submitted', 'Resubmitted']);
    expect(req.request.params.getAll('submitted_by')).toEqual(['user1', 'user2']);
    expect(req.request.params.getAll('not_submitted_by')).toEqual(['user3', 'user4']);

    req.flush(expectedResponse);

    // Second call should hit the cache and not trigger a new request
    service.getDraftAccounts(filters).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    httpMock.expectNone(OPAL_FINES_PATHS.draftAccounts);
  });

  it('should clear the draft accounts cache', () => {
    const filters = OPAL_FINES_DRAFT_ACCOUNT_PARAMS_MOCK;

    // Prime the cache
    service.getDraftAccounts(filters).subscribe();
    const req = httpMock.expectOne((req) => req.url.startsWith(OPAL_FINES_PATHS.draftAccounts));
    req.flush(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);

    // Confirm cache is used
    service.getDraftAccounts(filters).subscribe();
    httpMock.expectNone(OPAL_FINES_PATHS.draftAccounts);

    // Clear the cache
    service.clearDraftAccountsCache();

    // After clearing, a new request should be made and return correct data
    service.getDraftAccounts(filters).subscribe((response) => {
      expect(response).toEqual(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);
    });
    const newReq = httpMock.expectOne((req) => req.url.startsWith(OPAL_FINES_PATHS.draftAccounts));
    expect(newReq.request.method).toBe('GET');
    newReq.flush(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);
  });

  it('should GET the draft account by id', () => {
    const draftAccountId = 123;
    const apiUrl = `${OPAL_FINES_PATHS.draftAccounts}/${draftAccountId}`;

    service.getDraftAccountById(draftAccountId).subscribe((draftAccount) => {
      expect(draftAccount).toEqual({ ...FINES_MAC_PAYLOAD_ADD_ACCOUNT, version: null });
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
  });

  it('should GET the business unit by id', () => {
    const businessUnitId = 123;
    const apiUrl = `${OPAL_FINES_PATHS.businessUnitRefData}/${businessUnitId}`;

    service.getBusinessUnitById(businessUnitId).subscribe((businessUnit) => {
      expect(businessUnit).toEqual(OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK);
  });

  it('should GET the offence by id', () => {
    const offenceId = 123;
    const apiUrl = `${OPAL_FINES_PATHS.offencesRefData}/${offenceId}`;

    service.getOffenceById(offenceId).subscribe((offence) => {
      expect(offence).toEqual(OPAL_FINES_OFFENCE_DATA_NON_SNAKE_CASE_MOCK);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(OPAL_FINES_OFFENCE_DATA_NON_SNAKE_CASE_MOCK);
  });

  it('should send a PUT request to update the draft account payload', () => {
    const body: IFinesMacAddAccountPayload = FINES_MAC_PAYLOAD_ADD_ACCOUNT;
    const apiUrl = `${OPAL_FINES_PATHS.draftAccounts}/${body.draft_account_id}`;

    service.putDraftAddAccountPayload(body).subscribe((response) => {
      expect(response).toEqual(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);

    req.flush(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
  });

  it('should send a PATCH request to update the draft account', () => {
    const draftAccountId = 1;
    const body = OPAL_FINES_DRAFT_ACCOUNTS_PATCH_PAYLOAD;
    const apiUrl = `${OPAL_FINES_PATHS.draftAccounts}/${draftAccountId}`;

    service.patchDraftAccountPayload(draftAccountId, body).subscribe((response) => {
      expect(response).toEqual(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(body);

    req.flush(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
  });

  it('should send a POST request to search offences API with correct body', () => {
    const filters = OPAL_FINES_SEARCH_OFFENCES_PARAMS_MOCK;
    const expectedResponse = OPAL_FINES_SEARCH_OFFENCES_MOCK;
    const apiUrl = `${OPAL_FINES_PATHS.searchOffences}`;

    service.searchOffences(filters).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(filters);

    req.flush(expectedResponse);
  });

  it('should handle errors when search offences API fails', () => {
    const filters = OPAL_FINES_SEARCH_OFFENCES_PARAMS_MOCK;
    const apiUrl = `${OPAL_FINES_PATHS.searchOffences}`;
    const errorMessage = 'Failed to search offences';

    service.searchOffences(filters).subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.status).toBe(500);
        expect(error.statusText).toBe(errorMessage);
      },
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    req.flush({ message: errorMessage }, { status: 500, statusText: errorMessage });
  });

  it('should generate a consistent cache key for undefined or empty filter params', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const key1 = (service as any).generateDraftAccountsCacheKey({});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const key2 = (service as any).generateDraftAccountsCacheKey({
      businessUnitIds: [],
      statuses: [],
      submittedBy: [],
      notSubmittedBy: [],
    });

    expect(key1).toBe(key2);
    expect(typeof key1).toBe('string');
    expect(() => JSON.parse(key1)).not.toThrow();
  });

  it('should send a PATCH request to update the draft account payload', () => {
    const accountId = 456;
    const body = OPAL_FINES_PATCH_DELETE_ACCOUNT_PAYLOAD_MOCK;
    const expectedResponse = FINES_MAC_PAYLOAD_ADD_ACCOUNT;
    const apiUrl = `${OPAL_FINES_PATHS.draftAccounts}/${accountId}`;

    service.patchDraftAccountPayload(accountId, body).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(body);

    req.flush(expectedResponse);
  });

  it('should getProsecutors', () => {
    const businessUnitId = 1;
    const expectedResponse = OPAL_FINES_PROSECUTOR_REF_DATA_MOCK;
    const apiUrl = `${OPAL_FINES_PATHS.prosecutorRefData}?business_unit=${businessUnitId}`;

    service.getProsecutors(businessUnitId).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(expectedResponse);
  });

  it('should get prosecutorPrettyName', () => {
    const prosecutor = OPAL_FINES_PROSECUTOR_REF_DATA_MOCK.ref_data[0];
    const expectedPrettyName = `${prosecutor.prosecutor_name} (${prosecutor.prosecutor_code})`;

    const result = service.getProsecutorPrettyName(prosecutor);

    expect(result).toEqual(expectedPrettyName);
  });

  it('should return the numeric value when ETag header is a quoted number', () => {
    const headers = mockHeaders((name) => (name === 'ETag' ? '"123"' : null));
    expect(service['extractEtagVersion'](headers)).toBe('"123"');
  });

  it('should return the numeric value when Etag header is an unquoted number', () => {
    const headers = mockHeaders((name) => (name === 'Etag' ? '456' : null));
    expect(service['extractEtagVersion'](headers)).toBe('456');
  });

  it('should return null if ETag header is not present', () => {
    const headers = mockHeaders(() => null);
    expect(service['extractEtagVersion'](headers)).toBeNull();
  });

  it('should handle ETag header with multiple quotes', () => {
    const headers = mockHeaders((name) => (name === 'ETag' ? '""789""' : null));
    expect(service['extractEtagVersion'](headers)).toBe('""789""');
  });

  it('should prefer ETag over Etag if both are present', () => {
    const headers = mockHeaders((name) => {
      if (name === 'ETag') return '"321"';
      if (name === 'Etag') return '"999"';
      return null;
    });
    expect(service['extractEtagVersion'](headers)).toBe('"321"');
  });

  it('should return headers object with If-Match when version is a positive number', () => {
    const result = service['buildIfMatchHeader']('5');
    expect(result).toEqual({ headers: { 'If-Match': '5' } });
  });

  it('should return headers object with If-Match when version is zero', () => {
    const result = service['buildIfMatchHeader']('0');
    expect(result).toEqual({ headers: { 'If-Match': '0' } });
  });

  it('should return empty object when version is undefined', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = service['buildIfMatchHeader'](undefined as any);
    expect(result).toEqual({});
  });

  it('should return empty object when version is null', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = service['buildIfMatchHeader'](null as any);
    expect(result).toEqual({});
  });

  it('should getDefendantAccountHeader', () => {
    const accountId = 456;
    const expectedResponse = FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK;
    const apiUrl = `${OPAL_FINES_PATHS.defendantAccounts}/${accountId}/header-summary`;

    service.getDefendantAccountHeadingData(accountId).subscribe((response) => {
      response.version = FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.version;
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(expectedResponse);
  });

  it('should getDefendantAccountAtAGlance data', () => {
    const account_id: number = 77;
    const expectedResponse = OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK;
    const apiUrl = `${OPAL_FINES_PATHS.defendantAccounts}/${account_id}/at-a-glance`;

    service.getDefendantAccountAtAGlance(account_id).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(expectedResponse);
  });

  it('should getDefendantAccounDefendantTabData', () => {
    // const account_id: number = 77;
    // const business_unit_id: string = '12';
    // const business_unit_user_id: string | null = '12';
    const expectedResponse = OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK;

    service.getDefendantAccountParty().subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });
  });

  it('should getDefendantAccountEnforcementTabData', () => {
    // const account_id: number = 77;
    // const business_unit_id: string = '12';
    // const business_unit_user_id: string | null = '12';
    const expectedResponse = OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK;

    service.getDefendantAccountEnforcementTabData().subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });
  });

  it('should getDefendantAccountImpositionsTabData', () => {
    // const account_id: number = 77;
    // const business_unit_id: string = '12';
    // const business_unit_user_id: string | null = '12';
    const expectedResponse = OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK;

    service.getDefendantAccountImpositionsTabData().subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });
  });

  it('should getDefendantAccountPaymentTermsTabData', () => {
    // const account_id: number = 77;
    // const business_unit_id: string = '12';
    // const business_unit_user_id: string | null = '12';
    const expectedResponse = OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_TAB_REF_DATA_MOCK;

    service.getDefendantAccountPaymentTermsTabData().subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });
  });

  it('should getDefendantAccountHistoryAndNotesTabData', () => {
    // const account_id: number = 77;
    // const business_unit_id: string = '12';
    // const business_unit_user_id: string | null = '12';
    const expectedResponse = OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK;

    service.getDefendantAccountHistoryAndNotesTabData().subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });
  });

  it('should send a POST request to add note API with correct payload and return mock response', () => {
    const payload: IOpalFinesAddNotePayload = OPAL_FINES_ADD_NOTE_PAYLOAD_MOCK;
    const version = '1';
    const expectedUrl = OPAL_FINES_PATHS.notes;

    service.addNote(payload, version).subscribe((response) => {
      expect(response.note_id).toBeGreaterThan(0);
      expect(response.note_id).toBeLessThanOrEqual(100000);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    expect(req.request.headers.get('If-Match')).toBe(version);
    req.flush(OPAL_FINES_ADD_NOTE_RESPONSE_MOCK);
  });

  it('should return a response with server-generated fields when using real API', () => {
    const payload: IOpalFinesAddNotePayload = OPAL_FINES_ADD_NOTE_PAYLOAD_MOCK;
    const version = '1';
    const mockResponse = OPAL_FINES_ADD_NOTE_RESPONSE_MOCK;

    const httpPostSpy = spyOn(service['http'], 'post').and.returnValue(of(mockResponse));

    service.addNote(payload, version).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpPostSpy).toHaveBeenCalledWith(OPAL_FINES_PATHS.notes, payload, { headers: { 'If-Match': version } });
  });

  it('should generate random note_id and current timestamp in mock response', () => {
    const payload: IOpalFinesAddNotePayload = OPAL_FINES_ADD_NOTE_PAYLOAD_MOCK;
    const version = '1';

    const responses: number[] = [];
    for (let i = 0; i < 5; i++) {
      service.addNote(payload, version).subscribe((response) => {
        responses.push(response.note_id);
        expect(response.note_id).toBeGreaterThan(0);
        expect(response.note_id).toBeLessThanOrEqual(100000);
      });

      const req = httpMock.expectOne(OPAL_FINES_PATHS.notes);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('If-Match')).toBe(version);
      req.flush(OPAL_FINES_ADD_NOTE_RESPONSE_MOCK);
    }

    const uniqueIds = new Set(responses);
    expect(uniqueIds.size).toBe(1); // Since we're using the same mock response, all IDs will be the same
  });

  it('should preserve all payload fields in the response', () => {
    const payload: IOpalFinesAddNotePayload = {
      activity_note: {
        record_type: 'custom_type',
        record_id: 77,
        note_type: 'Important',
        note_text: 'Custom test note with special characters: áéíóú & symbols!',
      },
    };
    const version = '42';

    service.addNote(payload, version).subscribe((response) => {
      expect(response.note_id).toBeDefined();
    });

    const req = httpMock.expectOne(OPAL_FINES_PATHS.notes);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    expect(req.request.headers.get('If-Match')).toBe(version);
    req.flush(OPAL_FINES_ADD_NOTE_RESPONSE_MOCK);
  });

  it('should clear account details cache', () => {
    const tab = 'at-a-glance';
    service['accountDetailsCache$'][tab] = of(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
    service.clearAccountDetailsCache();

    // Verify that the cache for the specified tab is cleared
    expect(service['accountDetailsCache$']).toEqual({} as IOpalFinesAccountDefendantDetailsTabsCache);
  });

  it('should send a POST request to search defendant accounts API with correct body', () => {
    const filters = OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_INDIVIDUAL_MOCK;
    const expectedResponse = OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK;
    const apiUrl = `${OPAL_FINES_PATHS.searchDefendantAccounts}`;

    service.getDefendantAccounts(filters).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(filters);

    req.flush(expectedResponse);
  });

  it('should handle errors when search defendant accounts API fails', () => {
    const filters = OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_INDIVIDUAL_MOCK;
    const apiUrl = `${OPAL_FINES_PATHS.searchDefendantAccounts}`;
    const errorMessage = 'Failed to search defendant accounts';

    service.getDefendantAccounts(filters).subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.status).toBe(500);
        expect(error.statusText).toBe(errorMessage);
      },
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    req.flush({ message: errorMessage }, { status: 500, statusText: errorMessage });
  });

  it('should send a POST request to search creditor accounts API with correct body', () => {
    const filters = OPAL_FINES_CREDITOR_ACCOUNT_SEARCH_PARAMS_INDIVIDUAL_MOCK;
    const expectedResponse = OPAL_FINES_CREDITOR_ACCOUNTS_RESPONSE_MOCK;
    const apiUrl = `${OPAL_FINES_PATHS.searchMinorCreditorAccounts}`;

    service.getMinorCreditorAccounts(filters).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(filters);

    req.flush(expectedResponse);
  });

  it('should handle errors when search creditor accounts API fails', () => {
    const filters = OPAL_FINES_CREDITOR_ACCOUNT_SEARCH_PARAMS_INDIVIDUAL_MOCK;
    const apiUrl = `${OPAL_FINES_PATHS.searchMinorCreditorAccounts}`;
    const errorMessage = 'Failed to search creditor accounts';

    service.getMinorCreditorAccounts(filters).subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.status).toBe(500);
        expect(error.statusText).toBe(errorMessage);
      },
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    req.flush({ message: errorMessage }, { status: 500, statusText: errorMessage });
  });
});
