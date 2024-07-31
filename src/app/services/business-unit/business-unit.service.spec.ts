import { TestBed } from '@angular/core/testing';

import { BusinessUnitService } from './business-unit.service';

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_PATHS } from '@constants';
import { IBusinessUnit, IBusinessUnitRefData } from '@interfaces';
import { BUSINESS_UNIT_REF_DATA_MOCK } from '@mocks';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('BusinessUnitService', () => {
  let service: BusinessUnitService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [BusinessUnitService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(BusinessUnitService);
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
    const mockBusinessUnits: IBusinessUnitRefData = BUSINESS_UNIT_REF_DATA_MOCK;
    const expectedUrl = `${API_PATHS.businessUnitRefData}?permission=${permission}`;

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

  it('should return the item value for a given configuration item name', () => {
    const businessUnit = BUSINESS_UNIT_REF_DATA_MOCK.refData[0] as IBusinessUnit;
    const expectedValue = 'Item1';

    const result = service.getConfigurationItemValue(businessUnit, expectedValue);

    expect(result).toEqual(expectedValue);
  });

  it('should return null if the configuration item name is not found', () => {
    const businessUnit = BUSINESS_UNIT_REF_DATA_MOCK.refData[1] as IBusinessUnit;
    const itemName = 'Item0';

    const result = service.getConfigurationItemValue(businessUnit, itemName);

    expect(result).toBeNull();
  });
});
