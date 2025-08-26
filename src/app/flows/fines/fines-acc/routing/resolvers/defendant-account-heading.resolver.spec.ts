// import { TestBed } from '@angular/core/testing';
// import { ResolveFn } from '@angular/router';
// import { defendantAccountHeadingResolver } from './defendant-account-heading.resolver'
// import { IOpalFinesDefendantAccountHeader } from '../../fines-acc-defendant-details/interfaces/fines-acc-defendant-account-header.interface';
// import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
// import { of } from 'rxjs';
// import { FINES_ACC_DEFENDANT_ACCOUNT_HEADER_MOCK } from '../../fines-acc-defendant-details/mocks/fines-acc-defendant-account-header.mock';
// import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
// import { FinesAccountStoreType } from '../../types/fines-account-store.type';
// import { FinesMacPayloadService } from '../../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
// import { ISessionUserState } from '@hmcts/opal-frontend-common/services/session-service/interfaces';
// import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
// import { FinesAccountStore } from '../../stores/fines-acc.store';

// describe('defendantAccountHeadingResolver', () => {
//   const executeResolver: ResolveFn<IOpalFinesDefendantAccountHeader> = (...resolverParameters) =>
//     TestBed.runInInjectionContext(() => defendantAccountHeadingResolver(...resolverParameters));

//   let globalStore: GlobalStoreType;
//   let accountStore: FinesAccountStoreType;
//   let userState: ISessionUserState;

//   let mockPayloadService: jasmine.SpyObj<FinesMacPayloadService>;
//   let mockOpalFinesService: jasmine.SpyObj<OpalFines>;

//   beforeEach(() => {
//     const mockHeaderData = structuredClone(FINES_ACC_DEFENDANT_ACCOUNT_HEADER_MOCK);
//     mockHeaderData.business_unit_id = '12345';

//     mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['getDefendantAccountHeadingData']);
//     mockOpalFinesService.getDefendantAccountHeadingData.and.returnValue(of(mockHeaderData)).and.callThrough();
//     mockPayloadService = jasmine.createSpyObj('FinesMacPayloadService', ['getBusinessUnitBusinessUserId']);
//     mockPayloadService.getBusinessUnitBusinessUserId.and.returnValue('12345');

//     TestBed.configureTestingModule({
//       providers: [
//         { provide: OpalFines, useValue: mockOpalFinesService },
//         { provide: FinesMacPayloadService, useValue: mockPayloadService },
//         // FinesMacPayloadService
//       ],
//     });

//     globalStore = TestBed.inject(GlobalStore);
//     accountStore = TestBed.inject(FinesAccountStore);
//     userState = globalStore.userState();
//   });

//   it('should call getDefendantAccountHeadingData with the correct permission from route data', async () => {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const route: any = {
//       paramMap: { get: (key: string) => key === 'accountId' ? 12345 : null }
//     };
//     const mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

//     await executeResolver(route, mockRouterStateSnapshot);

//     expect(mockOpalFinesService.getDefendantAccountHeadingData).toHaveBeenCalledWith(12345);
//     expect(mockPayloadService.getBusinessUnitBusinessUserId).toHaveBeenCalled();
//   });
// });


import { TestBed } from '@angular/core/testing';
import { convertToParamMap } from '@angular/router';
import { of, firstValueFrom, Observable } from 'rxjs';

import { defendantAccountHeadingResolver } from './defendant-account-heading.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacPayloadService } from '../../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { IOpalFinesDefendantAccountHeader } from '../../fines-acc-defendant-details/interfaces/fines-acc-defendant-account-header.interface';

class OpalFinesMock {
  getDefendantAccountHeadingData = jasmine.createSpy().and.callFake((id: number) =>
    of({
      account_number: 'ACC-123',
      debtor_type: 'PERSON',
      defendant_account_id: id,
      version: '7',
      title: 'Mrs',
      firstnames: 'Jane',
      surname: 'doe',
      business_unit_id: 12345,
    } as unknown as IOpalFinesDefendantAccountHeader)
  );
}
class GlobalStoreMock { userState = jasmine.createSpy().and.returnValue({}); }
class FinesMacPayloadServiceMock {
  getBusinessUnitBusinessUserId = jasmine.createSpy().and.returnValue('BU-USER-12345');
}
class FinesAccountStoreMock { setAccountState = jasmine.createSpy(); }

describe('defendantAccountHeadingResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useClass: OpalFinesMock },
        { provide: GlobalStore, useClass: GlobalStoreMock },
        { provide: FinesMacPayloadService, useClass: FinesMacPayloadServiceMock },
        { provide: FinesAccountStore, useClass: FinesAccountStoreMock },
      ],
    });
  });

  it('re-runs pipeline and calls payload + store', async () => {
    const route = { paramMap: convertToParamMap({ accountId: '12345' }) } as any;
    const state = {} as any;

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(
        defendantAccountHeadingResolver(route, state) as Observable<IOpalFinesDefendantAccountHeader>
      )
    );

    const fines = TestBed.inject(OpalFines) as unknown as OpalFinesMock;
    const payload = TestBed.inject(FinesMacPayloadService) as unknown as FinesMacPayloadServiceMock;
    const store = TestBed.inject(FinesAccountStore) as unknown as FinesAccountStoreMock;

    expect(fines.getDefendantAccountHeadingData).toHaveBeenCalledWith(12345);
    expect(payload.getBusinessUnitBusinessUserId).toHaveBeenCalledWith(12345, jasmine.any(Object));
    expect(store.setAccountState).toHaveBeenCalledWith({
      account_number: 'ACC-123',
      party_type: 'PERSON',
      party_name: 'Mrs Jane DOE',
      party_id: 12345,
      version: 7,
    });
    expect(result.business_unit_user_id).toBe('BU-USER-12345');
  });
});