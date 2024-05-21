import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukRadioNewComponent } from './govuk-radio-new.component';

describe('GovukRadioNewComponent', () => {
  let component: GovukRadioNewComponent;
  let fixture: ComponentFixture<GovukRadioNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukRadioNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GovukRadioNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
