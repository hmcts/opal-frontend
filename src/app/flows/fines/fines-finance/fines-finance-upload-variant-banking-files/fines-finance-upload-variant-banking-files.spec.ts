import { ɵresolveComponentResources as resolveComponentResources } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { FinesExtFinanceUploadVariantBankingFiles } from './fines-finance-upload-variant-banking-files.component';

describe('FinesExtFinanceUploadVariantBankingFiles', () => {
  let component: FinesExtFinanceUploadVariantBankingFiles;
  let fixture: ComponentFixture<FinesExtFinanceUploadVariantBankingFiles>;

  beforeAll(async () => {
    await resolveComponentResources(() => Promise.resolve(''));
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesExtFinanceUploadVariantBankingFiles],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesExtFinanceUploadVariantBankingFiles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
