import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

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
import { IFinesMacAddAccountPayload } from '../../fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';
import { OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK } from './mocks/opal-fines-draft-add-account-payload.mock';

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
});
