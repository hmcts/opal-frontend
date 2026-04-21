import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccDefendantDetailsEnforcementTab } from './fines-acc-defendant-details-enforcement-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesAccDefendantDetailsEnforcementTab', () => {
  let component: FinesAccDefendantDetailsEnforcementTab;
  let fixture: ComponentFixture<FinesAccDefendantDetailsEnforcementTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsEnforcementTab],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsEnforcementTab);
    component = fixture.componentInstance;
    component.tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
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
      (entry) =>
        entry.includes('govuk-link') && entry.includes('govuk-link--no-visited-state') && entry.includes('href'),
    );

    expect(actionLinkConsts.length).toBeGreaterThan(0);
    actionLinkConsts.forEach((entry) => {
      expect(entry).toContain('href');
      expect(entry).toContain('');
      expect(entry).not.toContain('tabindex');
    });
    expect(templateFunction).not.toContain('keydown.enter');
    expect(templateFunction).not.toContain('keyup.enter');
  });

  it('should render action links with empty href, no visited state, and no tabindex', () => {
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
      expect(link.getAttribute('href')).toBe('');
      expect(link.getAttribute('tabindex')).toBeNull();
    });
  });

  it('should handleAddEnforcementOverride when add enforcement override button is clicked', () => {
    const eventEmitterSpy = vi.spyOn(component.addEnforcementOverride, 'emit');
    const event = { preventDefault: vi.fn() } as unknown as Event;
    component.hasAccountMaintenancePermission = true;
    component.tabData.enforcement_override = null; // Ensure there is no existing enforcement override result
    component.handleAddEnforcementOverride(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(eventEmitterSpy).toHaveBeenCalled();
  });

  it('should emit addEnforcementAction when handleAddEnforcementAction is called', () => {
    const emitSpy = vi.spyOn(component.addEnforcementAction, 'emit');
    const event = { preventDefault: vi.fn() } as unknown as Event;

    component.handleAddEnforcementAction(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit changeEnforcementOverride when user has permission and an override result exists', () => {
    const emitSpy = vi.spyOn(component.changeEnforcementOverride, 'emit');

    component.hasAccountMaintenancePermission = true;
    component.handleChangeEnforcementOverride();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit when handleChangeEnforcementCourt is called', () => {
    const eventEmitterSpy = vi.spyOn(component.changeEnforcementCourt, 'emit');
    component.hasAccountMaintenancePermission = true;

    component.handleChangeEnforcementCourt();

    expect(eventEmitterSpy).toHaveBeenCalled();
  });

  it('should emit when handleRemoveEnforcementOverride is called', () => {
    const eventEmitterSpy = vi.spyOn(component.removeEnforcementOverride, 'emit');
    component.hasAccountMaintenancePermission = true;

    component.handleRemoveEnforcementOverride();

    expect(eventEmitterSpy).toHaveBeenCalled();
  });

  it('should emit changeCollectionOrder when handleChangeCollectionOrder is called', () => {
    const eventEmitterSpy = vi.spyOn(component.changeCollectionOrder, 'emit');
    component.hasAccountMaintenancePermission = true;

    component.handleChangeCollectionOrder();

    expect(eventEmitterSpy).toHaveBeenCalledWith(
      component.tabData.enforcement_overview.collection_order?.collection_order_flag ?? false,
    );
  });
});
