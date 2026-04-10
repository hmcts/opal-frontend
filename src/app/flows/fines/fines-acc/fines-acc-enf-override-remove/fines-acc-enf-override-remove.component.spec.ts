import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccEnfOverrideRemoveComponent } from './fines-acc-enf-override-remove.component';
import { describe, expect, it, beforeEach } from 'vitest';

describe('FinesAccEnfOverrideRemoveComponent', () => {
  let component: FinesAccEnfOverrideRemoveComponent;
  let fixture: ComponentFixture<FinesAccEnfOverrideRemoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccEnfOverrideRemoveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccEnfOverrideRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
