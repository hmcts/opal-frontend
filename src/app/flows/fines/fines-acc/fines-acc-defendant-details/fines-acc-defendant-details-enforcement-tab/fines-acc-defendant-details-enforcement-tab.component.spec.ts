import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { FinesAccDefendantDetailsEnforcementTab } from './fines-acc-defendant-details-enforcement-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_ACC_ENF_ACTION_DENIED_TYPES } from '../../fines-acc-enf-action-denied/constants/fines-acc-enf-action-denied-types.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ENF_ACTION_ROUTING_PATHS } from '../../fines-acc-enf-action-select/constants/fines-acc-enf-action-select-routing-paths.constant';
import { FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_ROUTING_PATHS } from '../../fines-acc-enf-override-add-change/constants/fines-acc-enf-override-add-change-routing-paths.constant';
import { FINES_ACC_ENF_COURT_CHANGE_ROUTING_PATHS } from '../../fines-acc-enf-court-change/constants/fines-acc-enf-court-change-routing-paths.constant';

describe('FinesAccDefendantDetailsEnforcementTab', () => {
  let component: FinesAccDefendantDetailsEnforcementTab;
  let fixture: ComponentFixture<FinesAccDefendantDetailsEnforcementTab>;
  const restrictedAccountStatusCodes = ['CS', 'WO', 'TA', 'TS', 'TO'];

  const actionLinks = (): HTMLAnchorElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('div.govuk-grid-column-one-third p > a.govuk-link'));

  const actionLinkTexts = (): string[] => actionLinks().map((link) => link.textContent?.trim() ?? '');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsEnforcementTab],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsEnforcementTab);
    component = fixture.componentInstance;
    component.tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
    component.accountStatusCode = 'L';
    component.accountBalance = 500.58;
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

  it.each(restrictedAccountStatusCodes)(
    'should not render add enforcement action when account status is restricted: %s',
    (accountStatusCode) => {
      fixture.componentRef.setInput('hasEnterEnforcementPermission', true);
      fixture.componentRef.setInput('accountStatusCode', accountStatusCode);
      fixture.detectChanges();

      expect(actionLinkTexts()).not.toContain('Add enforcement action');
    },
  );

  it('should not render add enforcement action when the account balance is zero', () => {
    fixture.componentRef.setInput('hasEnterEnforcementPermission', true);
    fixture.componentRef.setInput('accountBalance', 0);
    fixture.detectChanges();

    expect(actionLinkTexts()).not.toContain('Add enforcement action');
  });

  it.each(['CS', 'WO', 'TA', 'TS'])(
    'should not render request HMRC check when account status is restricted: %s',
    (accountStatusCode) => {
      fixture.componentRef.setInput('hasEnterEnforcementPermission', true);
      fixture.componentRef.setInput('accountStatusCode', accountStatusCode);
      fixture.detectChanges();

      expect(actionLinkTexts()).not.toContain('Request an HMRC check');
    },
  );

  it('should render request HMRC check when account status is TFO Out S/NI', () => {
    fixture.componentRef.setInput('hasEnterEnforcementPermission', true);
    fixture.componentRef.setInput('accountStatusCode', 'TO');
    fixture.detectChanges();

    expect(actionLinkTexts()).toContain('Request an HMRC check');
  });

  it('should not render request HMRC check when the account balance is zero', () => {
    fixture.componentRef.setInput('hasEnterEnforcementPermission', true);
    fixture.componentRef.setInput('accountBalance', 0);
    fixture.detectChanges();

    expect(actionLinkTexts()).not.toContain('Request an HMRC check');
  });

  it('should return the add enforcement override route', () => {
    expect(component.addEnforcementOverrideLink()).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_ROUTING_PATHS.root}/${FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_ROUTING_PATHS.children.add}`,
    );
  });

  it.each(restrictedAccountStatusCodes)(
    'should not render add enforcement override when account status is restricted: %s',
    (accountStatusCode) => {
      const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      tabData.enforcement_override = null;

      fixture.componentRef.setInput('tabData', tabData);
      fixture.componentRef.setInput('hasAccountMaintenancePermission', true);
      fixture.componentRef.setInput('accountStatusCode', accountStatusCode);
      fixture.detectChanges();

      expect(actionLinkTexts()).not.toContain('Add enforcement override');
    },
  );

  it.each(restrictedAccountStatusCodes)(
    'should not render account maintenance summary actions when account status is restricted: %s',
    (accountStatusCode) => {
      fixture.componentRef.setInput('hasAccountMaintenancePermission', true);
      fixture.componentRef.setInput('accountStatusCode', accountStatusCode);
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('#enforcementOverviewDetailsCollection_order_statusActions a'),
      ).toBeNull();
      expect(fixture.nativeElement.querySelector('#enforcementOverviewDetailsEnforcement_courtActions a')).toBeNull();
      expect(
        fixture.nativeElement.querySelector('#enforcementOverrideDetailsEnforcement_overrideActions a'),
      ).toBeNull();
      expect(
        fixture.nativeElement.querySelector('#enforcement-override-summary-card-list .govuk-summary-card__action a'),
      ).toBeNull();
    },
  );

  it.each(restrictedAccountStatusCodes)(
    'should not render remove NOENF when account status is restricted: %s',
    (accountStatusCode) => {
      const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      tabData.last_enforcement_action!.enforcement_action.result_id = 'NOENF';

      fixture.componentRef.setInput('tabData', tabData);
      fixture.componentRef.setInput('hasEnterEnforcementPermission', true);
      fixture.componentRef.setInput('accountStatusCode', accountStatusCode);
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('#lastEnforcementActionDetailsEnforcement_actionActions a'),
      ).toBeNull();
    },
  );

  it('should navigate to the change enforcement override route', () => {
    const router = TestBed.inject(Router);
    const routerNavigateSpy = vi.spyOn(router, 'navigate');

    component.handleChangeEnforcementOverride();

    expect(routerNavigateSpy).toHaveBeenCalledWith(
      [
        `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_ROUTING_PATHS.root}/${FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_ROUTING_PATHS.children.change}`,
      ],
      {
        relativeTo: component['activatedRoute'],
      },
    );
  });

  it('should navigate to the change enforcement court route', () => {
    const router = TestBed.inject(Router);
    const routerNavigateSpy = vi.spyOn(router, 'navigate');

    component.handleChangeEnforcementCourt();

    expect(routerNavigateSpy).toHaveBeenCalledWith(
      [
        `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_COURT_CHANGE_ROUTING_PATHS.root}/${FINES_ACC_ENF_COURT_CHANGE_ROUTING_PATHS.children.change}`,
      ],
      {
        relativeTo: component['activatedRoute'],
      },
    );
  });

  it('should navigate to the remove enforcement override route', () => {
    const router = TestBed.inject(Router);
    const routerNavigateSpy = vi.spyOn(router, 'navigate');

    component.handleRemoveEnforcementOverride(component.removeEnforcementOverrideLink());

    expect(routerNavigateSpy).toHaveBeenCalledWith(
      [
        `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_ROUTING_PATHS.root}/${FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_ROUTING_PATHS.children.remove}`,
      ],
      {
        relativeTo: component['activatedRoute'],
      },
    );
  });

  it('should navigate to the remove enforcement hold route', () => {
    const router = TestBed.inject(Router);
    const routerNavigateSpy = vi.spyOn(router, 'navigate');

    component.handleRemoveEnforcementHold();

    expect(routerNavigateSpy).toHaveBeenCalledWith(
      [
        `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.root}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children.remove}`,
      ],
      {
        relativeTo: component['activatedRoute'],
      },
    );
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

  it('should navigate to the change collection order route with the current flag', () => {
    const router = TestBed.inject(Router);
    const routerNavigateSpy = vi.spyOn(router, 'navigate');

    component.handleChangeCollectionOrder();

    expect(routerNavigateSpy).toHaveBeenCalledWith(
      [`../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/collection-order/change`],
      {
        relativeTo: component['activatedRoute'],
        state: {
          currentCollectionOrderFlag:
            component.tabData.enforcement_overview.collection_order?.collection_order_flag ?? false,
        },
      },
    );
  });

  it('should navigate with a false collection order flag when collection order is missing', () => {
    const router = TestBed.inject(Router);
    const routerNavigateSpy = vi.spyOn(router, 'navigate');
    component.tabData = {
      ...component.tabData,
      enforcement_overview: {
        ...component.tabData.enforcement_overview,
        collection_order: null,
      },
    };

    component.handleChangeCollectionOrder();

    expect(routerNavigateSpy).toHaveBeenCalledWith(
      [`../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/collection-order/change`],
      {
        relativeTo: component['activatedRoute'],
        state: { currentCollectionOrderFlag: false },
      },
    );
  });
});
