// import { mount } from 'cypress/angular';
// import { OpalFines } from '../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
// import { ActivatedRoute } from '@angular/router';
// import { FINES_MAC_STATE_MOCK } from '../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
// import { FinesMacCourtDetailsComponent } from '../../../src/app/flows/fines/fines-mac/fines-mac-court-details/fines-mac-court-details.component';
// import { FinesService } from '@services/fines/fines-service/fines.service';
// import { DateService } from '@services/date-service/date.service';
// import { HttpClient } from '@angular/common/http';

// describe('FinesMacParentGuardianDetailsComponent', () => {
//   const setupComponent = (formSubmit: any) => {
//     const MockFinesService = new FinesService(new DateService());

//     const mockOpalFinesService = new OpalFines();

//     MockFinesService.finesMacState = {
//       ...FINES_MAC_STATE_MOCK,
//     };

//     mount(FinesMacCourtDetailsComponent, {
//       providers: [
//         { provide: FinesService, useValue: MockFinesService },
//         { provide: OpalFines, useValue: mockOpalFinesService },
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
//         handleCourtDetailsSubmit: formSubmit,
//       },
//     });
//   };

//   it('should render the child component', () => {
//     setupComponent(null);

//     // Verify the child component is rendered
//     cy.get('app-fines-mac-court-details-form').should('exist');
//   });
// });
