import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesAccEnfColloChangeFormComponent } from './fines-acc-enf-collo-change-form.component';

describe('FinesAccEnfColloChangeFormComponent', () => {
  let component: FinesAccEnfColloChangeFormComponent;
  let fixture: ComponentFixture<FinesAccEnfColloChangeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccEnfColloChangeFormComponent],
      providers: [{ provide: ActivatedRoute, useValue: { snapshot: { params: {}, data: {} } } }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccEnfColloChangeFormComponent);
    component = fixture.componentInstance;
    component.accountNumber = '177A';
    component.partyName = 'Mr Robert THOMSON';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the collection order control', () => {
    expect(component.form.get('facc_enf_collection_order_made')).toBeTruthy();
    expect(component.form.get('facc_enf_collection_order_made')?.value).toBeNull();
  });

  it('should render the account caption in account-number-first format', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('177A - Mr Robert THOMSON');
  });
});
