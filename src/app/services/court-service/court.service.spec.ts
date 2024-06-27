import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CourtService } from './court.service';
import { ISearchCourt, ISearchCourtBody } from '@interfaces';
import { SEARCH_COURT_BODY_MOCK, SEARCH_COURT_MOCK } from '@mocks';
import { API_PATHS } from '@constants';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CourtService', () => {
  let service: CourtService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [CourtService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(CourtService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to court search API', () => {
    const searchBody: ISearchCourtBody = SEARCH_COURT_BODY_MOCK;
    const expectedResponse: ISearchCourt[] = SEARCH_COURT_MOCK;

    service.searchCourt(searchBody).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(API_PATHS.courtSearch);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(searchBody);
    req.flush(expectedResponse);
  });

  it('should return cached response for the same court search', () => {
    const searchBody: ISearchCourtBody = SEARCH_COURT_BODY_MOCK;
    const expectedResponse: ISearchCourt[] = SEARCH_COURT_MOCK;

    service.searchCourt(searchBody).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(API_PATHS.courtSearch);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(searchBody);
    req.flush(expectedResponse);

    // Make a second call to searchCourt with the same search body
    service.searchCourt(searchBody).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    // No new request should be made since the response is cached
    httpMock.expectNone(API_PATHS.courtSearch);
  });
});
