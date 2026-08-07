import { ɵresolveComponentResources as resolveComponentResources } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { FinesAecConfigComponent } from './fines-aec-config.component';

describe('FinesAecConfig', () => {
  let component: FinesAecConfigComponent;
  let fixture: ComponentFixture<FinesAecConfigComponent>;

  beforeAll(async () => {
    await resolveComponentResources(() => Promise.resolve(''));
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAecConfigComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAecConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
