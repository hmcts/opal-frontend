// import { TestBed } from '@angular/core/testing';

import { OpalFines } from './opal-fines.service';
import { OPAL_FINES_PATHS } from '../constants';
import {
  IFinesAddDefendantAccountNoteBody,
  IFinesBusinessUnitRefData,
  IFinesCourtRefData,
  IFinesGetDefendantAccountParams,
  IFinesLocalJusticeAreaRefData,
  IFinesSearchCourt,
  IFinesSearchCourtBody,
  IFinesSearchDefendantAccountBody,
} from '../interfaces';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import {
  FINES_BUSINESS_UNIT_REF_DATA_MOCK,
  FINES_SEARCH_COURT_BODY_MOCK,
  FINES_SEARCH_COURT_MOCK,
  FINES_COURT_REF_DATA_MOCK,
  FINES_DEFENDANT_ACCOUNT_MOCK,
  FINES_SEARCH_DEFENDANT_ACCOUNTS_MOCK,
  FINES_ADD_DEFENDANT_ACCOUNT_NOTE_BODY_MOCK,
  FINES_DEFENDANT_ACCOUNT_NOTE_MOCK,
  FINES_DEFENDANT_ACCOUNT_NOTES_MOCK,
  FINES_DEFENDANT_ACCOUNT_DETAILS_MOCK,
  FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
} from '../mocks';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// xdescribe('OpalFines', () => {
//   let service: OpalFines;
//   let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [OpalFines, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(OpalFines);
    httpMock = TestBed.inject(HttpTestingController);
  });

//   afterEach(() => {
//     httpMock.verify();
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

  it('should send a GET request to business unit ref data API', () => {
    const permission = 'ACCOUNT_ENQUIRY';
    const mockBusinessUnits: IFinesBusinessUnitRefData = FINES_BUSINESS_UNIT_REF_DATA_MOCK;
    const expectedUrl = `${OPAL_FINES_PATHS.businessUnitRefData}?permission=${permission}`;

//     service.getBusinessUnits(permission).subscribe((response) => {
//       expect(response).toEqual(mockBusinessUnits);
//     });

//     const req = httpMock.expectOne(expectedUrl);
//     expect(req.request.method).toBe('GET');

//     req.flush(mockBusinessUnits);
//   });

  it('should return cached response for the same ref data search', () => {
    const permission = 'ACCOUNT_ENQUIRY';
    const mockBusinessUnits: IFinesBusinessUnitRefData = FINES_BUSINESS_UNIT_REF_DATA_MOCK;
    const expectedUrl = `${OPAL_FINES_PATHS.businessUnitRefData}?permission=${permission}`;

//     service.getBusinessUnits(permission).subscribe((response) => {
//       expect(response).toEqual(mockBusinessUnits);
//     });

//     const req = httpMock.expectOne(expectedUrl);
//     expect(req.request.method).toBe('GET');

//     req.flush(mockBusinessUnits);

//     // Make a second call to searchCourt with the same search body
//     service.getBusinessUnits(permission).subscribe((response) => {
//       expect(response).toEqual(mockBusinessUnits);
//     });

    // No new request should be made since the response is cached
    httpMock.expectNone(expectedUrl);
  });

  it('should send a POST request to court search API', () => {
    const searchBody: IFinesSearchCourtBody = FINES_SEARCH_COURT_BODY_MOCK;
    const expectedResponse: IFinesSearchCourt[] = FINES_SEARCH_COURT_MOCK;

    service.searchCourt(searchBody).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(OPAL_FINES_PATHS.courtSearch);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(searchBody);
    req.flush(expectedResponse);
  });

  it('should return cached response for the same court search', () => {
    const searchBody: IFinesSearchCourtBody = FINES_SEARCH_COURT_BODY_MOCK;
    const expectedResponse: IFinesSearchCourt[] = FINES_SEARCH_COURT_MOCK;

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
    const mockCourts: IFinesCourtRefData = FINES_COURT_REF_DATA_MOCK;
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
    const mockCourts: IFinesCourtRefData = FINES_COURT_REF_DATA_MOCK;
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
    const params: IFinesGetDefendantAccountParams = {
      businessUnitId: 1,
      accountNumber: '1212',
    };
    const apiUrl = `${OPAL_FINES_PATHS.defendantAccount}?businessUnitId=${params.businessUnitId}&accountNumber=${params.accountNumber}`;

    service.getDefendantAccount(params).subscribe((defendantAccount) => {
      expect(defendantAccount).toEqual(FINES_DEFENDANT_ACCOUNT_MOCK);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(FINES_DEFENDANT_ACCOUNT_MOCK);
  });

  it('should RETURN the defendant account search', () => {
    const body: IFinesSearchDefendantAccountBody = {
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
      expect(searchDefendantAccounts).toEqual(FINES_SEARCH_DEFENDANT_ACCOUNTS_MOCK);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    req.flush(FINES_SEARCH_DEFENDANT_ACCOUNTS_MOCK);
  });

  it('should POST the defendant account note', () => {
    const body: IFinesAddDefendantAccountNoteBody = FINES_ADD_DEFENDANT_ACCOUNT_NOTE_BODY_MOCK;

    const apiUrl = OPAL_FINES_PATHS.defendantAccountAddNote;

    service.addDefendantAccountNote(body).subscribe((defendantAccountNote) => {
      expect(defendantAccountNote).toEqual(FINES_DEFENDANT_ACCOUNT_NOTE_MOCK);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    req.flush(FINES_DEFENDANT_ACCOUNT_NOTE_MOCK);
  });

  it('should GET the defendant account notes', () => {
    const defendantAccountId = 123;
    const apiUrl = `${OPAL_FINES_PATHS.defendantAccountNotes}/${defendantAccountId}`;

    service.getDefendantAccountNotes(defendantAccountId).subscribe((defendantAccountNotes) => {
      expect(defendantAccountNotes).toEqual(FINES_DEFENDANT_ACCOUNT_NOTES_MOCK);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(FINES_DEFENDANT_ACCOUNT_NOTES_MOCK);
  });

  it('should GET the defendant account details', () => {
    const defendantAccountId = 123;
    const apiUrl = `${OPAL_FINES_PATHS.defendantAccount}/${defendantAccountId}`;

    service.getDefendantAccountDetails(defendantAccountId).subscribe((defendantAccountDetails) => {
      expect(defendantAccountDetails).toEqual(FINES_DEFENDANT_ACCOUNT_DETAILS_MOCK);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(FINES_DEFENDANT_ACCOUNT_DETAILS_MOCK);
  });

  it('should send a GET request to court ref data API', () => {
    const mockLocalJusticeArea: IFinesLocalJusticeAreaRefData = FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK;
    const expectedUrl = `${OPAL_FINES_PATHS.localJusticeAreaRefData}`;

    service.getLocalJusticeAreas().subscribe((response) => {
      expect(response).toEqual(mockLocalJusticeArea);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockLocalJusticeArea);
  });

  it('should return cached response for the same ref data search', () => {
    const mockLocalJusticeArea: IFinesLocalJusticeAreaRefData = FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK;
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
});
