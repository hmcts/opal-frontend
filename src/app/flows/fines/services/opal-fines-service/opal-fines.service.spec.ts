import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { IOpalFinesAddDefendantAccountNoteBody } from '@services/fines/opal-fines-service/interfaces/opal-fines-add-defendant-account-note-body.interface';
import {
  IOpalFinesCourt,
  IOpalFinesCourtRefData,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';
import { IOpalFinesGetDefendantAccountParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-get-defendant-account-params.interface';
import {
  IOpalFinesLocalJusticeArea,
  IOpalFinesLocalJusticeAreaRefData,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';
import { IOpalFinesSearchCourt } from '@services/fines/opal-fines-service/interfaces/opal-fines-search-court.interface';
import { IOpalFinesSearchCourtBody } from '@services/fines/opal-fines-service/interfaces/opal-fines-search-court-body.interface';
import { IOpalFinesSearchDefendantAccountBody } from '@services/fines/opal-fines-service/interfaces/opal-fines-search-defendant-account-body.interface';

import { OPAL_FINES_ADD_DEFENDANT_ACCOUNT_NOTE_BODY_MOCK } from './mocks/opal-fines-add-defendant-account-note.mock';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from './mocks/opal-fines-business-unit-ref-data.mock';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from './mocks/opal-fines-court-ref-data.mock';
import { OPAL_FINES_DEFENDANT_ACCOUNT_DETAILS_MOCK } from './mocks/opal-fines-defendant-account-details.mock';
import { OPAL_FINES_DEFENDANT_ACCOUNT_MOCK } from './mocks/opal-fines-defendant-account.mock';
import { OPAL_FINES_DEFENDANT_ACCOUNT_NOTES_MOCK } from './mocks/opal-fines-defendant-account-notes.mock';
import { OPAL_FINES_DEFENDANT_ACCOUNT_NOTE_MOCK } from './mocks/opal-fines-defendant-account-note.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from './mocks/opal-fines-local-justice-area-ref-data.mock';
import { OPAL_FINES_SEARCH_COURT_BODY_MOCK } from './mocks/opal-fines-search-court-body.mock';
import { OPAL_FINES_SEARCH_COURT_MOCK } from './mocks/opal-fines-search-court.mock';
import { OPAL_FINES_SEARCH_DEFENDANT_ACCOUNTS_MOCK } from './mocks/opal-fines-search-defendant-accounts.mock';

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
import { OPAL_FINES_DRAFT_ACCOUNT_PARAMS_MOCK } from './mocks/opal-fines-draft-account-params.mock';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from './mocks/opal-fines-draft-accounts.mock';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../../fines-mac/services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { IFinesMacAddAccountPayload } from '../../fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';

describe('OpalFines', () => {
  let service: OpalFines;
  let httpMock: HttpTestingController;

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

  it('should send a POST request to court search API', () => {
    const searchBody: IOpalFinesSearchCourtBody = OPAL_FINES_SEARCH_COURT_BODY_MOCK;
    const expectedResponse: IOpalFinesSearchCourt[] = OPAL_FINES_SEARCH_COURT_MOCK;

    service.searchCourt(searchBody).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(OPAL_FINES_PATHS.courtSearch);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(searchBody);
    req.flush(expectedResponse);
  });

  it('should return cached response for the same court search', () => {
    const searchBody: IOpalFinesSearchCourtBody = OPAL_FINES_SEARCH_COURT_BODY_MOCK;
    const expectedResponse: IOpalFinesSearchCourt[] = OPAL_FINES_SEARCH_COURT_MOCK;

    service.searchCourt(searchBody).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(OPAL_FINES_PATHS.courtSearch);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(searchBody);
    req.flush(expectedResponse);

    // Make a second call to searchCourt with the same search body
    service.searchCourt(searchBody).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    // No new request should be made since the response is cached
    httpMock.expectNone(OPAL_FINES_PATHS.courtSearch);
  });

  it('should send a GET request to court ref data API', () => {
    const businessUnit = 1;
    const mockCourts: IOpalFinesCourtRefData = OPAL_FINES_COURT_REF_DATA_MOCK;
    const expectedUrl = `${OPAL_FINES_PATHS.courtRefData}?businessUnit=${businessUnit}`;

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
    const expectedUrl = `${OPAL_FINES_PATHS.courtRefData}?businessUnit=${businessUnit}`;

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

  it('should GET the defendant account', () => {
    const params: IOpalFinesGetDefendantAccountParams = {
      businessUnitId: 1,
      accountNumber: '1212',
    };
    const apiUrl = `${OPAL_FINES_PATHS.defendantAccount}?businessUnitId=${params.businessUnitId}&accountNumber=${params.accountNumber}`;

    service.getDefendantAccount(params).subscribe((defendantAccount) => {
      expect(defendantAccount).toEqual(OPAL_FINES_DEFENDANT_ACCOUNT_MOCK);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(OPAL_FINES_DEFENDANT_ACCOUNT_MOCK);
  });

  it('should RETURN the defendant account search', () => {
    const body: IOpalFinesSearchDefendantAccountBody = {
      court: 'Bath',
      surname: 'Test',
      forename: 'Test',
      initials: 'TT',
      dateOfBirth: {
        dayOfMonth: '12',
        monthOfYear: '12',
        year: '1981',
      },
      addressLine: 'Test',
      niNumber: 'TT1234',
      pcr: '1234',
    };
    const apiUrl = OPAL_FINES_PATHS.defendantAccountSearch;

    service.searchDefendantAccounts(body).subscribe((searchDefendantAccounts) => {
      expect(searchDefendantAccounts).toEqual(OPAL_FINES_SEARCH_DEFENDANT_ACCOUNTS_MOCK);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    req.flush(OPAL_FINES_SEARCH_DEFENDANT_ACCOUNTS_MOCK);
  });

  it('should POST the defendant account note', () => {
    const body: IOpalFinesAddDefendantAccountNoteBody = OPAL_FINES_ADD_DEFENDANT_ACCOUNT_NOTE_BODY_MOCK;

    const apiUrl = OPAL_FINES_PATHS.defendantAccountAddNote;

    service.addDefendantAccountNote(body).subscribe((defendantAccountNote) => {
      expect(defendantAccountNote).toEqual(OPAL_FINES_DEFENDANT_ACCOUNT_NOTE_MOCK);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    req.flush(OPAL_FINES_DEFENDANT_ACCOUNT_NOTE_MOCK);
  });

  it('should GET the defendant account notes', () => {
    const defendantAccountId = 123;
    const apiUrl = `${OPAL_FINES_PATHS.defendantAccountNotes}/${defendantAccountId}`;

    service.getDefendantAccountNotes(defendantAccountId).subscribe((defendantAccountNotes) => {
      expect(defendantAccountNotes).toEqual(OPAL_FINES_DEFENDANT_ACCOUNT_NOTES_MOCK);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(OPAL_FINES_DEFENDANT_ACCOUNT_NOTES_MOCK);
  });

  it('should GET the defendant account details', () => {
    const defendantAccountId = 123;
    const apiUrl = `${OPAL_FINES_PATHS.defendantAccount}/${defendantAccountId}`;

    service.getDefendantAccountDetails(defendantAccountId).subscribe((defendantAccountDetails) => {
      expect(defendantAccountDetails).toEqual(OPAL_FINES_DEFENDANT_ACCOUNT_DETAILS_MOCK);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(OPAL_FINES_DEFENDANT_ACCOUNT_DETAILS_MOCK);
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

  it('should send a GET request to draft accounts API with correct query parameters', () => {
    const filters = OPAL_FINES_DRAFT_ACCOUNT_PARAMS_MOCK;

    const expectedResponse = OPAL_FINES_DRAFT_ACCOUNTS_MOCK;

    service.getDraftAccounts(filters).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne((request) => {
      // Validate the URL and query parameters
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
  });

  it('should GET the draft account by id', () => {
    const draftAccountId = 123;
    const apiUrl = `${OPAL_FINES_PATHS.draftAccounts}/${draftAccountId}`;

    service.getDraftAccountById(draftAccountId).subscribe((draftAccount) => {
      expect(draftAccount).toEqual(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
  });

  it('should GET the business unit by id', () => {
    const businessUnitId = 123;
    const apiUrl = `${OPAL_FINES_PATHS.businessUnitRefData}/${businessUnitId}`;

    service.getBusinessUnitById(businessUnitId).subscribe((businessUnit) => {
      expect(businessUnit).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
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
});
