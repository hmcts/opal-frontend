import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacDeleteAccountConfirmationComponent } from './fines-mac-delete-account-confirmation.component';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('FinesMacDeleteAccountConfirmationComponent', () => {
  let component: FinesMacDeleteAccountConfirmationComponent;
  let fixture: ComponentFixture<FinesMacDeleteAccountConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacDeleteAccountConfirmationComponent],
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

    fixture = TestBed.createComponent(FinesMacDeleteAccountConfirmationComponent);
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

  it('should navigate on handleRoute with event', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const event = jasmine.createSpyObj(Event, ['preventDefault']);

    component.handleRoute('test', event);

    expect(routerSpy).toHaveBeenCalledWith(['test'], { relativeTo: component['activatedRoute'].parent });
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
