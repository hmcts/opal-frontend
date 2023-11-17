import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DefendantAccountService } from './defendant-account.service';
import { IGetDefendantAccountParams } from '@interfaces';
import { defendantAccountMock } from '@mocks';

describe('DefendantAccountService', () => {
  let service: DefendantAccountService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(DefendantAccountService);

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET the defendant account', () => {
    const params: IGetDefendantAccountParams = {
      businessUnitId: 1,
      accountNumber: '1212',
    };
    const apiUrl = `/api/defendant-account?businessUnitId=${params.businessUnitId}&accountNumber=${params.accountNumber}`;

    service.getDefendantAccount(params).subscribe((defendantAccount) => {
      expect(defendantAccount).toEqual(defendantAccountMock);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(defendantAccountMock);
  });
});
