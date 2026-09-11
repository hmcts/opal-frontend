import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesApiProcessAllocateComponent } from './fines-api-process-allocate.component';

describe('FinesApiProcessAllocateComponent', () => {
  let component: FinesApiProcessAllocateComponent;
  let fixture: ComponentFixture<FinesApiProcessAllocateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesApiProcessAllocateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesApiProcessAllocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a placeholder process allocate page', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'Placeholder for Automatic Cash Input - Process files and allocate tills',
    );
  });
});
