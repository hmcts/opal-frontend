import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesMciCreateTillSelectBuComponent } from './fines-mci-create-till-select-bu.component';

describe('FinesMciCreateTillSelectBuComponent', () => {
  let component: FinesMciCreateTillSelectBuComponent;
  let fixture: ComponentFixture<FinesMciCreateTillSelectBuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillSelectBuComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMciCreateTillSelectBuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a select business unit placeholder page', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Select business unit');
    expect(text).toContain('This page is not available yet.');
    expect(fixture.nativeElement.querySelector('a')?.getAttribute('href')).toBe(
      '/fines/manual-cash-input/create-allocate',
    );
  });
});
