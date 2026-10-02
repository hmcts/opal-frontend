import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesMciCreateAllocateComponent } from './fines-mci-create-allocate.component';

describe('FinesMciCreateAllocateComponent', () => {
  let component: FinesMciCreateAllocateComponent;
  let fixture: ComponentFixture<FinesMciCreateAllocateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateAllocateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMciCreateAllocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a manual cash input placeholder page', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Manual cash input');
    expect(text).toContain('This page is not available yet.');
    expect(text).toContain('Back to finance');
    expect(fixture.nativeElement.querySelector('a')?.getAttribute('href')).toBe('/fines/dashboard/finance');
  });
});
