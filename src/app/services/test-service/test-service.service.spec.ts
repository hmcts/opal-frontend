import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestServiceService } from './test-service.service';

describe('TestServiceService', () => {
  let service: TestServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(TestServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
