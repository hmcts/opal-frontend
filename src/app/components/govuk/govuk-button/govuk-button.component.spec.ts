import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukButtonComponent } from './govuk-button.component';

describe('GovukButtonComponent', () => {
  let component: GovukButtonComponent | null;
  let fixture: ComponentFixture<GovukButtonComponent> | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GovukButtonComponent],
    });
    fixture = TestBed.createComponent(GovukButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;
    component = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle the button click', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    spyOn(component.buttonClickEvent, 'emit');

    component.handleButtonClick();

    fixture.detectChanges();

    expect(component.buttonClickEvent.emit).toHaveBeenCalledWith(true);
  });
});
