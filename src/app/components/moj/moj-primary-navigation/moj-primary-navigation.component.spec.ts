import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojPrimaryNavigationComponent } from './moj-primary-navigation.component';
import { MOJ_PRIMARY_NAVIGATION_ITEMS_MOCK } from './mocks';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('MojPrimaryNavigationComponent', () => {
  let component: MojPrimaryNavigationComponent;
  let fixture: ComponentFixture<MojPrimaryNavigationComponent>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojPrimaryNavigationComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of('test'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MojPrimaryNavigationComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    component.primaryNavigationId = 'testPrimaryNavigation';
    component.navigationItems = MOJ_PRIMARY_NAVIGATION_ITEMS_MOCK;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an id', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('#testPrimaryNavigation');
    expect(element).toBeTruthy();
  });

  it('should emit the fragment', () => {
    spyOn(component.activeItemFragment, 'emit');

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.activeItemFragment.emit).toHaveBeenCalledWith('test');
  });

  it('should navigate to the correct route with fragment', () => {
    const event = new Event('click');
    const navigateSpy = spyOn(router, 'navigate');

    component.handleItemClick(event, component.navigationItems[0].itemFragment);

    expect(navigateSpy).toHaveBeenCalledWith(['./'], {
      relativeTo: route,
      fragment: component.navigationItems[0].itemFragment,
    });
  });
});
