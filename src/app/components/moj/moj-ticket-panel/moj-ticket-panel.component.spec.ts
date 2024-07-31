import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojTicketPanelComponent } from './moj-ticket-panel.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `<app-moj-ticket-panel></app-moj-ticket-panel>`,
})
class TestHostComponent {}

describe('MojTicketPanelComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojTicketPanelComponent],
      declarations: [TestHostComponent],
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
});
