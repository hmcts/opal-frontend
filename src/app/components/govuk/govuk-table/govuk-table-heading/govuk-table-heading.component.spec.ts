import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GovukTableHeadingComponent } from './govuk-table-heading.component';
import { Component } from '@angular/core';

@Component({
  template: `<th app-govuk-table-heading>Test Column</th>`,
})
class TestWrapperComponent {}

describe('GovukTableHeadingComponent', () => {
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTableHeadingComponent],
      declarations: [TestWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestWrapperComponent);
    fixture.detectChanges();
  });

  it('should have the scope attribute set to "col"', () => {
    const thElement = fixture.debugElement.query(By.css('th'));
    expect(thElement.attributes['scope']).toBe('col');
  });

  it('should have the correct host class', () => {
    const thElement = fixture.debugElement.query(By.css('th'));
    expect(thElement.nativeElement.classList.contains('govuk-table__header')).toBe(true);
  });
});
