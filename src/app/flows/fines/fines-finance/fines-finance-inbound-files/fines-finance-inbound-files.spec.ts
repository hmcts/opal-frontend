import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach} from 'vitest';

import { FinesExtFinanceInboundFiles } from './fines-finance-inbound-files.component';

describe('FinesExtFinanceInboundFiles', () => {
  let component: FinesExtFinanceInboundFiles;
  let fixture: ComponentFixture<FinesExtFinanceInboundFiles>;

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
