import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { FinesAecComponent } from './fines-aec.component';

describe('FinesAec', () => {
  let component: FinesAecComponent;
  let fixture: ComponentFixture<FinesAecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAecComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
