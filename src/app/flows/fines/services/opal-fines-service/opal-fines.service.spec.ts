import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  IOpalFinesAddDefendantAccountNoteBody,
  IOpalFinesBusinessUnit,
  IOpalFinesBusinessUnitRefData,
  IOpalFinesCourtRefData,
  IOpalFinesGetDefendantAccountParams,
  IOpalFinesLocalJusticeAreaRefData,
  IOpalFinesSearchCourt,
  IOpalFinesSearchCourtBody,
  IOpalFinesSearchDefendantAccountBody,
} from '@interfaces/fines';
import {
  OPAL_FINES_ADD_DEFENDANT_ACCOUNT_NOTE_BODY_MOCK,
  OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
  OPAL_FINES_COURT_REF_DATA_MOCK,
  OPAL_FINES_DEFENDANT_ACCOUNT_DETAILS_MOCK,
  OPAL_FINES_DEFENDANT_ACCOUNT_MOCK,
  OPAL_FINES_DEFENDANT_ACCOUNT_NOTES_MOCK,
  OPAL_FINES_DEFENDANT_ACCOUNT_NOTE_MOCK,
  OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
  OPAL_FINES_SEARCH_COURT_BODY_MOCK,
  OPAL_FINES_SEARCH_COURT_MOCK,
  OPAL_FINES_SEARCH_DEFENDANT_ACCOUNTS_MOCK,
} from '../opal-fines-service/mocks';
import { OPAL_FINES_PATHS } from './constants';
import { OpalFines } from '@services/fines';

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
    const mockBusinessUnits: IOpalFinesBusinessUnitRefData = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK;
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
    const mockBusinessUnits: IOpalFinesBusinessUnitRefData = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK;
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
    const businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0] as IOpalFinesBusinessUnit;
    const expectedValue = 'Item1';

    const result = service.getConfigurationItemValue(businessUnit, expectedValue);

    expect(result).toEqual(expectedValue);
  });

  it('should return null if the configuration item name is not found', () => {
    const businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[1] as IOpalFinesBusinessUnit;
    const itemName = 'Item0';

    const result = service.getConfigurationItemValue(businessUnit, itemName);

    expect(result).toBeNull();
  });
});
