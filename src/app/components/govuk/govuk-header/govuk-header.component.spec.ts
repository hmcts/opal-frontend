import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovukHeaderComponent } from './govuk-header.component';
import { Component } from '@angular/core';
import { GovukHeaderNavigationItemComponent } from './govuk-header-navigation-item/govuk-header-navigation-item.component';
import { RouterTestingModule } from '@angular/router/testing';

@Component({
  template: `<app-govuk-header>
    <ng-container organisationName>Test Organisation</ng-container>
    <ng-container serviceName>Test Service</ng-container>
    <app-govuk-header-navigation-item>
      <ng-container linkText>Test Link</ng-container>
    </app-govuk-header-navigation-item>
  </app-govuk-header>`,
})
class TestHostComponent {}

describe('GovukHeaderComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukHeaderComponent, GovukHeaderNavigationItemComponent, RouterTestingModule],
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
    const element = fixture.nativeElement.querySelector('.govuk-header__logotype-text');
    expect(element.innerText).toBe('Test Organisation');
  });

  it('should render into serviceName ng-content', () => {
    const element = fixture.nativeElement.querySelector('.govuk-header__service-name');
    expect(element.innerText).toBe('Test Service');
  });

  it('should render into linkText ng-content', () => {
    const element = fixture.nativeElement.querySelector('app-govuk-header-navigation-item');
    expect(element.innerText).toBe('Test Link');
  });
});
