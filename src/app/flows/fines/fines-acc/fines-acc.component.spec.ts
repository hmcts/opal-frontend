import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccComponent } from './fines-acc.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesAccComponent', () => {
  let component: FinesAccComponent;
  let fixture: ComponentFixture<FinesAccComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;

  beforeEach(async () => {
    mockOpalFinesService = {
      clearAccountDetailsCache: vi.fn().mockName('OpalFines.clearAccountDetailsCache'),
    };

    await TestBed.configureTestingModule({
      imports: [FinesAccComponent],
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
