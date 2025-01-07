import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukAccordionComponent } from './govuk-accordion.component';
import { addGdsBodyClass } from '../helpers/add-gds-body-class';

describe('GovukAccordionComponent', () => {
  let component: GovukAccordionComponent;
  let fixture: ComponentFixture<GovukAccordionComponent>;

  beforeAll(addGdsBodyClass);
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GovukAccordionComponent],
    });

    fixture = TestBed.createComponent(GovukAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
