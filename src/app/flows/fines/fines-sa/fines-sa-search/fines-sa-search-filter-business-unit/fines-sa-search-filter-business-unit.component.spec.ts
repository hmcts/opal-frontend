// PO-711 – Filter by Business Unit (CT)
import { mount } from 'cypress/angular';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FinesSaStore } from 'src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesSaSearchFilterBusinessUnitComponent } from
  'src/app/flows/fines/fines-sa/fines-sa-search/fines-sa-search-filter-business-unit/fines-sa-search-filter-business-unit.component';

import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from
  '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';

// If you’re testing the *form* directly, swap the import above for the Form component:
/// import { FinesSaSearchFilterBusinessUnitForm } from '.../fines-sa-search-filter-business-unit-form.component';

describe('Search For Account – Filter by BU', () => {
  const resolverPayload = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK; // { refData: IOpalFinesBusinessUnit[] }

  const setupComponent = (formSubmit: any = null) => {
    const componentProperties: any = {};
    if (formSubmit) componentProperties.handleSearchAccountSubmit = formSubmit;

    // “All selected” == every id from resolver
    const preselectedIds = resolverPayload.refData.map(bu => bu.business_unit_id);

    mount(FinesSaSearchFilterBusinessUnitComponent, {
      // If mounting the *Form* instead, replace the component here and in routes below
      providers: [
        provideHttpClient(),
        provideRouter([
          { path: 'fines/search-accounts', component: FinesSaSearchFilterBusinessUnitComponent },
          { path: 'fines/search-accounts/filter-business-units', component: FinesSaSearchFilterBusinessUnitComponent },
        ]),
        OpalFines, // keep parity with other specs
        {
          provide: FinesSaStore,
          useFactory: () => {
            const store = new FinesSaStore();
            // No setSearchAccount(); we only seed the BU selection for this page
            store.setBusinessUnitIds(preselectedIds);
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: { businessUnits: resolverPayload } }, // same shape as the unit test
            parent: { snapshot: { url: [{ path: 'search' }] } },    // lets router.navigate work relatively
            fragment: of('individuals'), // harmless if unused
          },
        },
      ],
      componentProperties,
    });
  };

  it('mounts with resolver data and all BUs pre-selected', () => {
    setupComponent();
    // your assertions go here
  });
});
