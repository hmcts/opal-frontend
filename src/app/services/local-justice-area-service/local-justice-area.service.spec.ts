import { TestBed } from '@angular/core/testing';

import { LocalJusticeAreaService } from './local-justice-area.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ILocalJusticeAreaRefData } from '@interfaces';
import { LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '@mocks';
import { API_PATHS } from '@constants';

describe('LocalJusticeAreaServiceService', () => {
  let service: LocalJusticeAreaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [LocalJusticeAreaService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(LocalJusticeAreaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a GET request to court ref data API', () => {
    const mockLocalJusticeArea: ILocalJusticeAreaRefData = LOCAL_JUSTICE_AREA_REF_DATA_MOCK;
    const expectedUrl = `${API_PATHS.localJusticeAreaRefData}`;

    service.getLocalJusticeAreas().subscribe((response) => {
      expect(response).toEqual(mockLocalJusticeArea);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockLocalJusticeArea);
  });

  it('should return cached response for the same ref data search', () => {
    const mockLocalJusticeArea: ILocalJusticeAreaRefData = LOCAL_JUSTICE_AREA_REF_DATA_MOCK;
    const expectedUrl = `${API_PATHS.localJusticeAreaRefData}`;

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
