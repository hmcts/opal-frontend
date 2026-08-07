import { ɵresolveComponentResources as resolveComponentResources } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { FinesAecComponent } from './fines-aec.component';

describe('FinesAec', () => {
  let component: FinesAecComponent;
  let fixture: ComponentFixture<FinesAecComponent>;

  beforeAll(async () => {
    await resolveComponentResources(() => Promise.resolve(''));
  });

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
