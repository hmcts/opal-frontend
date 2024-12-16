import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovukPanelComponent } from './govuk-panel.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `<app-govuk-panel panelTitle="Test Title"><div>This is a test</div></app-govuk-panel>`,
})
class TestHostComponent {}

describe('GovukPanelComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukPanelComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render panel title - Test Title', () => {
    const element = fixture.debugElement.query(By.css('.govuk-panel__title'));
    expect(element.nativeElement.textContent).toContain('Test Title');
  });

  it('should render panel body text - This is a test', () => {
    const element = fixture.debugElement.query(By.css('.govuk-panel__body'));
    expect(element.nativeElement.textContent).toContain('This is a test');
  });
});
