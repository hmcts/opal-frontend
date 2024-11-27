import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountComponent } from './fines-mac-review-account.component';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

xdescribe('FinesMacReviewAccountComponent', () => {
  let component: FinesMacReviewAccountComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate on handleRoute', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleRoute('test');

    expect(routerSpy).toHaveBeenCalledWith(['test'], { relativeTo: component['activatedRoute'].parent });
  });

  it('should navigate on handleRoute with relative to', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleRoute('test', true);

    expect(routerSpy).toHaveBeenCalledWith(['test']);
  });

  it('should navigate on handleRoute with event', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const event = jasmine.createSpyObj(Event, ['preventDefault']);

    component.handleRoute('test', true, event);

    expect(routerSpy).toHaveBeenCalledWith(['test']);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should navigate back on navigateBack', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.navigateBack();

    expect(routerSpy).toHaveBeenCalledWith([component['fineMacRoutes'].children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });
});
