import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { IOpalFinesAddDefendantAccountNoteBody } from '@services/fines/opal-fines-service/interfaces/opal-fines-add-defendant-account-note-body.interface';
import { IOpalFinesCourtRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';
import { IOpalFinesGetDefendantAccountParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-get-defendant-account-params.interface';
import { IOpalFinesLocalJusticeAreaRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';
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
import { IOpalFinesResultsRefData } from './interfaces/opal-fines-results-ref-data.interface';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from './mocks/opal-fines-results-ref-data.mock';

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

  it('should send a GET request to offences ref data API', () => {
    const businessUnit = 1;
    const mockOffences: IOpalFinesOffencesRefData = OPAL_FINES_OFFENCES_REF_DATA_MOCK;
    const expectedUrl = `${OPAL_FINES_PATHS.offencesRefData}?businessUnit=${businessUnit}`;

    service.getOffences(businessUnit).subscribe((response) => {
      expect(response).toEqual(mockOffences);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockOffences);
  });

  it('should return cached response for the same ref data search', () => {
    const businessUnit = 1;
    const mockOffences: IOpalFinesOffencesRefData = OPAL_FINES_OFFENCES_REF_DATA_MOCK;
    const expectedUrl = `${OPAL_FINES_PATHS.offencesRefData}?businessUnit=${businessUnit}`;

    service.getOffences(businessUnit).subscribe((response) => {
      expect(response).toEqual(mockOffences);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockOffences);

    service.getOffences(businessUnit).subscribe((response) => {
      expect(response).toEqual(mockOffences);
    });

    httpMock.expectNone(expectedUrl);
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
});
