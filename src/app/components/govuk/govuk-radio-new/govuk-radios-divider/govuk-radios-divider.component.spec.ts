import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukRadiosDividerComponent } from './govuk-radios-divider.component';

describe('GovukRadiosDividerComponent', () => {
  let component: GovukRadiosDividerComponent;
  let fixture: ComponentFixture<GovukRadiosDividerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukRadiosDividerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GovukRadiosDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
