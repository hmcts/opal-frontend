import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojTicketPanelComponent } from './moj-ticket-panel.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `<app-moj-ticket-panel sectionClasses="moj-ticket-panel__content--blue">
    <h1>Hello world!</h1>
  </app-moj-ticket-panel>`,
  imports: [MojTicketPanelComponent],
})
class TestHostComponent {}

describe('MojTicketPanelComponent', () => {
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

  it('should render ticket panel', () => {
    const element = fixture.debugElement.query(By.css('.moj-ticket-panel'));
    expect(element).toBeTruthy();
  });

  it('should render ticket panel section content - Hello world!', () => {
    const element = fixture.debugElement.query(By.css('.moj-ticket-panel__content'));
    expect(element.nativeElement.textContent).toContain('Hello world!');
  });

  it('should render ticket panel section with incoming classes', () => {
    const element = fixture.debugElement.query(By.css('.moj-ticket-panel__content--blue'));
    expect(element).toBeTruthy();
  });
});
