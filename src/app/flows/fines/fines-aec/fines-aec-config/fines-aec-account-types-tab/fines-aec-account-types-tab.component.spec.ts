import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { MojAlertComponent } from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

  it('announces an amendment success message and lets the user dismiss it', () => {
    fixture.componentRef.setInput('successMessage', 'Enforcement values updated');
    const onDismiss = vi.fn();
    fixture.componentInstance.clearSuccessMessage.subscribe(onDismiss);
    fixture.detectChanges();

    const alert = fixture.debugElement.query(By.directive(MojAlertComponent)).componentInstance as MojAlertComponent;
    expect(alert.type).toBe('success');
    expect(alert.ariaLabel).toBe('Enforcement values updated');
    expect(alert.showDismiss).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Enforcement values updated');

    const dismissButton: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    dismissButton.click();
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
