import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojSubNavigationItemComponent } from './moj-sub-navigation-item.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';

describe('MojSubNavigationItemComponent', () => {
  let component: MojSubNavigationItemComponent;
  let fixture: ComponentFixture<MojSubNavigationItemComponent>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojSubNavigationItemComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MojSubNavigationItemComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    component.subNavItemId = 'example';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an id', () => {
    const element = fixture.nativeElement.querySelector('#example');
    expect(element).toBeTruthy();
  });

  it('should navigate to the correct route with fragment', () => {
    const event = new Event('click');
    const item = 'example';
    const navigateSpy = spyOn(router, 'navigate');

    component.handleItemClick(event, item);

    expect(navigateSpy).toHaveBeenCalledWith(['./'], {
      relativeTo: route,
      fragment: item,
    });
  });
});
