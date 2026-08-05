import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it,} from 'vitest';
import { FinesExtComponent } from './fines-finance.component';

describe('FinesExt', () => {
  let component: FinesExtComponent;
  let fixture: ComponentFixture<FinesExtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesExtComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesExtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
