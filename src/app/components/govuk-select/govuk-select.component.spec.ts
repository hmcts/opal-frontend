import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukSelectComponent } from './govuk-select.component';
import { By } from '@angular/platform-browser';
import { CT_LIST_MOCK } from '@mocks';
import { FormControl } from '@angular/forms';

fdescribe('GovukSelectComponent', () => {
  let component: GovukSelectComponent;
  let fixture: ComponentFixture<GovukSelectComponent>;
  let formControl: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukSelectComponent);
    component = fixture.componentInstance;
    formControl = new FormControl(null);

    component.control = formControl;
    component.options = CT_LIST_MOCK;
    component.labelText = 'Court';
    component.labelClasses = 'ct-list';
    component.selectId = 'court';
    component.selectName = 'court';
    component.selectHint = 'hint hint';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have label text', () => {
    const elem = fixture.debugElement.query(By.css('.ct-list')).nativeElement;
    expect(elem.textContent).toContain('Court');
  });

  it('should have select hint', () => {
    const elem = fixture.debugElement.query(By.css('#courtHint')).nativeElement;
    expect(elem.textContent).toContain('hint hint');
  });

  it('should have populated the select', () => {
    const select: HTMLSelectElement = fixture.debugElement.query(By.css('#court')).nativeElement;
    select.value = select.options[3].value; // <-- select a new value
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#court')).nativeElement.value).toBe(CT_LIST_MOCK[2].value);
  });
});
