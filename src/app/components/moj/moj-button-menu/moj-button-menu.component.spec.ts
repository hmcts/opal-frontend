import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojButtonMenuComponent } from './moj-button-menu.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MOJ_BUTTON_MENU_ACTIONS_MOCK } from './mocks';

const mockActions = MOJ_BUTTON_MENU_ACTIONS_MOCK;

@Component({
  template: `<app-moj-button-menu menuButtonTitle="More actions" [actions]="mockActions"> </app-moj-button-menu>`,
})
class TestHostComponent {
  mockActions = mockActions;
}

describe('MojButtonMenuComponent - TestHostComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojButtonMenuComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render More actions header', () => {
    const element = fixture.debugElement.query(By.css('.moj-button-menu__toggle-button')).nativeElement;
    expect(element.textContent).toContain('More actions');
  });

  it('should contain two buttons with the specified classes', () => {
    const actions = fixture.debugElement.queryAll(By.css('.moj-button-menu__item'));

    expect(actions.length).toBe(3);
  });

  it('should toggle the button menu', () => {
    const button = fixture.debugElement.query(By.css('.moj-button-menu__toggle-button')).nativeElement;
    const initialExpandedState = button.getAttribute('aria-expanded');
    button.click();

    fixture.detectChanges();

    const updatedExpandedState = button.getAttribute('aria-expanded');
    expect(updatedExpandedState).toEqual(String(initialExpandedState !== 'true'));
  });

  it('should toggle the button menu', () => {
    const button = fixture.debugElement.query(By.css('.moj-button-menu__item')).nativeElement;
    button.click();

    fixture.detectChanges();
  });
});

describe('MojButtonMenuComponent', () => {
  let component: MojButtonMenuComponent;
  let fixture: ComponentFixture<MojButtonMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojButtonMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojButtonMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should toggle the aria-expanded attribute on the button', () => {
    const button = fixture.debugElement.query(By.css('.moj-button-menu__toggle-button')).nativeElement;
    button.setAttribute('aria-expanded', 'false');

    component.toggleButtonMenu();
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('true');

    component.toggleButtonMenu();
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('should emit the actionClick event with the correct actionId', () => {
    spyOn(component.actionClick, 'emit');

    const mockEvent = new Event('click');
    component.onActionClick('action1', mockEvent);

    expect(component.actionClick.emit).toHaveBeenCalledWith('action1');
  });

  it('should prevent the default event behavior', () => {
    const mockEvent = new Event('click');
    spyOn(mockEvent, 'preventDefault');

    component.onActionClick('action1', mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});
