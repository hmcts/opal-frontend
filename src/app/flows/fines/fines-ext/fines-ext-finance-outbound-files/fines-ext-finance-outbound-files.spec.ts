import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach} from 'vitest';

import { FinesExtFinanceOutboundFiles } from './fines-ext-finance-outbound-files.component';

describe('FinesExtFinanceOutboundFiles', () => {
  let component: FinesExtFinanceOutboundFiles;
  let fixture: ComponentFixture<FinesExtFinanceOutboundFiles>;

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
