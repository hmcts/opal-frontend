import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukCheckboxesConditionalComponent } from './govuk-checkboxes-conditional.component';

describe('GovukCheckboxesConditionalComponent', () => {
  let component: GovukCheckboxesConditionalComponent;
  let fixture: ComponentFixture<GovukCheckboxesConditionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukCheckboxesConditionalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GovukCheckboxesConditionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
