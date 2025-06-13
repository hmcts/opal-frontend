import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDetailsComponent } from './fines-acc-details.component';

describe('FinesAccDetailsComponent', () => {
  let component: FinesAccDetailsComponent;
  let fixture: ComponentFixture<FinesAccDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
