import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukSummaryListRowComponent } from './govuk-summary-list-row.component';
import { Component } from '@angular/core';

@Component({
  template: `<div app-govuk-summary-list-row summaryListId="test" summaryListRowId="rowTest" [actionEnabled]="action">
    <ng-container name>Tim</ng-container>
    <ng-container value><p class="govuk-body">Hello</p></ng-container>
    <ng-container action>Change<span class="govuk-visually-hidden"> name</span></ng-container>
  </div>`,
  standalone: false,
})
class TestHostComponent {
  action = false;
}

describe('GovukSummaryListRowComponent', () => {
  let component: TestHostComponent | null;
  let componentGSLRC: GovukSummaryListRowComponent | null;

  let fixture: ComponentFixture<TestHostComponent> | null;
  let fixtureGSLRC: ComponentFixture<GovukSummaryListRowComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukSummaryListRowComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixtureGSLRC = TestBed.createComponent(GovukSummaryListRowComponent);
    component = fixture.componentInstance;
    componentGSLRC = fixtureGSLRC.componentInstance;

    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;
    fixtureGSLRC = null;

    component = null;
    componentGSLRC = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render into the name ng-content', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('#testRowTestKey');

    expect(element.innerText).toBe('Tim');
  });

  it('should render into the value ng-content', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('#testRowTestValue > .govuk-body');

    expect(element.innerText).toBe('Hello');
  });

  it('should not render into the action ng-content', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }
    const element = fixture.nativeElement.querySelector('#testRowTestActions');

    expect(element).toBeFalsy();
  });

  it('should render into the action ng-content', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }
    component.action = true;
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('#testRowTestActions .govuk-link');

    expect(element.innerText).toBe('Change name');
  });

  it('should emit actionClick event when handleActionClick is called', () => {
    if (!componentGSLRC) {
      fail('componentGSLRC returned null');
      return;
    }
    const event = new Event('click');
    spyOn(componentGSLRC.actionClick, 'emit');

    componentGSLRC.handleActionClick(event);

    expect(componentGSLRC.actionClick.emit).toHaveBeenCalledWith(true);
  });

  it('should prevent default behavior when handleActionClick is called', () => {
    if (!componentGSLRC) {
      fail('componentGSLRC returned null');
      return;
    }
    const event = new Event('click');
    spyOn(event, 'preventDefault');

    componentGSLRC.handleActionClick(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should set the host values onInit', () => {
    if (!componentGSLRC || !fixtureGSLRC) {
      fail('componentGSLRC or fixtureGSLRCreturned null');
      return;
    }

    componentGSLRC.summaryListId = 'test';
    componentGSLRC.summaryListRowId = 'rowTest';

    fixtureGSLRC.detectChanges();

    componentGSLRC.ngOnInit();

    expect(componentGSLRC.id).toBe('testRowTest');
    expect(componentGSLRC.class).toBe('govuk-summary-list__row');
  });
});
