import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesAccEnfActionAddNewFormComponent } from './fines-acc-enf-action-add-new-form.component';

describe('FinesAccEnfActionAddNewFormComponent', () => {
  let component: FinesAccEnfActionAddNewFormComponent;
  let fixture: ComponentFixture<FinesAccEnfActionAddNewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccEnfActionAddNewFormComponent],
      providers: [{ provide: ActivatedRoute, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccEnfActionAddNewFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('accountNumber', '177A');
    fixture.componentRef.setInput('partyName', 'Ms Anna GRAHAM');
    fixture.detectChanges();
  });

  it('should create with the yes or no control unset', () => {
    expect(component).toBeTruthy();
    expect(component.form.get('facc_enf_action_add_new')?.value).toBeNull();
  });

  it('should visually hide the radio legend and render yes or no options inline', () => {
    const legend = fixture.nativeElement.querySelector('.govuk-fieldset__legend') as HTMLElement;
    const radios = fixture.nativeElement.querySelector('.govuk-radios') as HTMLElement;

    expect(legend.textContent?.trim()).toBe('Do you want to add a new enforcement action?');
    expect(legend.classList.contains('govuk-visually-hidden')).toBe(true);
    expect(radios.classList.contains('govuk-radios--inline')).toBe(true);
  });

  it('should show the required error when continue is selected without choosing an option', () => {
    const formSubmitSpy = vi.spyOn(component['formSubmit'], 'emit');

    component.handleFormSubmit(new SubmitEvent('submit'));

    expect(formSubmitSpy).not.toHaveBeenCalled();
    expect(component.formControlErrorMessages['facc_enf_action_add_new']).toBe(
      'Select whether you want to add a new enforcement action',
    );
  });

  it('should submit when yes is selected', () => {
    const formSubmitSpy = vi.spyOn(component['formSubmit'], 'emit');

    component.form.get('facc_enf_action_add_new')?.setValue(true);
    component.handleFormSubmit(new SubmitEvent('submit'));

    expect(formSubmitSpy).toHaveBeenCalledWith({
      formData: { facc_enf_action_add_new: true },
      nestedFlow: false,
    });
  });

  it('should submit when no is selected', () => {
    const formSubmitSpy = vi.spyOn(component['formSubmit'], 'emit');

    component.form.get('facc_enf_action_add_new')?.setValue(false);
    component.handleFormSubmit(new SubmitEvent('submit'));

    expect(formSubmitSpy).toHaveBeenCalledWith({
      formData: { facc_enf_action_add_new: false },
      nestedFlow: false,
    });
  });
});
