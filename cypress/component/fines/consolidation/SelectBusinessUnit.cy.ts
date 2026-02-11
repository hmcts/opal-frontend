// import { mount } from 'cypress/angular';
// import { FinesConSelectBuFormComponent } from 'src/app/flows/fines/fines-con/select-business-unit/fines-con-select-bu/fines-con-select-bu-form/fines-con-select-bu-form.component';
// import { of } from 'rxjs';
// import { ActivatedRoute } from '@angular/router';
// import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
// import { provideHttpClient } from '@angular/common/http';
// import { FinesConStore } from 'src/app/flows/fines/fines-con/stores/fines-con.store';
// import { FINES_CON_SELECT_BU_FORM_DATA_MOCK } from 'src/app/flows/fines/fines-con/select-business-unit/fines-con-select-bu/mocks/fines-con-select-bu-form-data.mock';
// import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
// import { SelectBusinessUnitLocators } from 'cypress/shared/selectors/consolidation/SelectBusinessUnit.locators';
// import {
//   USER_STATE_MOCK_NO_PERMISSION,
//   USER_STATE_MOCK_PERMISSION_BU17,
//   USER_STATE_MOCK_PERMISSION_BU77,
// } from '../../CommonIntercepts/CommonUserState.mocks';
// import { interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';

// describe('FinesConSelectBuFormComponent', () => {
//   const setupComponent = (formSubmit?: any) => {
//     return mount(FinesConSelectBuFormComponent, {
//       providers: [
//         OpalFines,
//         provideHttpClient(),
//         {
//           provide: FinesConStore,
//           useFactory: () => {
//             const store = new FinesConStore();
//             store.updateSelectBuForm(FINES_CON_SELECT_BU_FORM_DATA_MOCK);
//             return store;
//           },
//         },
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             parent: of('consolidation'),
//             snapshot: {
//               data: {
//                 businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
//               },
//             },
//           },
//         },
//       ],
//       componentProperties: {},
//     }).then(({ fixture }) => {
//       if (!formSubmit) {
//         return;
//       }

//       const comp: any = fixture.componentInstance as any;

//       if (comp?.handleAccountDetailsSubmit?.subscribe) {
//         comp.handleAccountDetailsSubmit.subscribe((...args: any[]) => (formSubmit as any)(...args));
//       } else if (typeof comp?.handleAccountDetailsSubmit === 'function') {
//         comp.handleAccountDetailsSubmit = formSubmit;
//       }
//       fixture.detectChanges();
//     });
//   };

//   it('should render the component', { tags: ['@PO-2412'] }, () => {
//     interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
//     setupComponent(null);

//     cy.get(SelectBusinessUnitLocators.heading).should('exist');
//   });
// });
