import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukRadiosConditionalComponent } from './govuk-radios-conditional.component';

describe('GovukRadiosConditionalComponent', () => {
  let component: GovukRadiosConditionalComponent;
  let fixture: ComponentFixture<GovukRadiosConditionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukRadiosConditionalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GovukRadiosConditionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
