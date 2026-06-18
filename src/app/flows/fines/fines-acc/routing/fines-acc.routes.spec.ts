import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { routing } from './fines-acc.routes';
import {
  BUSINESS_UNIT_ID_RESOLVER,
  businessUnitRoutePermissionsGuard,
} from '@hmcts/opal-frontend-common/guards/business-unit-route-permissions';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from './constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from './constants/fines-acc-minor-creditor-routing-paths.constant';
import { FINES_ACC_MAJOR_CREDITOR_ROUTING_PATHS } from './constants/fines-acc-major-creditor-routing-paths.constant';
import { FINES_ACC_MAJOR_CREDITOR_ROUTING_TITLES } from './constants/fines-acc-major-creditor-routing-titles.constant';
import { FINES_ACC_ENF_COURT_CHANGE_ROUTING_PATHS } from '../fines-acc-enf-court-change/constants/fines-acc-enf-court-change-routing-paths.constant';
import { FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_ROUTING_PATHS } from '../fines-acc-enf-override-add-change/constants/fines-acc-enf-override-add-change-routing-paths.constant';
import { HIDE_PRIMARY_NAV_ROUTE_DATA_KEY } from '@app/constants/route-data.constant';
import { minorCreditorAccountCreditorResolver } from './resolvers/defendant-minor-creditor-creditor.resolver';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { FINES_ACC_ENF_ACTION_ROUTING_PATHS } from '../fines-acc-enf-action-select/constants/fines-acc-enf-action-select-routing-paths.constant';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FinesAccEnfActionAddService } from '../fines-acc-enf-action-add/services/fines-acc-enf-action-add.service';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { createFinesAccEnfActionAddActivatedRouteMock } from '../fines-acc-enf-action-add/mocks/fines-acc-enf-action-add-activated-route.mock';
import { FINES_ACC_ENF_ACTION_ADD_STORE_MOCK } from '../fines-acc-enf-action-add/mocks/fines-acc-enf-action-add-store.mock';
import { FINES_ACC_ENF_ACTION_ADD_PAYLOAD_SERVICE_MOCK } from '../fines-acc-enf-action-add/mocks/fines-acc-enf-action-add-payload-service.mock';
import { FINES_ACC_ENF_ACTION_ADD_SERVICE_MOCK } from '../fines-acc-enf-action-add/mocks/fines-acc-enf-action-add-service.mock';
import { FINES_ACC_ENF_ACTION_ADD_OPAL_FINES_SERVICE_MOCK } from '../fines-acc-enf-action-add/mocks/fines-acc-enf-action-add-opal-fines-service.mock';
import { FINES_ACC_ENF_ACTION_ADD_ACCOUNT_STATE_MOCK } from '../fines-acc-enf-action-add/mocks/fines-acc-enf-action-add-account-state.mock';
import { FINES_ACC_REMOVE_NON_PAYING_PG_ROUTING_PATHS } from '../fines-acc-remove-non-paying-pg/constants/fines-acc-remove-non-paying-pg-routing-paths.constant';
import { finesAccStateGuard } from './guards/fines-acc-state-guard/fines-acc-state.guard';
import { FinesAccBusinessUnitResolver } from './resolvers/fines-acc-business-unit.resolver';
import { FINES_ACCOUNT_ROUTE_TYPES } from './resolvers/types/fines-acc-route.type';

describe('fines acc routes', () => {
  const defendantRoute = routing.find((route) => route.path === `${FINES_ACC_DEFENDANT_ROUTING_PATHS.root}/:accountId`);
  const defendantJourneyGroup = defendantRoute?.children?.find(
    (route) => route.path === '' && route.data?.[HIDE_PRIMARY_NAV_ROUTE_DATA_KEY] === true,
  );

  const minorCreditorRoute = routing.find(
    (route) => route.path === `${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.root}/:accountId`,
  );
  const minorCreditorJourneyGroup = minorCreditorRoute?.children?.find(
    (route) => route.path === '' && route.data?.[HIDE_PRIMARY_NAV_ROUTE_DATA_KEY] === true,
  );
  const majorCreditorRoute = routing.find(
    (route) => route.path === `${FINES_ACC_MAJOR_CREDITOR_ROUTING_PATHS.root}/:accountId`,
  );

  it('should keep primary navigation visible on defendant details browse routes', () => {
    const detailsRoute = defendantRoute?.children?.find(
      (route) => route.path === FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
    );

    expect(detailsRoute?.data?.[HIDE_PRIMARY_NAV_ROUTE_DATA_KEY]).toBeUndefined();
  });

  it('should mark the defendant and minor creditor account routes with their account types', () => {
    expect(defendantRoute?.data?.['accountType']).toBe(FINES_ACCOUNT_ROUTE_TYPES.defendant);
    expect(minorCreditorRoute?.data?.['accountType']).toBe(FINES_ACCOUNT_ROUTE_TYPES.minorCreditor);
  });

  it('should scope the business unit resolver provider to account routes that use business unit permissions', () => {
    const businessUnitResolverProvider = {
      provide: BUSINESS_UNIT_ID_RESOLVER,
      useExisting: FinesAccBusinessUnitResolver,
    };

    expect(defendantRoute?.providers).toEqual([businessUnitResolverProvider]);
    expect(minorCreditorRoute?.providers).toEqual([businessUnitResolverProvider]);
    expect(majorCreditorRoute?.providers).toBeUndefined();
  });

  it('should hide primary navigation for defendant account maintenance journeys', () => {
    const defendantJourneyPaths = (defendantJourneyGroup?.children ?? []).map((route) => route.path);

    expect(defendantJourneyGroup?.data?.[HIDE_PRIMARY_NAV_ROUTE_DATA_KEY]).toBe(true);
    expect(defendantJourneyPaths).toEqual(
      expect.arrayContaining([
        `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.convert}/:partyType`,
        `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.note}/add`,
        `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.comments}/add`,
        `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-terms']}/amend`,
        `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-terms']}/denied/:type`,
        `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['party']}/:partyType/:mode`,
        `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.remove}/${FINES_ACC_REMOVE_NON_PAYING_PG_ROUTING_PATHS.root}/${FINES_ACC_REMOVE_NON_PAYING_PG_ROUTING_PATHS.children.parentGuardian}`,
        `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-card']}/request`,
        `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-card']}/denied/:type`,
        `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_ROUTING_PATHS.root}/${FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_ROUTING_PATHS.children.add}`,
        `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.root}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children.select}`,
        `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.root}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children.denied}/:type`,
        `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_COURT_CHANGE_ROUTING_PATHS.root}/${FINES_ACC_ENF_COURT_CHANGE_ROUTING_PATHS.children.change}`,
      ]),
    );
  });

  it('should hide primary navigation for minor creditor note journeys', () => {
    const minorCreditorJourneyPaths = (minorCreditorJourneyGroup?.children ?? []).map((route) => route.path);

    expect(minorCreditorJourneyGroup?.data?.[HIDE_PRIMARY_NAV_ROUTE_DATA_KEY]).toBe(true);
    expect(minorCreditorJourneyPaths).toEqual(
      expect.arrayContaining([`${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.note}/add`]),
    );
  });

  it('should load the add enforcement action component through the lazy route factory', async () => {
    vi.clearAllMocks();
    FINES_ACC_ENF_ACTION_ADD_PAYLOAD_SERVICE_MOCK.transformDefendantAccountHeaderForStore.mockReturnValue(
      FINES_ACC_ENF_ACTION_ADD_ACCOUNT_STATE_MOCK,
    );
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: createFinesAccEnfActionAddActivatedRouteMock() },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: FinesAccountStore, useValue: FINES_ACC_ENF_ACTION_ADD_STORE_MOCK },
        { provide: FinesAccPayloadService, useValue: FINES_ACC_ENF_ACTION_ADD_PAYLOAD_SERVICE_MOCK },
        { provide: FinesAccEnfActionAddService, useValue: FINES_ACC_ENF_ACTION_ADD_SERVICE_MOCK },
        { provide: OpalFines, useValue: FINES_ACC_ENF_ACTION_ADD_OPAL_FINES_SERVICE_MOCK },
      ],
    });
    const addRoute = (defendantJourneyGroup?.children ?? []).find(
      (route) =>
        route.path ===
        `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.root}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children.add}`,
    );
    const componentType = (await addRoute?.loadComponent?.()) as unknown as { ɵfac: () => unknown };

    const componentInstance = TestBed.runInInjectionContext(() => componentType.ɵfac());

    expect(componentInstance).toBeInstanceOf(componentType);
  });

  it('should resolve creditor data for the minor creditor amend journey', () => {
    const amendRoute = minorCreditorRoute?.children?.find(
      (route) => route.path === FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.amend,
    );

    expect(amendRoute?.canActivate).toEqual([authGuard, businessUnitRoutePermissionsGuard, finesAccStateGuard]);
    expect(amendRoute?.resolve?.['minorCreditorAccountCreditor']).toBe(minorCreditorAccountCreditorResolver);
  });

  it('should protect the minor creditor amend journey from losing unsaved changes', () => {
    const amendRoute = minorCreditorRoute?.children?.find(
      (route) => route.path === FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.amend,
    );

    expect(amendRoute?.canDeactivate).toContain(canDeactivateGuard);
  });

  it('should route to the major creditor details placeholder page', () => {
    const detailsRoute = majorCreditorRoute?.children?.find(
      (route) => route.path === FINES_ACC_MAJOR_CREDITOR_ROUTING_PATHS.children.details,
    );

    expect(detailsRoute?.data?.['title']).toBe(FINES_ACC_MAJOR_CREDITOR_ROUTING_TITLES.children.details);
    expect(detailsRoute?.resolve?.['title']).toBeTruthy();
  });
});
