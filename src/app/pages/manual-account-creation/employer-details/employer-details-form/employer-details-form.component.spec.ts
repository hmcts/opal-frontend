import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerDetailsFormComponent } from './employer-details-form.component';

describe('EmployerDetailsFormComponent', () => {
  let component: EmployerDetailsFormComponent;
  let fixture: ComponentFixture<EmployerDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerDetailsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployerDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
