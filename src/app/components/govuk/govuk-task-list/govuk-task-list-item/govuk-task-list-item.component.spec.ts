import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTaskListItemComponent } from './govuk-task-list-item.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-govuk-task-list-item taskListItemId="test" taskListItemClasses="test-class">
    <ng-container name>Tim</ng-container>
    <ng-container status>Hello</ng-container></app-govuk-task-list-item
  >`,
  standalone: false,
})
class TestHostComponent {}
describe('GovukTaskListItemComponent', () => {
  let component: TestHostComponent | null;
  let fixture: ComponentFixture<TestHostComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTaskListItemComponent],
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

  it('should add the id', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('#test');

    expect(element).not.toBe(null);
  });

  it('should add the class', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('.test-class');

    expect(element).not.toBe(null);
  });

  it('should render into name ng-content', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('#test .govuk-task-list__name-and-hint');
    expect(element.innerText).toBe('Tim');
  });

  it('should render into status ng-content', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('#test .govuk-task-list__status');
    expect(element.innerText).toBe('Hello');
  });
});
