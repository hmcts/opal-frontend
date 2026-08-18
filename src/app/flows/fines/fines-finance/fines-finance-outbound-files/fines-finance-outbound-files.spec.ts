import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { FinesExtFinanceOutboundFiles } from './fines-finance-outbound-files.component';

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

  it('should render a placeholder container page for outbound files', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Placeholder for Outbound Files');
  });
});
