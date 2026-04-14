import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDefendantDetailsAtAGlanceTabComponent } from './fines-acc-defendant-details-at-a-glance-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesAccDefendantDetailsAtAGlanceTabComponent', () => {
  let component: FinesAccDefendantDetailsAtAGlanceTabComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsAtAGlanceTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsAtAGlanceTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsAtAGlanceTabComponent);
    component = fixture.componentInstance;
    component.tabData = OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prevent default and emit addComments in handleAddComments', () => {
    const event = new Event('click');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emitSpy = vi.spyOn<any, any>(component.addComments, 'emit');

    component.handleAddComments(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should enforce action link template metadata', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const templateConsts = ((FinesAccDefendantDetailsAtAGlanceTabComponent as any).ɵcmp?.consts ?? []).filter(
      (entry: unknown) => Array.isArray(entry),
    ) as unknown[][];
    const templateFunction =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((FinesAccDefendantDetailsAtAGlanceTabComponent as any).ɵcmp?.template?.toString() as string | undefined) ?? '';
    const actionLinkConsts = templateConsts.filter(
      (entry) =>
        entry.includes('govuk-link') &&
        entry.includes('govuk-link--no-visited-state') &&
        entry.includes('href') &&
        entry.includes('click'),
    );

    expect(actionLinkConsts.length).toBeGreaterThanOrEqual(1);
    actionLinkConsts.forEach((entry) => expect(entry).not.toContain('tabindex'));
    expect(templateFunction).not.toContain('keydown.enter');
    expect(templateFunction).not.toContain('keyup.enter');
  });

  it.each([
    { linkText: 'Change', hasComments: true },
    { linkText: 'Add comments', hasComments: false },
  ])('should pass $event and preserve logic for $linkText link', ({ linkText, hasComments }) => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);

    tabData.comments_and_notes = hasComments
      ? {
          account_comment: 'has comment',
          free_text_note_1: tabData.comments_and_notes?.free_text_note_1 ?? null,
          free_text_note_2: tabData.comments_and_notes?.free_text_note_2 ?? null,
          free_text_note_3: tabData.comments_and_notes?.free_text_note_3 ?? null,
        }
      : {
          account_comment: null,
          free_text_note_1: null,
          free_text_note_2: null,
          free_text_note_3: null,
        };

    fixture.componentRef.setInput('tabData', tabData);
    fixture.componentRef.setInput('hasAccountMaintenencePermission', true);
    fixture.detectChanges();

    const actionLinks = Array.from(fixture.nativeElement.querySelectorAll('a.govuk-link')) as HTMLAnchorElement[];
    const link = actionLinks.find((anchor) => anchor.textContent?.trim() === linkText) ?? null;
    expect(link).toBeTruthy();
    if (!link) throw new Error(`Link not found: ${linkText}`);

    expect(link.classList.contains('govuk-link--no-visited-state')).toBe(true);
    expect(link.getAttribute('href')).toBe('');
    expect(link.getAttribute('tabindex')).toBeNull();

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAddCommentsSpy = vi.spyOn<any, any>(component, 'handleAddComments');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emitSpy = vi.spyOn<any, any>(component.addComments, 'emit');

    link.dispatchEvent(clickEvent);

    expect(handleAddCommentsSpy).toHaveBeenCalledWith(clickEvent);
    expect(clickEvent.defaultPrevented).toBe(true);
    expect(emitSpy).toHaveBeenCalled();
  });
});
