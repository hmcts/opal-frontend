import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukButtonComponent } from './govuk-button.component';
import { GovukButtonClasses } from '@enums';

describe('GovukButtonComponent', () => {
  let component: GovukButtonComponent;
  let fixture: ComponentFixture<GovukButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GovukButtonComponent],
    });
    fixture = TestBed.createComponent(GovukButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the warning class', () => {
    component.buttonStyle = 'warning';
    fixture.detectChanges();

    expect(component.buttonClassSig()).toBe(
      `${GovukButtonClasses.default} ${GovukButtonClasses.warning} govuk-!-margin-bottom-0`,
    );
  });

  it('should have the default class', () => {
    component.buttonStyle = 'default';
    fixture.detectChanges();

    expect(component.buttonClassSig()).toBe(`${GovukButtonClasses.default} govuk-!-margin-bottom-0`);
  });

  it('should have the secondary class', () => {
    component.buttonStyle = 'secondary';
    fixture.detectChanges();

    expect(component.buttonClassSig()).toBe(
      `${GovukButtonClasses.default} ${GovukButtonClasses.secondary} govuk-!-margin-bottom-0`,
    );
  });

  it('should have the inverse class', () => {
    component.buttonStyle = 'inverse';
    fixture.detectChanges();

    expect(component.buttonClassSig()).toBe(
      `${GovukButtonClasses.default} ${GovukButtonClasses.inverse} govuk-!-margin-bottom-0`,
    );
  });

  it('should have the start class', () => {
    component.buttonStyle = 'start';
    fixture.detectChanges();

    expect(component.buttonClassSig()).toBe(
      `${GovukButtonClasses.default} ${GovukButtonClasses.start} govuk-!-margin-bottom-0`,
    );
  });

  it('should have the disabled class', () => {
    component.buttonStyle = 'disabled';
    fixture.detectChanges();

    expect(component.buttonClassSig()).toBe(
      `${GovukButtonClasses.default} ${GovukButtonClasses.disabled} govuk-!-margin-bottom-0`,
    );
  });

  it('should handle the button click', () => {
    spyOn(component.buttonClickEvent, 'emit');

    component.handleButtonClick();

    fixture.detectChanges();

    expect(component.buttonClickEvent.emit).toHaveBeenCalledWith(true);
  });
});
