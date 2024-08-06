import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCommentsNotesComponent } from './account-comments-notes.component';
import { provideRouter } from '@angular/router';

describe('AccountCommentsNotesComponent', () => {
  let component: AccountCommentsNotesComponent;
  let fixture: ComponentFixture<AccountCommentsNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCommentsNotesComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCommentsNotesComponent);
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
