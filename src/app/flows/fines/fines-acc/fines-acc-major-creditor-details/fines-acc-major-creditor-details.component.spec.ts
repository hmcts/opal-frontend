import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesAccMajorCreditorDetailsComponent } from './fines-acc-major-creditor-details.component';

describe('FinesAccMajorCreditorDetailsComponent', () => {
  let component: FinesAccMajorCreditorDetailsComponent;
  let fixture: ComponentFixture<FinesAccMajorCreditorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccMajorCreditorDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccMajorCreditorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the major creditor details placeholder heading', () => {
    const heading = fixture.nativeElement.querySelector('h1');

    expect(heading?.textContent.trim()).toBe('Major creditor details');
  });
});
