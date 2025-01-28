import { mount } from 'cypress/angular';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FinesMacCourtDetailsComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-court-details/fines-mac-court-details.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { of } from 'rxjs';

describe('FinesMacParentGuardianDetailsComponent', () => {
  const setupComponent = (formSubmit: any) => {
    let MockFinesService = {
      finesMacState: { ...FINES_MAC_STATE_MOCK },
    };
    MockFinesService.finesMacState.businessUnit.business_unit_id = 73;

    const mockOpalFinesService = {
      getLocalJusticeAreas: () => of(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK),
      getLocalJusticeAreaPrettyName: (item: any) => `${item.name} (${item.lja_code})`,
      getCourts: () => of(OPAL_FINES_COURT_REF_DATA_MOCK),
      getCourtPrettyName: (item: any) => `${item.name} (${item.court_code})`,
    };

    mount(FinesMacCourtDetailsComponent, {
      providers: [
        { provide: FinesService, useValue: MockFinesService },
        { provide: OpalFines, useValue: mockOpalFinesService },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              snapshot: {
                url: [{ path: 'manual-account-creation' }],
              },
            },
          },
        },
      ],
      componentProperties: {
        handleCourtDetailsSubmit: formSubmit,
      },
    });
  };

  it('should render the child component', () => {
    setupComponent(null);

    // Verify the child component is rendered
    cy.get('app-fines-mac-court-details-form').should('exist');
  });
});
