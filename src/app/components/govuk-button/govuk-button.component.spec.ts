import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukButtonComponent } from './govuk-button.component';

describe('GovukButtonComponent', () => {
  let component: GovukButtonComponent;
  let fixture: ComponentFixture<GovukButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GovukButtonComponent]
    });
    fixture = TestBed.createComponent(GovukButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
