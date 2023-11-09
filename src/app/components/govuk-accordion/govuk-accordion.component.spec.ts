import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukAccordionComponent } from './govuk-accordion.component';

describe('GovukAccordionComponent', () => {
  let component: GovukAccordionComponent;
  let fixture: ComponentFixture<GovukAccordionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GovukAccordionComponent]
    });
    fixture = TestBed.createComponent(GovukAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
