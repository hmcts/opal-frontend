import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesApiConfirmProcessComponent } from './fines-api-confirm-process.component';

describe('FinesApiConfirmProcessComponent', () => {
  let component: FinesApiConfirmProcessComponent;
  let fixture: ComponentFixture<FinesApiConfirmProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesApiConfirmProcessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesApiConfirmProcessComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render a semantic confirm before processing page', () => {
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const heading = nativeElement.querySelector<HTMLHeadingElement>('h1');

    expect(heading?.textContent?.trim()).toBe('Confirm before processing');
    expect(nativeElement.textContent).toContain('Review the selected files before processing.');
  });
});
