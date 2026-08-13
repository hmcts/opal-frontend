import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewOffenceHeadingComponent } from './fines-mac-offence-details-review-offence-heading.component';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesMacOffenceDetailsReviewOffenceHeadingComponent', () => {
  let component: FinesMacOffenceDetailsReviewOffenceHeadingComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewOffenceHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewOffenceHeadingComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewOffenceHeadingComponent);
    component = fixture.componentInstance;

    component.offenceId = 0;
    component.offenceCode = '314441';
    component.offenceTitle = 'Test title';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should emit actionClicked event with correct parameters', () => {
    const action = 'Change';
    const emittedValue = { actionName: action, offenceId: component.offenceId };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emitSpy = vi.spyOn<any, any>(component.actionClicked, 'emit');

    component.onActionClick(action);

    expect(emitSpy).toHaveBeenCalledWith(emittedValue);
  });
});
