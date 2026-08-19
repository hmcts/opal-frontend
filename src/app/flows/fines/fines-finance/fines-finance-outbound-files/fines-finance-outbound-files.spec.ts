import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { FinesFinanceOutboundFilesComponent} from './fines-finance-outbound-files.component';

describe('FinesFinanceOutboundFiles', () => {
  let component: FinesFinanceOutboundFilesComponent;
  let fixture: ComponentFixture<FinesFinanceOutboundFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesFinanceOutboundFilesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesFinanceOutboundFilesComponent);
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
