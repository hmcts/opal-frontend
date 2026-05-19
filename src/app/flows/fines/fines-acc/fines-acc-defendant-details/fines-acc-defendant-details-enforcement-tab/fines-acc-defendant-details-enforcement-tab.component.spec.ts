import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FinesAccDefendantDetailsEnforcementTab } from './fines-acc-defendant-details-enforcement-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_ACC_ENF_ACTION_DENIED_TYPES } from '../../fines-acc-enf-action-denied/constants/fines-acc-enf-action-denied-types.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ENF_ACTION_ROUTING_PATHS } from '../../fines-acc-enf-action-select/constants/fines-acc-enf-action-select-routing-paths.constant';

describe('FinesAccDefendantDetailsEnforcementTab', () => {
  let component: FinesAccDefendantDetailsEnforcementTab;
  let fixture: ComponentFixture<FinesAccDefendantDetailsEnforcementTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsEnforcementTab],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsEnforcementTab);
    component = fixture.componentInstance;
    component.tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
    component.accountStatusCode = 'L';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enforce action link template semantics', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const templateConsts = ((FinesAccDefendantDetailsEnforcementTab as any).ɵcmp?.consts ?? []).filter(
      (entry: unknown) => Array.isArray(entry),
    ) as unknown[][];
    const templateFunction =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((FinesAccDefendantDetailsEnforcementTab as any).ɵcmp?.template?.toString() as string | undefined) ?? '';
    const actionLinkConsts = templateConsts.filter(
      (entry) => entry.includes('govuk-link') && entry.includes('govuk-link--no-visited-state'),
    );

    expect(actionLinkConsts.length).toBeGreaterThan(0);
    actionLinkConsts.forEach((entry) => {
      expect(entry).not.toContain('tabindex');
    });
    expect(templateFunction).not.toContain('handleAddEnforcementAction');
    expect(templateFunction).not.toContain('keydown.enter');
    expect(templateFunction).not.toContain('keyup.enter');
  });

  it('should render action links with no visited state and no tabindex', () => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
    tabData.enforcement_override = null;

    fixture.componentRef.setInput('tabData', tabData);
    fixture.componentRef.setInput('hasAccountMaintenancePermission', true);
    fixture.componentRef.setInput('hasEnterEnforcementPermission', true);
    fixture.detectChanges();

    const actionLinks = Array.from(
      fixture.nativeElement.querySelectorAll('div.govuk-grid-column-one-third p > a.govuk-link'),
    ) as HTMLAnchorElement[];

    expect(actionLinks).toHaveLength(3);
    expect(actionLinks.map((link) => link.textContent?.trim())).toEqual([
      'Add enforcement action',
      'Add enforcement override',
      'Request an HMRC check',
    ]);

    actionLinks.forEach((link) => {
      expect(link.classList.contains('govuk-link--no-visited-state')).toBe(true);
      expect(link.getAttribute('tabindex')).toBeNull();
    });
  });

  it('should emit add enforcement override when add enforcement override is clicked', () => {
    const emitSpy = vi.spyOn(component.addEnforcementOverride, 'emit');
    const event = { preventDefault: vi.fn() } as unknown as Event;
    component.hasAccountMaintenancePermission = true;
    component.tabData.enforcement_override = null;

    component.handleAddEnforcementOverride(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should route add enforcement action to select when permitted', () => {
    component.hasEnterEnforcementPermission = true;

    expect(component.addEnforcementActionRoute).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.root}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children.select}`,
    );
  });

  it('should route add enforcement action to permission denied when enter enforcement permission is missing', () => {
    expect(component.addEnforcementActionRoute).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.root}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children.denied}/${FINES_ACC_ENF_ACTION_DENIED_TYPES.permission}`,
    );
  });

  it('should route add enforcement action to account-status denied when blocked by account status', () => {
    component.hasEnterEnforcementPermission = true;
    component.accountStatusCode = 'CS';

    expect(component.addEnforcementActionRoute).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.root}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children.denied}/${FINES_ACC_ENF_ACTION_DENIED_TYPES.accountStatus}`,
    );
  });

  it('should route add enforcement action to account-status denied when account status is transferred out', () => {
    component.hasEnterEnforcementPermission = true;
    component.accountStatusCode = 'TO';

    expect(component.addEnforcementActionRoute).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.root}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children.denied}/${FINES_ACC_ENF_ACTION_DENIED_TYPES.accountStatus}`,
    );
  });

  it('should route add enforcement action to enforcement-hold denied when last enforcement is NOENF', () => {
    component.hasEnterEnforcementPermission = true;
    component.tabData.last_enforcement_action = {
      ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK.last_enforcement_action)!,
      enforcement_action: {
        result_id: 'NOENF',
        result_title: 'No enforcement',
      },
    };

    expect(component.addEnforcementActionRoute).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.root}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children.denied}/${FINES_ACC_ENF_ACTION_DENIED_TYPES.enforcementHold}`,
    );
  });

  it('should route add enforcement action to no-next-actions denied when no next permitted actions exist', () => {
    component.hasEnterEnforcementPermission = true;
    component.tabData.next_enforcement_action_data = null;

    expect(component.addEnforcementActionRoute).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.root}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children.denied}/${FINES_ACC_ENF_ACTION_DENIED_TYPES.noNextActions}`,
    );
  });

  it('should permit add enforcement action when all next actions are permitted', () => {
    component.hasEnterEnforcementPermission = true;
    component.tabData.next_enforcement_action_data = 'all';

    expect(component.addEnforcementActionRoute).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.root}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children.select}`,
    );
  });

  it('should permit add enforcement action when there is no last enforcement action', () => {
    component.hasEnterEnforcementPermission = true;
    component.tabData.last_enforcement_action = null;
    component.tabData.next_enforcement_action_data = null;

    expect(component.addEnforcementActionRoute).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.root}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children.select}`,
    );
  });

  it('should emit change enforcement override when requested', () => {
    const emitSpy = vi.spyOn(component.changeEnforcementOverride, 'emit');
    component.handleChangeEnforcementOverride();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit when handleChangeEnforcementCourt is called', () => {
    const emitSpy = vi.spyOn(component.changeEnforcementCourt, 'emit');
    component.handleChangeEnforcementCourt();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit when handleRemoveEnforcementOverride is called', () => {
    const emitSpy = vi.spyOn(component.removeEnforcementOverride, 'emit');
    component.handleRemoveEnforcementOverride();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not render actions when permissions are missing', () => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
    tabData.enforcement_override = null;

    fixture.componentRef.setInput('tabData', tabData);
    fixture.componentRef.setInput('hasAccountMaintenancePermission', false);
    fixture.componentRef.setInput('hasEnterEnforcementPermission', false);
    fixture.detectChanges();

    const actionLinks = Array.from(
      fixture.nativeElement.querySelectorAll('div.govuk-grid-column-one-third p > a.govuk-link'),
    ) as HTMLAnchorElement[];

    expect(actionLinks).toHaveLength(0);
  });

  it('should emit collection order flag when handleChangeCollectionOrder is called', () => {
    const emitSpy = vi.spyOn(component.changeCollectionOrder, 'emit');
    component.handleChangeCollectionOrder();

    expect(emitSpy).toHaveBeenCalledWith(
      component.tabData.enforcement_overview.collection_order?.collection_order_flag ?? false,
    );
  });

  it('should emit false when collection order is missing', () => {
    const emitSpy = vi.spyOn(component.changeCollectionOrder, 'emit');
    component.tabData = {
      ...component.tabData,
      enforcement_overview: {
        ...component.tabData.enforcement_overview,
        collection_order: null,
      },
    };

    component.handleChangeCollectionOrder();

    expect(emitSpy).toHaveBeenCalledWith(false);
  });
});
