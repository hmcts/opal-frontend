import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FinesReportsCreateComponent } from './fines-reports-create.component';
import { describe, expect, it, beforeEach } from 'vitest';

describe('FinesReportsCreateComponent', () => {
  let component: FinesReportsCreateComponent;
  let fixture: ComponentFixture<FinesReportsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesReportsCreateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesReportsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a stub create report page', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Create report');
    expect(text).toContain('This page is not available yet.');
    expect(fixture.nativeElement.querySelector('a')?.getAttribute('href')).toBe('/summary-list');
  });
});
