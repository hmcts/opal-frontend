import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacAccountCommentsNotesComponent } from './fines-mac-account-comments-notes.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('FinesMacAccountCommentsNotesComponent', () => {
  let component: FinesMacAccountCommentsNotesComponent;
  let fixture: ComponentFixture<FinesMacAccountCommentsNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacAccountCommentsNotesComponent],
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

    fixture = TestBed.createComponent(FinesMacAccountCommentsNotesComponent);
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
    const event = jasmine.createSpyObj('event', ['preventDefault']);

    component.handleRoute('test', event);

    expect(routerSpy).toHaveBeenCalledWith(['test'], { relativeTo: component['activatedRoute'].parent });
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
