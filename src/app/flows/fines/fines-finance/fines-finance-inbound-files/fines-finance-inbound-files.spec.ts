import { ɵresolveComponentResources as resolveComponentResources } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { FinesExtFinanceInboundFiles } from './fines-finance-inbound-files.component';

describe('FinesExtFinanceInboundFiles', () => {
  let component: FinesExtFinanceInboundFiles;
  let fixture: ComponentFixture<FinesExtFinanceInboundFiles>;

  beforeAll(async () => {
    await resolveComponentResources(() => Promise.resolve(''));
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesExtFinanceInboundFiles],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesExtFinanceInboundFiles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
