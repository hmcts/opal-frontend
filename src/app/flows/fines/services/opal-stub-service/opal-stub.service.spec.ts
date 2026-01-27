import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OpalStubService } from './opal-stub.service';

describe('OpalStubService', () => {
  let service: OpalStubService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpalStubService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(OpalStubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should post to opal with actionType and parse XML to JSON', () => {
    service
      .postLegacyOpal(
        'searchDefendantAccounts',
        { defendant: { postcode: 'AB1 2CD' } },
        {
          accept: 'application/xml',
          parseXmlToJson: true,
        },
      )
      .subscribe((result) => {
        expect(result).toEqual({ response: { count: '1' } });
      });

    const req = httpMock.expectOne(
      (request) =>
        request.url === '/opal-legacy-db-stub/opal' &&
        request.params.get('actionType') === 'searchDefendantAccounts',
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ defendant: { postcode: 'AB1 2CD' } });
    expect(req.request.headers.get('Accept')).toBe('application/xml');
    expect(req.request.responseType).toBe('text');

    req.flush('<response><count>1</count></response>');
  });

  it('should get from opal with actionType and parse XML to JSON', () => {
    service
      .getLegacyOpal('searchDefendantAccounts', {
        accept: 'application/xml',
        parseXmlToJson: true,
      })
      .subscribe((result) => {
        expect(result).toEqual({ response: { count: '1' } });
      });

    const req = httpMock.expectOne(
      (request) =>
        request.url === '/opal-legacy-db-stub/opal' &&
        request.params.get('actionType') === 'searchDefendantAccounts',
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Accept')).toBe('application/xml');
    expect(req.request.responseType).toBe('text');

    req.flush('<response><count>1</count></response>');
  });

  it('should put to opal with actionType and parse XML to JSON', () => {
    service
      .putLegacyOpal(
        'searchDefendantAccounts',
        { defendant: { postcode: 'AB1 2CD' } },
        {
          accept: 'application/xml',
          parseXmlToJson: true,
        },
      )
      .subscribe((result) => {
        expect(result).toEqual({ response: { count: '1' } });
      });

    const req = httpMock.expectOne(
      (request) =>
        request.url === '/opal-legacy-db-stub/opal' &&
        request.params.get('actionType') === 'searchDefendantAccounts',
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ defendant: { postcode: 'AB1 2CD' } });
    expect(req.request.headers.get('Accept')).toBe('application/xml');
    expect(req.request.responseType).toBe('text');

    req.flush('<response><count>1</count></response>');
  });

  it('should delete from opal with actionType and parse XML to JSON', () => {
    service
      .deleteLegacyOpal('searchDefendantAccounts', {
        accept: 'application/xml',
        parseXmlToJson: true,
      })
      .subscribe((result) => {
        expect(result).toEqual({ response: { count: '1' } });
      });

    const req = httpMock.expectOne(
      (request) =>
        request.url === '/opal-legacy-db-stub/opal' &&
        request.params.get('actionType') === 'searchDefendantAccounts',
    );
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Accept')).toBe('application/xml');
    expect(req.request.responseType).toBe('text');

    req.flush('<response><count>1</count></response>');
  });
});
