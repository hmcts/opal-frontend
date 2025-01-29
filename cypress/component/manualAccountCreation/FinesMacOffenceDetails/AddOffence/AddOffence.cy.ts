// import { mount } from 'cypress/angular';
// import { FinesMacOffenceDetailsAddAnOffenceComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-add-an-offence/fines-mac-offence-details-add-an-offence.component';
// import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
// import { ActivatedRoute } from '@angular/router';
// import { FINES_MAC_STATE_MOCK } from '../../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
// import { FinesService } from '@services/fines/fines-service/fines.service';
// import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
// import { OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-pretty-name.mock';
// import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
// import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
// import { OPAL_FINES_RESULT_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-result-pretty-name.mock';
// import { FinesMacOffenceDetailsService } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/services/fines-mac-offence-details-service/fines-mac-offence-details.service';
// import { ADD_OFFENCE_OFFENCE_MOCK } from './mocks/add-offence-draft-state-mock';
// import { of } from 'rxjs';

// describe('FinesMacLanguagePreferenceComponent', () => {
//   let mockFinesService = {
//     finesMacState: { ...FINES_MAC_STATE_MOCK },
//   };

//   afterEach(() => {
//     cy.then(() => {
//       mockFinesService.finesMacState.languagePreferences.formData = {
//         fm_language_preferences_document_language: '',
//         fm_language_preferences_hearing_language: '',
//       };
//     });
//   });

//   const setupComponent = (formSubmit: any) => {
//     const mockOffenceDetailsService = {
//       finesMacOffenceDetailsDraftState: { ...ADD_OFFENCE_OFFENCE_MOCK },
//     };

//     const mockOpalFinesService = {
//       getResults: () => of(OPAL_FINES_RESULTS_REF_DATA_MOCK),
//       getResultPrettyName: () => OPAL_FINES_RESULT_PRETTY_NAME_MOCK,
//       getMajorCreditors: () => of(OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK),
//       getMajorCreditorPrettyName: () => OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK,
//       getOffenceByCjsCode: () => of(OPAL_FINES_OFFENCES_REF_DATA_MOCK),
//     };

//     mount(FinesMacOffenceDetailsAddAnOffenceComponent, {
//       providers: [
//         { provide: OpalFines, useValue: mockOpalFinesService },
//         { provide: FinesService, useValue: mockFinesService },
//         { provide: FinesMacOffenceDetailsService, useValue: mockOffenceDetailsService },
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             parent: {
//               snapshot: {
//                 url: [{ path: 'manual-account-creation' }],
//               },
//             },
//           },
//         },
//       ],
//       componentProperties: {
//         handleOffenceDetailsSubmit: formSubmit,
//       },
//     });
//   };

//   it('should render the component', () => {
//     setupComponent(null);

//     // Verify the component is rendered
//   });
// });
