import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScotgovDatePickerComponent } from './scotgov-date-picker.component';

describe('ScotgovDatePickerComponent', () => {
  let component: ScotgovDatePickerComponent;
  let fixture: ComponentFixture<ScotgovDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScotgovDatePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScotgovDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
