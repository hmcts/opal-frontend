import type { Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { nextPermittedEnfActionsResolver } from './defendant-account-next-permitted-enf-actions.resolver';
import { FINES_ACC_ENF_ACTION_SELECT_ENFORCEMENT_STATUS_MOCK } from '../../fines-acc-enf-action-select/mocks/fines-acc-enf-action-select-enforcement-status.mock';
import { FINES_ACC_ENF_ACTION_SELECT_NEXT_PERMITTED_ENF_ACTIONS_MOCK } from '../../fines-acc-enf-action-select/mocks/fines-acc-enf-action-select-next-permitted-enf-actions.mock';

describe('nextPermittedEnfActionsResolver', () => {
  const emptyResultsResponse: IOpalFinesResultsRefData = {
    count: 0,
    refData: [],
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  let mockRoute: ActivatedRouteSnapshot;

  beforeEach(() => {
    const opalFinesServiceSpy = {
      getDefendantAccountEnforcementStatus: vi.fn().mockName('OpalFines.getDefendantAccountEnforcementStatus'),
      getResults: vi.fn().mockName('OpalFines.getResults'),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: opalFinesServiceSpy }],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockOpalFinesService = TestBed.inject(OpalFines) as any;

    mockRoute = {
      paramMap: {
        get: vi.fn(),
      },
    } as unknown as ActivatedRouteSnapshot;
  });

  it('should fetch filtered results for permitted actions on the last enforcement action', async () => {
    (mockRoute.paramMap.get as Mock).mockReturnValue('12345');
    mockOpalFinesService.getDefendantAccountEnforcementStatus.mockReturnValue(
      of(FINES_ACC_ENF_ACTION_SELECT_ENFORCEMENT_STATUS_MOCK),
    );
    mockOpalFinesService.getResults.mockReturnValue(of(FINES_ACC_ENF_ACTION_SELECT_NEXT_PERMITTED_ENF_ACTIONS_MOCK));

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(nextPermittedEnfActionsResolver(mockRoute, {} as never) as never),
    );

    expect(mockOpalFinesService.getDefendantAccountEnforcementStatus).toHaveBeenCalledWith(12345);
    expect(mockOpalFinesService.getResults).toHaveBeenCalledWith(['WOC', 'WOA']);
    expect(result).toEqual(FINES_ACC_ENF_ACTION_SELECT_NEXT_PERMITTED_ENF_ACTIONS_MOCK);
  });

  it('should pass through all permitted action ids when the status payload contains them', async () => {
    const enforcementStatus = structuredClone(FINES_ACC_ENF_ACTION_SELECT_ENFORCEMENT_STATUS_MOCK);
    enforcementStatus.last_enforcement_action = null;
    enforcementStatus.next_enforcement_action_data = 'NOENF, PRIS, WOC';

    (mockRoute.paramMap.get as Mock).mockReturnValue('12345');
    mockOpalFinesService.getDefendantAccountEnforcementStatus.mockReturnValue(of(enforcementStatus));
    mockOpalFinesService.getResults.mockReturnValue(of(FINES_ACC_ENF_ACTION_SELECT_NEXT_PERMITTED_ENF_ACTIONS_MOCK));

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(nextPermittedEnfActionsResolver(mockRoute, {} as never) as never),
    );

    expect(mockOpalFinesService.getResults).toHaveBeenCalledWith(['NOENF', 'PRIS', 'WOC']);
    expect(result).toEqual(FINES_ACC_ENF_ACTION_SELECT_NEXT_PERMITTED_ENF_ACTIONS_MOCK);
  });

  it('should fetch all enforcement results when the status payload permits all actions', async () => {
    const enforcementStatus = structuredClone(FINES_ACC_ENF_ACTION_SELECT_ENFORCEMENT_STATUS_MOCK);
    enforcementStatus.next_enforcement_action_data = ' all ';

    (mockRoute.paramMap.get as Mock).mockReturnValue('12345');
    mockOpalFinesService.getDefendantAccountEnforcementStatus.mockReturnValue(of(enforcementStatus));
    mockOpalFinesService.getResults.mockReturnValue(of(FINES_ACC_ENF_ACTION_SELECT_NEXT_PERMITTED_ENF_ACTIONS_MOCK));

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(nextPermittedEnfActionsResolver(mockRoute, {} as never) as never),
    );

    expect(mockOpalFinesService.getResults).toHaveBeenCalledWith([], {
      enforcement: true,
      enforcement_override: false,
    });
    expect(result).toEqual(FINES_ACC_ENF_ACTION_SELECT_NEXT_PERMITTED_ENF_ACTIONS_MOCK);
  });

  it('should request results with an empty id list when the status payload does not contain ids', async () => {
    const enforcementStatus = structuredClone(FINES_ACC_ENF_ACTION_SELECT_ENFORCEMENT_STATUS_MOCK);
    enforcementStatus.next_enforcement_action_data = null;

    (mockRoute.paramMap.get as Mock).mockReturnValue('12345');
    mockOpalFinesService.getDefendantAccountEnforcementStatus.mockReturnValue(of(enforcementStatus));
    mockOpalFinesService.getResults.mockReturnValue(of(emptyResultsResponse));

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(nextPermittedEnfActionsResolver(mockRoute, {} as never) as never),
    );

    expect(mockOpalFinesService.getResults).toHaveBeenCalledWith([]);
    expect(result).toEqual(emptyResultsResponse);
  });
});
