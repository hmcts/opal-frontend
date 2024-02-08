import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DefendantAccountService } from './defendant-account.service';
import { IAddDefendantAccountNoteBody, IGetDefendantAccountParams, ISearchDefendantAccountBody } from '@interfaces';
import {
  ADD_DEFENDANT_ACCOUNT_NOTE_BODY_MOCK,
  DEFENDANT_ACCOUNT_MOCK,
  DEFENDANT_ACCOUNT_NOTES_MOCK,
  DEFENDANT_ACCOUNT_NOTE_MOCK,
  SEARCH_DEFENDANT_ACCOUNTS_MOCK,
} from '@mocks';
import { ApiPaths } from '@enums';

describe('DefendantAccountService', () => {
  let service: DefendantAccountService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [DefendantAccountService] });
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
    const apiUrl = `${ApiPaths.defendantAccount}?businessUnitId=${params.businessUnitId}&accountNumber=${params.accountNumber}`;

    service.getDefendantAccount(params).subscribe((defendantAccount) => {
      expect(defendantAccount).toEqual(DEFENDANT_ACCOUNT_MOCK);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(DEFENDANT_ACCOUNT_MOCK);
  });

  it('should RETURN the defendant account search', () => {
    const body: ISearchDefendantAccountBody = {
      court: 'Bath',
      surname: 'Test',
      forename: 'Test',
      initials: 'TT',
      dateOfBirth: {
        dayOfMonth: '12',
        monthOfYear: '12',
        year: '1981',
      },
      addressLineOne: 'Test',
      niNumber: 'TT1234',
      pcr: '1234',
    };
    const apiUrl = ApiPaths.defendantAccountSearch;

    service.searchDefendantAccounts(body).subscribe((searchDefendantAccounts) => {
      expect(searchDefendantAccounts).toEqual(SEARCH_DEFENDANT_ACCOUNTS_MOCK);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    req.flush(SEARCH_DEFENDANT_ACCOUNTS_MOCK);
  });

  it('should POST the defendant account note', () => {
    const body: IAddDefendantAccountNoteBody = ADD_DEFENDANT_ACCOUNT_NOTE_BODY_MOCK;

    const apiUrl = ApiPaths.defendantAccountAddNote;

    service.addDefendantAccountNote(body).subscribe((defendantAccountNote) => {
      expect(defendantAccountNote).toEqual(DEFENDANT_ACCOUNT_NOTE_MOCK);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    req.flush(DEFENDANT_ACCOUNT_NOTE_MOCK);
  });

  it('should GET the defendant account notes', () => {
    const defendantAccountId = 123;
    const apiUrl = `${ApiPaths.defendantAccountNotes}/${defendantAccountId}`;

    service.getDefendantAccountNotes(defendantAccountId).subscribe((defendantAccountNotes) => {
      expect(defendantAccountNotes).toEqual(DEFENDANT_ACCOUNT_NOTES_MOCK);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(DEFENDANT_ACCOUNT_NOTES_MOCK);
  });
});
