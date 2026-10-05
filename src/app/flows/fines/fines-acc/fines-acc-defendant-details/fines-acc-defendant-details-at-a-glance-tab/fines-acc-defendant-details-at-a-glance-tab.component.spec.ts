import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDefendantDetailsAtAGlanceTabComponent } from './fines-acc-defendant-details-at-a-glance-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

describe('FinesAccDefendantDetailsAtAGlanceTabComponent', () => {
  let component: FinesAccDefendantDetailsAtAGlanceTabComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsAtAGlanceTabComponent>;

  const setCommentsAndDetectChanges = (
    comments: {
      account_comment: string | null;
      free_text_note_1: string | null;
      free_text_note_2: string | null;
      free_text_note_3: string | null;
    },
    hasPermission = true,
  ) => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);

    tabData.comments_and_notes = comments;

    fixture.componentRef.setInput('tabData', tabData);
    fixture.componentRef.setInput('hasAccountMaintenencePermission', hasPermission);
    fixture.componentRef.setInput('hasAccountMaintenancePermissionInBU', hasPermission);
    fixture.detectChanges();
  };

  const getActionLinks = (): HTMLAnchorElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('a.govuk-link')) as HTMLAnchorElement[];

  const getChangeLinks = (): HTMLAnchorElement[] =>
    getActionLinks().filter((anchor) => anchor.textContent?.trim() === 'Change');

  const getSectionValue = (headingText: string): string => {
    const headings = Array.from(fixture.nativeElement.querySelectorAll('h3')) as HTMLHeadingElement[];
    const heading = headings.find((element) => element.textContent?.trim() === headingText);
    const value = heading?.nextElementSibling as HTMLParagraphElement | null;

    return value?.textContent?.trim() ?? '';
  };

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

  it('should display only the Add comments link when no account comment or free text notes exist', () => {
    setCommentsAndDetectChanges({
      account_comment: null,
      free_text_note_1: null,
      free_text_note_2: null,
      free_text_note_3: null,
    });

    const actionLinks = getActionLinks();

    expect(actionLinks).toHaveLength(1);
    expect(actionLinks[0].textContent?.trim()).toBe('Add comments');
    expect(actionLinks[0].classList.contains('govuk-link--no-visited-state')).toBe(true);
    expect(component.navigateToAddCommentsPage()).toBe(`../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.comments}/add`);
  });

  it('should display an account comment, two change links and a dash for free text notes when only an account comment exists', () => {
    setCommentsAndDetectChanges({
      account_comment: 'Account warning',
      free_text_note_1: null,
      free_text_note_2: null,
      free_text_note_3: null,
    });

    const changeLinks = getChangeLinks();

    expect(getSectionValue('Comment')).toBe('Account warning');
    expect(getSectionValue('Free text notes')).toBe('—');
    expect(changeLinks).toHaveLength(2);
    changeLinks.forEach((link) => {
      expect(link.classList.contains('govuk-link--no-visited-state')).toBe(true);
    });
    expect(component.navigateToAddCommentsPage()).toBe(`../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.comments}/add`);
  });

  it('should display a dash for comment, free text notes in order and two change links when only free text notes exist', () => {
    setCommentsAndDetectChanges({
      account_comment: null,
      free_text_note_1: 'Line 1',
      free_text_note_2: 'Line 2',
      free_text_note_3: 'Line 3',
    });

    const notesText = getSectionValue('Free text notes');
    const changeLinks = getChangeLinks();

    expect(getSectionValue('Comment')).toBe('-');
    expect(notesText.indexOf('Line 1')).toBeLessThan(notesText.indexOf('Line 2'));
    expect(notesText.indexOf('Line 2')).toBeLessThan(notesText.indexOf('Line 3'));
    expect(changeLinks).toHaveLength(2);
    expect(component.navigateToAddCommentsPage()).toBe(`../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.comments}/add`);
  });

  it('should display account comment, free text notes in order and two change links when both comment and notes exist', () => {
    setCommentsAndDetectChanges({
      account_comment: 'Account warning',
      free_text_note_1: 'Line 1',
      free_text_note_2: 'Line 2',
      free_text_note_3: null,
    });

    const notesText = getSectionValue('Free text notes');
    const changeLinks = getChangeLinks();

    expect(getSectionValue('Comment')).toBe('Account warning');
    expect(notesText.indexOf('Line 1')).toBeLessThan(notesText.indexOf('Line 2'));
    expect(changeLinks).toHaveLength(2);
    expect(component.navigateToAddCommentsPage()).toBe(`../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.comments}/add`);
  });

  it('should not render a comments action when the user lacks account maintenance permission', () => {
    setCommentsAndDetectChanges(
      {
        account_comment: 'Account warning',
        free_text_note_1: 'Line 1',
        free_text_note_2: null,
        free_text_note_3: null,
      },
      false,
    );

    const commentsLink = getActionLinks().find((anchor) =>
      ['Change', 'Add comments'].includes(anchor.textContent?.trim() ?? ''),
    );

    expect(commentsLink).toBeFalsy();
  });
});
