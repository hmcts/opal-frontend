import { ɵresolveComponentResources as resolveComponentResources } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { FinesExtFinanceOutboundFiles } from './fines-finance-outbound-files.component';

describe('FinesExtFinanceOutboundFiles', () => {
  let component: FinesExtFinanceOutboundFiles;
  let fixture: ComponentFixture<FinesExtFinanceOutboundFiles>;

  beforeAll(async () => {
    await resolveComponentResources(() => Promise.resolve(''));
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesExtFinanceOutboundFiles],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesExtFinanceOutboundFiles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
