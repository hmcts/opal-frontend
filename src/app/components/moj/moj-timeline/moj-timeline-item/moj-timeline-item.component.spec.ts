import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojTimelineItemComponent } from './moj-timeline-item.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `<app-moj-timeline-item>
    <ng-content title>Test</ng-content>
    <ng-content user>Test User</ng-content>
    <ng-content date>23/07/2024</ng-content>
    <ng-content description><p>Hello world!</p></ng-content>
  </app-moj-timeline-item>`,
  standalone: false,
})
class TestHostComponent {}

describe('MojTimelineItemComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojTimelineItemComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render timeline title - Test', () => {
    const element = fixture.debugElement.query(By.css('.moj-timeline__title'));
    expect(element.nativeElement.textContent).toContain('Test');
  });

  it('should render timeline user - Test User', () => {
    const element = fixture.debugElement.query(By.css('.moj-timeline__byline'));
    expect(element.nativeElement.textContent).toContain('Test User');
  });

  it('should render timeline date - 23/07/2024', () => {
    const element = fixture.debugElement.query(By.css('.moj-timeline__date'));
    expect(element.nativeElement.textContent).toContain('23/07/2024');
  });

  it('should render timeline description - Hello world!', () => {
    const element = fixture.debugElement.query(By.css('.moj-timeline__description'));
    expect(element.nativeElement.textContent).toContain('Hello world!');
  });
});
