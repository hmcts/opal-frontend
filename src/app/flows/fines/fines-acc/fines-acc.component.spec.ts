import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccComponent } from './fines-acc.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';

describe('FinesAccComponent', () => {
  let component: FinesAccComponent;
  let fixture: ComponentFixture<FinesAccComponent>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;

  beforeEach(async () => {
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['clearAccountDetailsCache']);

    await TestBed.configureTestingModule({
      imports: [FinesAccComponent],
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
