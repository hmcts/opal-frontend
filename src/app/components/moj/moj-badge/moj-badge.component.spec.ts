import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojBadgeComponent } from './moj.badge.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-moj-badge badgeId="test" badgeClasses="test-class">Test</app-moj-badge>`,
  imports: [MojBadgeComponent],
})
class TestHostComponent {}
describe('MojBadgeComponent', () => {
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

  it('should add the id', () => {
    const element = fixture.nativeElement.querySelector('#test');
    expect(element).not.toBe(null);
  });

  it('should add the class', () => {
    const element = fixture.nativeElement.querySelector('.test-class');
    expect(element).not.toBe(null);
  });

  it('should render into ng-content', () => {
    const element = fixture.nativeElement.querySelector('#test');
    expect(element.innerText).toBe('Test');
  });
});
