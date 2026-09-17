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
    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(text).toContain('Manual cash input');
    expect(text).toContain('Create till');
    expect(text).toContain('Allocate tills');
    expect(text).toContain('Select the tills you want to allocate');
    expect(text).toContain('Allocate');
    expect(nativeElement.querySelector('a')?.getAttribute('href')).toBe('/fines/dashboard/finance');
    expect(nativeElement.querySelector('#create-till-button')?.getAttribute('href')).toBe(
      '/fines/manual-cash-input/create/till/select-bu',
    );
  });

  it('should render mock tills available to allocate', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('0 of 5 selected');
    expect(text).toContain('Till number');
    expect(text).toContain('Payments');
    expect(text).toContain('Amount');
    expect(text).toContain('Business unit');
    expect(text).toContain('Created by');
    expect(text).toContain('Date created');
    expect(text).toContain('005576');
    expect(text).toContain('Avon and Somerset');
    expect(text).toContain('£200.00');
    expect(text).toContain('12 June 2025 at 10:37');
  });

  it('should update the selected tills count when a till is selected', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const checkbox = nativeElement.querySelector<HTMLInputElement>(
      '#fines-mci-create-allocate-mci-till-005576-avon-01',
    );

    checkbox!.checked = true;
    checkbox!.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(nativeElement.textContent).toContain('1 of 5 selected');
  });
});
