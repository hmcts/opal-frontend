import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesReportsComponent } from './fines-reports.component';
import { beforeEach, describe, expect, it } from 'vitest';

describe('FinesReportsComponent', () => {
  let component: FinesReportsComponent;
  let fixture: ComponentFixture<FinesReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesReportsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
