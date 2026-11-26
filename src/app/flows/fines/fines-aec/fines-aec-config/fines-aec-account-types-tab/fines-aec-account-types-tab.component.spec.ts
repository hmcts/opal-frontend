import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesAecAccountTypesTabComponent } from './fines-aec-account-types-tab.component';

describe('FinesAecAccountTypesTabComponent', () => {
  let fixture: ComponentFixture<FinesAecAccountTypesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAecAccountTypesTabComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(FinesAecAccountTypesTabComponent);
    fixture.componentRef.setInput('accountTypes', []);
  });

  it('explains an empty response without presenting a success banner', () => {
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('h2')?.textContent).toBe('Account types');
    expect(element.querySelector('#aec-account-types-empty')?.textContent).toBe(
      'There are no account types to display.',
    );
    expect(element.querySelector('table')).toBeNull();
    expect(element.querySelector('#aec-account-types-success')).toBeNull();
  });
});
