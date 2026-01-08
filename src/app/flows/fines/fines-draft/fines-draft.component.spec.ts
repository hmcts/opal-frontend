import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesDraftComponent } from './fines-draft.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';

describe('FinesDraftComponent', () => {
  let component: FinesDraftComponent;
  let fixture: ComponentFixture<FinesDraftComponent>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;

  beforeEach(async () => {
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['clearDraftAccountsCache']);

    await TestBed.configureTestingModule({
      imports: [FinesDraftComponent],
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
