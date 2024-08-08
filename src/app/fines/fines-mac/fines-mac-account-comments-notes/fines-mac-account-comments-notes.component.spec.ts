import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacAccountCommentsNotesComponent } from './fines-mac-account-comments-notes.component';
import { provideRouter } from '@angular/router';

describe('FinesMacAccountCommentsNotesComponent', () => {
  let component: FinesMacAccountCommentsNotesComponent;
  let fixture: ComponentFixture<FinesMacAccountCommentsNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacAccountCommentsNotesComponent],
      providers: [provideRouter([])],
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
    expect(routerSpy).toHaveBeenCalledWith(['test']);
  });
});
