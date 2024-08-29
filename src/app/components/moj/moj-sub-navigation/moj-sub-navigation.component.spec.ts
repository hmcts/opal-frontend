import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MojSubNavigationComponent } from './moj-sub-navigation.component';

describe('MojSubNavigationComponent', () => {
  let component: MojSubNavigationComponent;
  let fixture: ComponentFixture<MojSubNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojSubNavigationComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of('test'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MojSubNavigationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have an id', () => {
    component.subNavId = 'example';
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('#example');
    expect(element).toBeTruthy();
  });

  it('should emit the fragment', () => {
    spyOn(component.activeSubNavItemFragment, 'emit');

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.activeSubNavItemFragment.emit).toHaveBeenCalledWith('test');
  });
});
