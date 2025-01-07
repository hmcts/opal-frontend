import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovukPanelComponent } from './govuk-panel.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `<app-govuk-panel panelTitle="Test Title"><p>This is a test</p></app-govuk-panel>`,
})
class TestHostComponent {}

describe('GovukPanelComponent', () => {
  let component: TestHostComponent | null;
  let fixture: ComponentFixture<TestHostComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukPanelComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
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

  it('should render panel title - Test Title', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.debugElement.query(By.css('.govuk-panel__title'));
    expect(element.nativeElement.textContent).toContain('Test Title');
  });

  it('should render panel body text - This is a test', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.debugElement.query(By.css('.govuk-panel__body'));
    expect(element.nativeElement.textContent).toContain('This is a test');
  });
});
