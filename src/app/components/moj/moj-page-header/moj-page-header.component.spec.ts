import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojPageHeaderComponent } from './moj-page-header.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `<app-moj-page-header title="Documents">
    <ng-content buttons>
      <button
        type="submit"
        class="govuk-button moj-button-menu__item govuk-button--secondary moj-page-header-actions__action"
        data-module="govuk-button"
      >
        Upload new
      </button>

      <button
        type="submit"
        class="govuk-button moj-button-menu__item govuk-button--secondary moj-page-header-actions__action"
        data-module="govuk-button"
      >
        Share collection
      </button>
    </ng-content>
  </app-moj-page-header>`,
  imports: [MojPageHeaderComponent],
})
class TestHostComponent {}

describe('MojPageHeaderComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render Documents header', () => {
    const element = fixture.debugElement.query(By.css('.govuk-heading-xl')).nativeElement;
    expect(element.textContent).toContain('Documents');
  });

  it('should contain two buttons with the specified classes', () => {
    const buttons = fixture.debugElement.queryAll(
      By.css('.govuk-button.moj-button-menu__item.govuk-button--secondary.moj-page-header-actions__action'),
    );

    expect(buttons.length).toBe(2);
  });
});
