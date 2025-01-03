import { finesMacPayloadMapAccountBase } from './fines-mac-payload-map-account-base.utils';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../../interfaces/fines-mac-payload-add-account.interfaces';
import { FINES_MAC_STATE } from '../../../../constants/fines-mac-state';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../../mocks/fines-mac-payload-add-account.mock';

describe('finesMacPayloadMapAccountBase', () => {
  let initialState: IFinesMacState | null;
  beforeEach(() => {
    initialState = structuredClone(FINES_MAC_STATE);
  });

  afterAll(() => {
    initialState = null;
  });

  it('should map account details correctly', () => {
    if (!initialState) {
      fail('Initial state is not properly initialised');
      return;
    }

    const payload: IFinesMacAddAccountPayload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    const result = finesMacPayloadMapAccountBase(initialState, payload);

    expect(result.accountDetails.formData.fm_create_account_account_type).toEqual(payload.account.account_type);
    expect(result.accountDetails.formData.fm_create_account_defendant_type).toEqual(payload.account.defendant_type);
    expect(result.accountDetails.formData.fm_create_account_business_unit_id).toEqual(payload.business_unit_id);

    expect(result.courtDetails.formData.fm_court_details_originator_name).toEqual(payload.account.originator_name);
    expect(result.courtDetails.formData.fm_court_details_originator_id).toEqual(payload.account.originator_id);
    expect(result.courtDetails.formData.fm_court_details_prosecutor_case_reference).toEqual(
      payload.account.prosecutor_case_reference,
    );
    expect(result.courtDetails.formData.fm_court_details_imposing_court_id).toEqual(
      payload.account.enforcement_court_id,
    );

    expect(result.paymentTerms.formData.fm_payment_terms_collection_order_made).toEqual(
      payload.account.collection_order_made,
    );
    expect(result.paymentTerms.formData.fm_payment_terms_collection_order_made_today).toEqual(
      payload.account.collection_order_made_today,
    );
    expect(result.paymentTerms.formData.fm_payment_terms_collection_order_date).toEqual(
      payload.account.collection_order_date,
    );
    expect(result.paymentTerms.formData.fm_payment_terms_suspended_committal_date).toEqual(
      payload.account.suspended_committal_date,
    );
    expect(result.paymentTerms.formData.fm_payment_terms_payment_card_request).toEqual(
      payload.account.payment_card_request,
    );
  });
});
