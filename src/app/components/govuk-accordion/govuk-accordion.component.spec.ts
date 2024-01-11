import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukAccordionComponent } from './govuk-accordion.component';
import { addGdsBodyClass } from '../utils/add-gds-body-class';

describe('GovukAccordionComponent', () => {
  let component: GovukAccordionComponent;
  let fixture: ComponentFixture<GovukAccordionComponent>;

  // We need to add the govuk-frontend-supported class to the body element as per govuk-frontend v5
  addGdsBodyClass();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GovukAccordionComponent],
    });

    fixture = TestBed.createComponent(GovukAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
