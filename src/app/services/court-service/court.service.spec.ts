import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CourtService } from './court.service';
import { ISearchCourt, ISearchCourtBody } from '@interfaces';
import { ApiPaths } from '@enums';
import { SEARCH_COURT_BODY_MOCK, SEARCH_COURT_MOCK } from '@mocks';

describe('CourtService', () => {
  let service: CourtService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CourtService],
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

    const req = httpMock.expectOne(ApiPaths.courtSearch);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(searchBody);
    req.flush(expectedResponse);
  });
});
