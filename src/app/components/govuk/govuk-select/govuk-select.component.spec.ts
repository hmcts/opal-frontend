import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukSelectComponent } from './govuk-select.component';
import { By } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { GOVUK_SELECT_OPTIONS_MOCK } from './mocks';

describe('GovukSelectComponent', () => {
  let component: GovukSelectComponent | null;
  let fixture: ComponentFixture<GovukSelectComponent> | null;
  let formControl: FormControl | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukSelectComponent);
    component = fixture.componentInstance;
    formControl = new FormControl(null);

    component.control = formControl;
    component.options = GOVUK_SELECT_OPTIONS_MOCK;
    component.labelText = 'Court';
    component.labelClasses = 'ct-list';
    component.selectId = 'court';
    component.selectName = 'court';
    component.selectHint = 'hint hint';
    component.selectClasses = 'extra-class';

    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;
    component = null;
    formControl = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have label text and an extra class', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const elem = fixture.debugElement.query(By.css('.ct-list')).nativeElement;
    expect(elem.textContent).toContain('Court');
  });

  it('should have a select extra class', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const elem = fixture.debugElement.query(By.css('#court.extra-class')).nativeElement;
    expect(elem).toBeTruthy();
  });

  it('should have select hint', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const elem = fixture.debugElement.query(By.css('#courtHint')).nativeElement;
    expect(elem.textContent).toContain('hint hint');
  });

  it('should have populated the select', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const select: HTMLSelectElement = fixture.debugElement.query(By.css('#court')).nativeElement;
    select.value = select.options[3].value; // <-- select a new value
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#court')).nativeElement.value).toBe(GOVUK_SELECT_OPTIONS_MOCK[2].value);
  });
});
