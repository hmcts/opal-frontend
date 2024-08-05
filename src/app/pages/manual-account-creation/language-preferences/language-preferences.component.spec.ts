import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagePreferencesComponent } from './language-preferences.component';
import { provideRouter } from '@angular/router';

describe('LanguagePreferencesComponent', () => {
  let component: LanguagePreferencesComponent;
  let fixture: ComponentFixture<LanguagePreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguagePreferencesComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguagePreferencesComponent);
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
