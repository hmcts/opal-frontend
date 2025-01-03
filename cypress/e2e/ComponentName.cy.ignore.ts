import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FinesMacOffenceDetailsAddAnOffenceComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-add-an-offence/fines-mac-offence-details-add-an-offence.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacOffenceDetailsService } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { DateService } from '@services/date-service/date.service';

describe('ComponentName.cy.ts', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/opal-fines-service/results**', {
      statusCode: 200,
      body: {
        count: 8,
        refData: [
          {
            result_id: 'FCC',
            result_title: 'Criminal Courts Charge',
            result_title_cy: "Ffi'r Llysoedd Troseddol",
            active: true,
            result_type: 'Result',
            imposition_creditor: 'CF',
            imposition_allocation_order: 6,
          },
          {
            result_id: 'FCOMP',
            result_title: 'Compensation',
            result_title_cy: 'Iawndal',
            active: true,
            result_type: 'Result',
            imposition_creditor: 'Any',
            imposition_allocation_order: 1,
          },
          {
            result_id: 'FCOST',
            result_title: 'Costs',
            result_title_cy: 'Costau',
            active: true,
            result_type: 'Result',
            imposition_creditor: '!CPS',
            imposition_allocation_order: 3,
          },
          {
            result_id: 'FCPC',
            result_title: 'Costs to Crown Prosecution Service',
            result_title_cy: 'Costau i Wasanaeth Erlyn y Goron',
            active: true,
            result_type: 'Result',
            imposition_creditor: 'CPS',
            imposition_allocation_order: 3,
          },
          {
            result_id: 'FFR',
            result_title: 'FORFEITED RECOGNISANCE',
            result_title_cy: null,
            active: true,
            result_type: 'Result',
            imposition_creditor: 'CF',
            imposition_allocation_order: 10,
          },
          {
            result_id: 'FO',
            result_title: 'Fine',
            result_title_cy: 'Dirwy',
            active: true,
            result_type: 'Result',
            imposition_creditor: 'CF',
            imposition_allocation_order: 5,
          },
          {
            result_id: 'FVEBD',
            result_title: 'Vehicle Excise Back Duty',
            result_title_cy: 'Ôl-dreth ar y Dreth Cerbyd',
            active: true,
            result_type: 'Result',
            imposition_creditor: 'CF',
            imposition_allocation_order: 8,
          },
          {
            result_id: 'FVS',
            result_title: 'Victim Surcharge',
            result_title_cy: 'Gordal Dioddefwr',
            active: true,
            result_type: 'Result',
            imposition_creditor: 'CF',
            imposition_allocation_order: 2,
          },
        ],
      }, // Mock response data
    }).as('getResults');

    cy.intercept('GET', '**/opal-fines-service/major-creditors**', {
      statusCode: 200,
      body: {
        refData: [
          {
            major_creditor_id: 1795,
            business_unit_id: 139,
            major_creditor_code: 'ECTR',
            name: 'ABELLIO EAST MIDLANDS LIMITED',
            postcode: null,
          },
        ],
      }, // Mock response data
    }).as('getMajorCreditors');
  });

  it('playground', () => {
    cy.mount(FinesMacOffenceDetailsAddAnOffenceComponent, {
      imports: [CommonModule, HttpClientModule, RouterTestingModule],
      providers: [FinesService, OpalFines, FinesMacOffenceDetailsService, DateService],
      componentProperties: {
        defendantType: '',
        offenceIndex: 0,
      },
    });

    // Wait for the mocked HTTP requests to complete
    cy.wait('@getResults');
    cy.wait('@getMajorCreditors');
  });
});
