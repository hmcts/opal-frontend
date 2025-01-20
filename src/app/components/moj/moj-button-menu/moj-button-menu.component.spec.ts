import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojButtonMenuComponent } from './moj-button-menu.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MojButtonMenuItemComponent } from './moj-button-menu-item/moj-button-menu-item.component';

@Component({
  template: `<app-moj-button-menu menuButtonTitle="More actions">
    <app-moj-button-menu-item>
      <ng-container linkText>Action 1</ng-container>
    </app-moj-button-menu-item>
  </app-moj-button-menu>`,
  standalone: false,
})
class TestHostComponent {}

describe('MojButtonMenuComponent - TestHostComponent', () => {
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

  it('should render More actions header', () => {
    const element = fixture.debugElement.query(By.css('.moj-button-menu__toggle-button')).nativeElement;
    expect(element.textContent).toContain('More actions');
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
});
