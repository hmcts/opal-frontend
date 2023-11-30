import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTextInputComponent } from './govuk-text-input.component';

describe('GovukTextInputComponent', () => {
  let component: GovukTextInputComponent;
  let fixture: ComponentFixture<GovukTextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTextInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GovukTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
