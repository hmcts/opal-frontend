import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukSummaryListRowComponent } from './govuk-summary-list-row.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-govuk-summary-list-row summaryListId="test" summaryListRowId="rowTest" [actionEnabled]="action"
    ><ng-container name>Tim</ng-container>
    <ng-container value><p class="govuk-body">Hello</p></ng-container>
    <ng-container action>Change<span class="govuk-visually-hidden"> name</span></ng-container>
  </app-govuk-summary-list-row>`,
})
class TestHostComponent {
  action = false;
}

describe('GovukSummaryListRowComponent', () => {
  let component: TestHostComponent;
  let componentGSLRC: GovukSummaryListRowComponent;

  let fixture: ComponentFixture<TestHostComponent>;
  let fixtureGSLRC: ComponentFixture<GovukSummaryListRowComponent>;

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render into the name ng-content', () => {
    const element = fixture.nativeElement.querySelector('#testRowTestKey');

    expect(element.innerText).toBe('Tim');
  });

  it('should render into the value ng-content', () => {
    const element = fixture.nativeElement.querySelector('#testRowTestValue > .govuk-body');

    expect(element.innerText).toBe('Hello');
  });

  it('should not render into the action ng-content', () => {
    const element = fixture.nativeElement.querySelector('#testRowTestActions');

    expect(element).toBeFalsy();
  });

  it('should render into the action ng-content', () => {
    component.action = true;
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('#testRowTestActions .govuk-link');

    expect(element.innerText).toBe('Change name');
  });

  it('should emit actionClick event when handleActionClick is called', () => {
    const event = new Event('click');
    spyOn(componentGSLRC.actionClick, 'emit');

    componentGSLRC.handleActionClick(event);

    expect(componentGSLRC.actionClick.emit).toHaveBeenCalledWith(true);
  });

  it('should prevent default behavior and stop event propagation when handleActionClick is called', () => {
    const event = new Event('click');
    spyOn(event, 'preventDefault');
    spyOn(event, 'stopPropagation');

    componentGSLRC.handleActionClick(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });
});
