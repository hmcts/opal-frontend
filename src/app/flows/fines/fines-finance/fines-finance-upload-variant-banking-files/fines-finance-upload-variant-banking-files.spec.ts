import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach} from 'vitest';

import { FinesExtFinanceUploadVariantBankingFiles } from './fines-finance-upload-variant-banking-files.component';

describe('FinesExtFinanceUploadVariantBankingFiles', () => {
  let component: FinesExtFinanceUploadVariantBankingFiles;
  let fixture: ComponentFixture<FinesExtFinanceUploadVariantBankingFiles>;

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
