import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsComponent } from './fines-mac-offence-details.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('FinesMacOffenceDetailsComponent', () => {
  let component: FinesMacOffenceDetailsComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to account-details page on handleRoute', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleRoute('test');

    expect(routerSpy).toHaveBeenCalledWith(['test'], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should navigate to account-details page on handleRoute with event', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const event = jasmine.createSpyObj(Event, ['preventDefault']);

    component.handleRoute('test', event);

    expect(routerSpy).toHaveBeenCalledWith(['test'], {
      relativeTo: component['activatedRoute'].parent,
    });

    expect(event.preventDefault).toHaveBeenCalled();
  });
});
