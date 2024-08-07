import { TestBed } from '@angular/core/testing';

import { OpalFines } from './opal-fines.service';
import { OPAL_FINES_SERVICE_PATHS } from '../constants';
import { IFinesBusinessUnitRefData } from '../interfaces';
import { HttpTestingController } from '@angular/common/http/testing';

describe('OpalFines', () => {
  let service: OpalFines;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({});
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
    const mockBusinessUnits: IFinesBusinessUnitRefData = BUSINESS_UNIT_REF_DATA_MOCK;
    const expectedUrl = `${OPAL_FINES_SERVICE_PATHS.businessUnitRefData}?permission=${permission}`;

    service.getBusinessUnits(permission).subscribe((response) => {
      expect(response).toEqual(mockBusinessUnits);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockBusinessUnits);
  });

  it('should return cached response for the same ref data search', () => {
    const permission = 'ACCOUNT_ENQUIRY';
    const mockBusinessUnits: IBusinessUnitRefData = BUSINESS_UNIT_REF_DATA_MOCK;
    const expectedUrl = `${API_PATHS.businessUnitRefData}?permission=${permission}`;

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
});
