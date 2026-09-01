import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesApiComponent } from './fines-api.component';

describe('FinesApiComponent', () => {
  let component: FinesApiComponent;
  let fixture: ComponentFixture<FinesApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesApiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
