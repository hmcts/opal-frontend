import { mount } from 'cypress/angular';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { FinesConConsolidateAccComponent } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-consolidate-acc/fines-con-consolidate-acc.component';
import { FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-account/mocks/fines-con-search-account-form-empty.mock';
import { FINES_CON_SELECT_BU_FORM_COMPANY_MOCK } from 'src/app/flows/fines/fines-con/select-business-unit/fines-con-select-bu/mocks/fines-con-select-bu-form-company.mock';
import { FINES_CON_SELECT_BU_FORM_DATA_MOCK } from 'src/app/flows/fines/fines-con/select-business-unit/fines-con-select-bu/mocks/fines-con-select-bu-form-data.mock';
import { FinesConStore } from 'src/app/flows/fines/fines-con/stores/fines-con.store';
import { IFinesConSearchAccountState } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-account/interfaces/fines-con-search-account-state.interface';
import { IComponentProperties } from './setupComponent.interface';

export const setupConsolidationComponent = (componentProperties: IComponentProperties = {}) => {
  const fragment = componentProperties.fragments ?? 'search';
  const defendantType = componentProperties.defendantType ?? 'individual';
  const initialResults = structuredClone(componentProperties.initialResults ?? []);

  const finesConSelectBuFormData =
    defendantType === 'company'
      ? structuredClone(FINES_CON_SELECT_BU_FORM_COMPANY_MOCK.formData)
      : structuredClone(FINES_CON_SELECT_BU_FORM_DATA_MOCK);

  const searchAccountFormData: IFinesConSearchAccountState = structuredClone(
    componentProperties.searchAccountFormData ?? FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK.formData,
  );

  return mount(FinesConConsolidateAccComponent, {
    providers: [
      provideRouter([]),
      {
        provide: FinesConStore,
        useFactory: () => {
          const store = new FinesConStore();
          store.updateSelectBuForm(finesConSelectBuFormData);
          store.updateSearchAccountFormTemporary(searchAccountFormData);
          if (defendantType === 'company') {
            store.updateDefendantResults([], initialResults);
          } else {
            store.updateDefendantResults(initialResults, []);
          }
          store.setActiveTab(fragment);

          if (componentProperties.updateSearchSpy) {
            const updateSearchSpy = componentProperties.updateSearchSpy;
            const originalUpdate = store.updateSearchAccountFormTemporary.bind(store);
            store.updateSearchAccountFormTemporary = (formData: IFinesConSearchAccountState) => {
              updateSearchSpy(formData);
              originalUpdate(formData);
            };
          }

          return store;
        },
      },
      {
        provide: ActivatedRoute,
        useValue: {
          parent: {},
          fragment: of(fragment),
          snapshot: {
            data: {
              businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
            },
          },
        },
      },
    ],
  }).then(({ fixture }) => {
    const store = fixture.componentRef.injector.get(FinesConStore);
    cy.wrap(store).as('finesConStore');
    cy.wrap(fixture).as('consolidationFixture');

    if (!componentProperties.setupRouterSpy) {
      return;
    }

    const router = fixture.componentRef.injector.get(Router);
    cy.spy(router, 'navigate').as('routerNavigate');
  });
};
