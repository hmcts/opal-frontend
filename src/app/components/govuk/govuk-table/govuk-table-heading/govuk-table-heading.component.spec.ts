import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GovukTableHeadingComponent } from './govuk-table-heading.component';
import { Component } from '@angular/core';

@Component({
  template: `<th app-govuk-table-heading>Test Column</th>`,
})
class TestWrapperComponent {}

describe('GovukTableHeadingComponent', () => {
  let fixture: ComponentFixture<TestWrapperComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTableHeadingComponent],
      declarations: [TestWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestWrapperComponent);
    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;

    TestBed.resetTestingModule();
  });

  it('should have the scope attribute set to "col"', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const thElement = fixture.debugElement.query(By.css('th'));
    expect(thElement.attributes['scope']).toBe('col');
  });

  it('should have the correct host class', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const thElement = fixture.debugElement.query(By.css('th'));
    expect(thElement.nativeElement.classList.contains('govuk-table__header')).toBe(true);
  });
});
