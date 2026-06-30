import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDefendantDetailsAtAGlanceTabComponent } from './fines-acc-defendant-details-at-a-glance-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

describe('FinesAccDefendantDetailsAtAGlanceTabComponent', () => {
  let component: FinesAccDefendantDetailsAtAGlanceTabComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsAtAGlanceTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsAtAGlanceTabComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsAtAGlanceTabComponent);
    component = fixture.componentInstance;
    component.tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the add comments route when the user has account maintenance permission in the BU', () => {
    component.hasAccountMaintenancePermissionInBU = true;

    expect(component.navigateToAddCommentsPage()).toBe(`../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.comments}/add`);
  });

  it('should return the access denied route when the user lacks account maintenance permission in the BU', () => {
    component.hasAccountMaintenancePermissionInBU = false;

    expect(component.navigateToAddCommentsPage()).toBe('/access-denied');
  });

  it.each([
    { linkText: 'Change', hasComments: true },
    { linkText: 'Add comments', hasComments: false },
  ])('should render the $linkText link when comments state matches', ({ linkText, hasComments }) => {
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
    expect(link?.classList.contains('govuk-link--no-visited-state')).toBe(true);
  });

  it('should not render a comments action when the user lacks account maintenance permission', () => {
    fixture.componentRef.setInput('hasAccountMaintenencePermission', false);
    fixture.detectChanges();

    const actionLinks = Array.from(fixture.nativeElement.querySelectorAll('a.govuk-link')) as HTMLAnchorElement[];
    const commentsLink = actionLinks.find((anchor) =>
      ['Change', 'Add comments'].includes(anchor.textContent?.trim() ?? ''),
    );

    expect(commentsLink).toBeFalsy();
  });
});
