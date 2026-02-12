import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesDraftComponent } from './fines-draft.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesDraftComponent', () => {
  let component: FinesDraftComponent;
  let fixture: ComponentFixture<FinesDraftComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;

  beforeEach(async () => {
    mockOpalFinesService = {
      clearDraftAccountsCache: vi.fn().mockName('OpalFines.clearDraftAccountsCache'),
    };

    await TestBed.configureTestingModule({
      imports: [FinesDraftComponent],
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
