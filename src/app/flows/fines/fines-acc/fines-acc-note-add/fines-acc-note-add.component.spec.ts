import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccNoteAddComponent } from './fines-acc-note-add.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('FinesAccNoteAddComponent', () => {
  let component: FinesAccNoteAddComponent;
  let fixture: ComponentFixture<FinesAccNoteAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccNoteAddComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('details'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccNoteAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
