import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojHeaderComponent } from './moj-header.component';
import { Component } from '@angular/core';
import { MojHeaderNavigationItemComponent } from '@components/moj/moj-header/moj-header-navigation-item/moj-header-navigation-item.component';
import { provideRouter } from '@angular/router';

@Component({
  template: `<app-moj-header>
    <ng-container organisationName>Test Organisation</ng-container>
    <ng-container serviceName>Test Service</ng-container>
    <app-moj-header-navigation-item>
      <ng-container linkText>Test Link</ng-container>
    </app-moj-header-navigation-item>
  </app-moj-header>`,
  standalone: false,
})
class TestHostComponent {}

describe('MojHeaderComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojHeaderComponent, MojHeaderNavigationItemComponent],
      providers: [provideRouter([])],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render into organisationName ng-content', () => {
    const element = fixture.nativeElement.querySelector('.moj-header__link--organisation-name');
    expect(element.innerText).toBe('Test Organisation');
  });

  it('should render into serviceName ng-content', () => {
    const element = fixture.nativeElement.querySelector('.moj-header__link--service-name');
    expect(element.innerText).toBe('Test Service');
  });

  it('should render into linkText ng-content', () => {
    const element = fixture.nativeElement.querySelector('app-moj-header-navigation-item');
    expect(element.innerText).toBe('Test Link');
  });
});
