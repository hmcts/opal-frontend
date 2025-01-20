import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojButtonMenuItemComponent } from './moj-button-menu-item.component';
import { Component } from '@angular/core';
import { MojButtonMenuComponent } from '../moj-button-menu.component';

@Component({
  template: `<app-moj-button-menu menuButtonTitle="More actions">
    <app-moj-button-menu-item>
      <ng-container linkText>Action 1</ng-container>
      <ng-container linkText>Action 2</ng-container>
      <ng-container linkText>Action 3</ng-container>
    </app-moj-button-menu-item>
  </app-moj-button-menu>`,
  standalone: false,
})
class TestHostComponent {}

describe('MojButtonMenuItemComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojButtonMenuComponent, MojButtonMenuItemComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('MojButtonMenuItemComponent', () => {
  let component: MojButtonMenuItemComponent;
  let fixture: ComponentFixture<MojButtonMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojButtonMenuItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojButtonMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit the actionClick event with the correct actionId', () => {
    spyOn(component.actionClick, 'emit');

    const mockEvent = new Event('click');
    component.handleClick(mockEvent);

    expect(component.actionClick.emit).toHaveBeenCalledWith(true);
  });

  it('should prevent the default event behavior', () => {
    const mockEvent = new Event('click');
    spyOn(mockEvent, 'preventDefault');

    component.handleClick(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});
