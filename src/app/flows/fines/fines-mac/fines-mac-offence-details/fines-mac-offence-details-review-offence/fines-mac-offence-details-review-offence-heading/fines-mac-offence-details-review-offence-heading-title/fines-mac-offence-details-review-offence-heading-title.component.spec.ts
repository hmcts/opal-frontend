import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent } from './fines-mac-offence-details-review-offence-heading-title.component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent', () => {
  let component: FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent);
    component = fixture.componentInstance;

    component.offenceCode = 'AK123456';
    component.offenceTitle = 'ak test';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit action when onActionClick is called', () => {
    const action = 'Change';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emitSpy = vi.spyOn<any, any>(component.actionClicked, 'emit');

    component.onActionClick(action);

    expect(emitSpy).toHaveBeenCalledWith(action);
  });
});
