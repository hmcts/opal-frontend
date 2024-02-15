import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojSubNavigationComponent } from './moj-sub-navigation.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

const fragment = 'test';

describe('MojSubNavigationComponent', () => {
  let component: MojSubNavigationComponent;
  let fixture: ComponentFixture<MojSubNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojSubNavigationComponent, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of(fragment), // Mock the route params
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MojSubNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    spyOn(component.activeNavigationItem, 'emit');

    component.ngOnInit();
    expect(component['routeFragmentSub']).toBeDefined();

    expect(component.activeNavigationItem.emit).toHaveBeenCalledWith(fragment);
  });
});
