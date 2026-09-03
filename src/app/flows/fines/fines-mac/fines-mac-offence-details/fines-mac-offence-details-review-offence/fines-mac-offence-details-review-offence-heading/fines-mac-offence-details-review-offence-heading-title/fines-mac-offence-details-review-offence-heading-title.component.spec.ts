import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent } from './fines-mac-offence-details-review-offence-heading-title.component';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { By } from '@angular/platform-browser';
import {
  GovukSummaryListRowActionItemComponent,
  GovukSummaryListRowActionsComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';

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

  it('should not render actions when read only', () => {
    fixture.componentRef.setInput('showActions', true);
    fixture.componentRef.setInput('isReadOnly', true);

    fixture.detectChanges();

    const actions = fixture.debugElement.query(By.directive(GovukSummaryListRowActionsComponent));

    expect(actions).toBeNull();
  });

  it('should render only change and remove actions when editable', () => {
    fixture.componentRef.setInput('showActions', true);
    fixture.componentRef.setInput('isReadOnly', false);

    fixture.detectChanges();

    const actions = fixture.debugElement.query(By.directive(GovukSummaryListRowActionsComponent));
    const actionNames = fixture.debugElement
      .queryAll(By.directive(GovukSummaryListRowActionItemComponent))
      .map((action) => action.componentInstance.actionName);

    expect(actions).toBeTruthy();
    expect(actionNames).toEqual(['Change', 'Remove']);
  });
});
