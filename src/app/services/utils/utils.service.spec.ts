import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should capitalise the first letter of a string', () => {
    const str = 'hello';
    const result = service.upperCaseFirstLetter(str);
    expect(result).toEqual('Hello');
  });
});
