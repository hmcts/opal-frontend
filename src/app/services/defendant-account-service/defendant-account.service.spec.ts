import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DefendantAccountService } from './defendant-account.service';

describe('DefendantAccountService', () => {
  let service: DefendantAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(DefendantAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET the defendant account', () => {});
});
