import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojSubNavigationItemComponent } from './moj-sub-navigation-item.component';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

describe('MojSubNavigationItemComponent', () => {
  let component: MojSubNavigationItemComponent;
  let fixture: ComponentFixture<MojSubNavigationItemComponent>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojSubNavigationItemComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MojSubNavigationItemComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    component.subNavItemId = 'example';
    component.subNavItemFragment = 'example';
    component.subNavItemText = 'Example';
    component.activeSubNavItemFragment = 'example';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an id', () => {
    const element = fixture.nativeElement.querySelector('#example');
    expect(element).toBeTruthy();
  });

  it('should have item text', () => {
    const element = fixture.nativeElement.querySelector('#example .moj-sub-navigation__link');
    expect(element.innerText).toBe(component.subNavItemText);
  });

  it('should be an active link', () => {
    const element = fixture.nativeElement
      .querySelector('#example .moj-sub-navigation__link')
      .getAttribute('aria-current');

    expect(element).toBe('page');
  });

  it('should not be an active link', () => {
    component.activeSubNavItemFragment = 'not-example';
    const cdr = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    cdr.detectChanges();

    const element = fixture.nativeElement.querySelector('#example .moj-sub-navigation__link');

    expect(element).not.toBe('page');
  });

  it('should navigate to the correct route with fragment', () => {
    const event = new Event('click');
    const navigateSpy = spyOn(router, 'navigate');

    component.handleItemClick(event, component.subNavItemFragment);

    expect(navigateSpy).toHaveBeenCalledWith(['./'], {
      relativeTo: route,
      fragment: component.subNavItemFragment,
    });
  });
});
