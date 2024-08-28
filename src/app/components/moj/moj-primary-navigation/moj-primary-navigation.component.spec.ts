import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojPrimaryNavigationComponent } from './moj-primary-navigation.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('MojPrimaryNavigationComponent', () => {
  let component: MojPrimaryNavigationComponent;
  let fixture: ComponentFixture<MojPrimaryNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojPrimaryNavigationComponent],
      providers: [
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
    component.primaryNavigationId = 'testPrimaryNavigation';

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
});
