import { Component } from '@angular/core';
import { AbstractFormArrayParentBaseComponent } from './abstract-form-array-parent-base.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-test-form-array-parent-base',
  template: '',
})
class TestAbstractFormArrayParentBaseComponent extends AbstractFormArrayParentBaseComponent {
  constructor() {
    super();
  }
}

describe('AbstractFormParentBaseComponent', () => {
  let component: TestAbstractFormArrayParentBaseComponent;
  let fixture: ComponentFixture<TestAbstractFormArrayParentBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestAbstractFormArrayParentBaseComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestAbstractFormArrayParentBaseComponent);
    component = fixture.componentInstance;
  });

  it('should handle non-indexed keys correctly', () => {
    const input = [
      { name_0: 'John', age_0: 30, country: 'USA' },
      { name_1: 'Jane', age_1: 25 },
    ];

    const expectedOutput = [
      { name: 'John', age: 30, country: 'USA' },
      { name: 'Jane', age: 25 },
    ];

    const result = component.removeIndexFromFormArrayData(input);
    expect(result).toEqual(expectedOutput);
  });
});
