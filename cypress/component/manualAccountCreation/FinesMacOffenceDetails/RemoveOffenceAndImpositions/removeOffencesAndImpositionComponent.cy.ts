import { mount } from 'cypress/angular';
import { FinesMacOffenceDetailsMinorCreditorComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-minor-creditor/fines-mac-offence-details-minor-creditor.component';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FinesMacOffenceDetailsService } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { provideHttpClient } from '@angular/common/http';
import { DateService } from '@services/date-service/date.service';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-minor-creditor/mocks/fines-mac-offence-details-minor-creditor-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/mocks/fines-mac-offence-details-draft-state.mock';

describe('FinesMacMinorCreditor', () => {
  let mockFinesService: FinesService;
  let mockOffenceDetailsService: FinesMacOffenceDetailsService;
  let formData: any;
  let currentoffenceDetails = 0;

  beforeEach(() => {
    mockFinesService = new FinesService(new DateService());


    mockOffenceDetailsService = {
      finesMacOffenceDetailsDraftState: FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
    } as FinesMacOffenceDetailsService;

    const childForms = [
      {
        ...FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK,
        formData: {
          fm_offence_details_imposition_position: 0,
          fm_offence_details_minor_creditor_creditor_type: '',
          fm_offence_details_minor_creditor_title: '',
          fm_offence_details_minor_creditor_forenames: '',
          fm_offence_details_minor_creditor_surname: '',
          fm_offence_details_minor_creditor_company_name: '',
          fm_offence_details_minor_creditor_address_line_1: '',
          fm_offence_details_minor_creditor_address_line_2: '',
          fm_offence_details_minor_creditor_address_line_3: '',
          fm_offence_details_minor_creditor_post_code: '',
          fm_offence_details_minor_creditor_pay_by_bacs: true,
          fm_offence_details_minor_creditor_bank_account_name: '',
          fm_offence_details_minor_creditor_bank_sort_code: '',
          fm_offence_details_minor_creditor_bank_account_number: '',
          fm_offence_details_minor_creditor_bank_account_ref: '',
        },
      },
    ];

    mockOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[
      currentoffenceDetails
    ].childFormData = childForms;

    formData = childForms;
    mockOffenceDetailsService.finesMacOffenceDetailsDraftState.removeMinorCreditor = 0;
  });

  const setupComponent = (formSubmit: any, defendantType: string = '') => {
    mount(FinesMacOffenceDetailsMinorCreditorComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        { provide: FinesMacOffenceDetailsService, useValue: mockOffenceDetailsService },
        { provide: FinesService, useValue: mockFinesService },
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
        handleMinorCreditorFormSubmit: formSubmit,
      },
    });
  };
});