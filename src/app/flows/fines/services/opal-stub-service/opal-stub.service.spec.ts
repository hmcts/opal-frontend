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
        request.url === '/opal-legacy-db-stub/opal' && request.params.get('actionType') === 'searchDefendantAccounts',
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
        request.url === '/opal-legacy-db-stub/opal' && request.params.get('actionType') === 'searchDefendantAccounts',
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
        request.url === '/opal-legacy-db-stub/opal' && request.params.get('actionType') === 'searchDefendantAccounts',
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
        request.url === '/opal-legacy-db-stub/opal' && request.params.get('actionType') === 'searchDefendantAccounts',
    );
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Accept')).toBe('application/xml');
    expect(req.request.responseType).toBe('text');

    req.flush('<response><count>1</count></response>');
  });

  it('should default Accept header to application/xml when parsing XML without explicit accept', () => {
    service
      .getLegacyOpal('searchDefendantAccounts', {
        parseXmlToJson: true,
      })
      .subscribe((result) => {
        expect(result).toEqual({ response: { count: '1' } });
      });

    const req = httpMock.expectOne(
      (request) =>
        request.url === '/opal-legacy-db-stub/opal' && request.params.get('actionType') === 'searchDefendantAccounts',
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Accept')).toBe('application/xml');
    expect(req.request.responseType).toBe('text');

    req.flush('<response><count>1</count></response>');
  });

  it('should not set Accept header when no accept provided and parsing disabled', () => {
    service.getLegacyOpal('searchDefendantAccounts').subscribe((result) => {
      expect(result).toBe('<response />');
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url === '/opal-legacy-db-stub/opal' && request.params.get('actionType') === 'searchDefendantAccounts',
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Accept')).toBeFalse();
    expect(req.request.responseType).toBe('text');

    req.flush('<response />');
  });

  it('should request JSON response when responseType is json', () => {
    const response = { count: 1 };

    service.getLegacyOpal('searchDefendantAccounts', { responseType: 'json' }).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url === '/opal-legacy-db-stub/opal' && request.params.get('actionType') === 'searchDefendantAccounts',
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('json');

    req.flush(response);
  });

  it('should request text response when responseType is text', () => {
    service.getLegacyOpal('searchDefendantAccounts', { responseType: 'text' }).subscribe((result) => {
      expect(result).toBe('<response />');
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url === '/opal-legacy-db-stub/opal' && request.params.get('actionType') === 'searchDefendantAccounts',
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('text');

    req.flush('<response />');
  });

  it('should post with default options when none are provided', () => {
    service.postLegacyOpal('searchDefendantAccounts', { defendant: { postcode: 'AB1 2CD' } }).subscribe((result) => {
      expect(result).toBe('<response />');
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url === '/opal-legacy-db-stub/opal' && request.params.get('actionType') === 'searchDefendantAccounts',
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ defendant: { postcode: 'AB1 2CD' } });
    expect(req.request.headers.has('Accept')).toBeFalse();
    expect(req.request.responseType).toBe('text');

    req.flush('<response />');
  });

  it('should put with default options when none are provided', () => {
    service.putLegacyOpal('searchDefendantAccounts', { defendant: { postcode: 'AB1 2CD' } }).subscribe((result) => {
      expect(result).toBe('<response />');
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url === '/opal-legacy-db-stub/opal' && request.params.get('actionType') === 'searchDefendantAccounts',
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ defendant: { postcode: 'AB1 2CD' } });
    expect(req.request.headers.has('Accept')).toBeFalse();
    expect(req.request.responseType).toBe('text');

    req.flush('<response />');
  });

  it('should delete with default options when none are provided', () => {
    service.deleteLegacyOpal('searchDefendantAccounts').subscribe((result) => {
      expect(result).toBe('<response />');
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url === '/opal-legacy-db-stub/opal' && request.params.get('actionType') === 'searchDefendantAccounts',
    );
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.has('Accept')).toBeFalse();
    expect(req.request.responseType).toBe('text');

    req.flush('<response />');
  });
});
