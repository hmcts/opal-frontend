import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTabPanelComponent } from './govuk-tab-panel.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-govuk-tab-panel tabsId="testOne" tabsPanelId="testTwo">Hello World</app-govuk-tab-panel>`,
})
class TestHostComponent {}
describe('GovukTabPanelComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTabPanelComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render into list ng-content', () => {
    const element = fixture.nativeElement.querySelector('#testOneTestTwo');
    expect(element.innerText).toBe('Hello World');
  });
});
