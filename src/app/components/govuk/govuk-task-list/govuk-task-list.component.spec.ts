import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTaskListComponent } from './govuk-task-list.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-govuk-task-list taskListId="test" taskListClasses="test-class">Hello World</app-govuk-task-list>`,
})
class TestHostComponent {}

describe('GovukTaskListComponent', () => {
  let component: TestHostComponent | null;
  let fixture: ComponentFixture<TestHostComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTaskListComponent],
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

  it('should render into list ng-content', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('#test');
    expect(element.innerText).toBe('Hello World');
  });

  it('should have the added class', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('.test-class');
    expect(element.innerText).toBe('Hello World');
  });
});
