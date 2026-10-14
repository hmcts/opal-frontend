import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent } from './fines-mac-offence-details-review-offence-heading-title.component';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { By } from '@angular/platform-browser';
import {
  GovukSummaryListRowActionItemComponent,
  GovukSummaryListRowActionsComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../../../../../constants/release-feature-flags.constant';

describe('FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent', () => {
  let component: FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent>;
  let globalStore: InstanceType<typeof GlobalStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent);
    component = fixture.componentInstance;
    globalStore = TestBed.inject(GlobalStore);
    globalStore.setFeatureFlags({});

    component.offenceCode = 'AK123456';
    component.offenceTitle = 'ak test';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it.each([
    { description: 'level 2', enabled: false, expectedHeading: 'h2' },
    { description: 'level 3', enabled: true, expectedHeading: 'h3' },
  ])('should render the offence title as a $description heading when release-1a-1-2 is $enabled', ({ enabled, expectedHeading }) => {
    globalStore.setFeatureFlags({ [RELEASE_1A_1_2_FEATURE_FLAG]: enabled });
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css(expectedHeading))?.nativeElement.textContent).toContain('ak test');
    expect(fixture.debugElement.query(By.css(expectedHeading === 'h2' ? 'h3' : 'h2'))).toBeNull();
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
