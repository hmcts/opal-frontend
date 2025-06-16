import { TestBed } from '@angular/core/testing';
import { FinesDraftStoreType } from './types/fines-draft.type';
import { FinesDraftStore } from './fines-draft.store';
import { IFinesMacPayloadAccount } from '../../fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-account.interface';
import { IFinesMacAccountTimelineData } from '../../fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-account-timeline-data.interface';
import { IFinesMacPayloadAccountSnapshot } from '../../fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-account-snapshot.interface';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../../fines-mac/services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { FINES_DRAFT_STATE } from '../constants/fines-draft-state.constant';

describe('FinesDraftStore', () => {
  let store: FinesDraftStoreType;

  beforeEach(() => {
    store = TestBed.inject(FinesDraftStore);
  });

  it('should initialize with default state', () => {
    expect(store.business_unit_id()).toEqual(0);
    expect(store.submitted_by()).toEqual('');
    expect(store.submitted_by_name()).toEqual('');
    expect(store.account()).toEqual({} as IFinesMacPayloadAccount);
    expect(store.account_type()).toEqual('');
    expect(store.account_status()).toEqual('');
    expect(store.timeline_data()).toEqual([{}] as IFinesMacAccountTimelineData[]);
    expect(store.draft_account_id()).toEqual(0);
    expect(store.created_at()).toEqual('');
    expect(store.account_snapshot()).toEqual({} as IFinesMacPayloadAccountSnapshot);
    expect(store.account_status_date()).toEqual('');
    expect(store.fragment()).toEqual('');
  });

  it('should set business_unit_id', () => {
    store.setBusinessUnitId(1);
    expect(store.business_unit_id()).toEqual(1);
  });

  it('should set submitted_by', () => {
    store.setSubmittedBy('submitted_by');
    expect(store.submitted_by()).toEqual('submitted_by');
  });

  it('should set submitted_by_name', () => {
    store.setSubmittedByName('submitted_by_name');
    expect(store.submitted_by_name()).toEqual('submitted_by_name');
  });

  it('should set account', () => {
    const account = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT.account);
    store.setAccount(account);
    expect(store.account()).toEqual(account);
  });

  it('should set account_type', () => {
    store.setAccountType('account_type');
    expect(store.account_type()).toEqual('account_type');
  });

  it('should set account_status', () => {
    store.setAccountStatus('account_status');
    expect(store.account_status()).toEqual('account_status');
  });

  it('should set timeline_data', () => {
    const timeline_data = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT.timeline_data);
    store.setTimelineData(timeline_data);
    expect(store.timeline_data()).toEqual(timeline_data);
  });

  it('should set draft_account_id', () => {
    store.setDraftAccountId(1);
    expect(store.draft_account_id()).toEqual(1);
  });

  it('should set created_at', () => {
    store.setCreatedAt('created_at');
    expect(store.created_at()).toEqual('created_at');
  });

  it('should set account_snapshot', () => {
    const account_snapshot = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT.account_snapshot);
    store.setAccountSnapshot(account_snapshot);
    expect(store.account_snapshot()).toEqual(account_snapshot);
  });

  it('should set account_status_date', () => {
    store.setAccountStatusDate('account_status_date');
    expect(store.account_status_date()).toEqual('account_status_date');
  });

  it('should set finesDraftState', () => {
    const finesDraftState = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    store.setFinesDraftState(finesDraftState);
    expect(store.business_unit_id()).toEqual(finesDraftState.business_unit_id);
    expect(store.submitted_by()).toEqual(finesDraftState.submitted_by);
    expect(store.submitted_by_name()).toEqual(finesDraftState.submitted_by_name);
    expect(store.account()).toEqual(finesDraftState.account);
    expect(store.account_type()).toEqual(finesDraftState.account_type);
    expect(store.account_status()).toEqual(finesDraftState.account_status);
    expect(store.timeline_data()).toEqual(finesDraftState.timeline_data);
    expect(store.draft_account_id()).toEqual(finesDraftState.draft_account_id);
    expect(store.created_at()).toEqual(finesDraftState.created_at);
    expect(store.account_snapshot()).toEqual(finesDraftState.account_snapshot);
    expect(store.account_status_date()).toEqual(finesDraftState.account_status_date);
  });

  it('should get finesDraftState', () => {
    const finesDraftState = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    store.setFinesDraftState(finesDraftState);
    expect(store.getFinesDraftState()).toEqual(finesDraftState);
  });

  it('should reset fineDraftState', () => {
    const finesDraftState = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    store.setFinesDraftState(finesDraftState);
    store.resetFineDraftState();
    expect(store.getFinesDraftState()).toEqual(FINES_DRAFT_STATE);
  });

  it('should return blank for account_status if null', () => {
    store.resetFineDraftState();
    expect(store.getAccountStatus()).toEqual('');
  });

  it('should set fragment', () => {
    store.setFragment('fragment');
    expect(store.fragment()).toEqual('fragment');
  });

  it('should reset fragment', () => {
    store.setFragment('fragment');
    store.resetFragment();
    expect(store.fragment()).toEqual('');
  });

  it('should set amend', () => {
    store.setAmend(true);
    expect(store.amend()).toEqual(true);
  });

  it('should reset amend', () => {
    store.setAmend(true);
    store.resetAmend();
    expect(store.amend()).toEqual(false);
  });

  it('should set fragment and amend', () => {
    store.setFragmentAndAmend('fragment', true);
    expect(store.fragment()).toEqual('fragment');
    expect(store.amend()).toEqual(true);
  });

  it('should reset fragment and amend', () => {
    store.setFragmentAndAmend('fragment', true);
    store.resetFragmentAndAmend();
    expect(store.fragment()).toEqual('');
    expect(store.amend()).toEqual(false);
  });

  it('should set banner message', () => {
    store.setBannerMessage('banner message');
    expect(store.bannerMessage()).toEqual('banner message');
  });

  it('should reset banner message', () => {
    store.setBannerMessage('banner message');
    store.resetBannerMessage();
    expect(store.bannerMessage()).toEqual('');
  });

  it('should set view all accounts', () => {
    store.setViewAllAccounts(true);
    expect(store.viewAllAccounts()).toEqual(true);
  });

  it('should reset view all accounts', () => {
    store.setViewAllAccounts(false);
    expect(store.viewAllAccounts()).toEqual(false);
  });

  it('should set fragment and checker', () => {
    store.setFragmentAndChecker('rejected', true);
    expect(store.checker()).toEqual(true);
    expect(store.fragment()).toEqual('rejected');
  });

  it('should set checker', () => {
    store.setChecker(true);
    expect(store.checker()).toEqual(true);
  });

  it('should reset checker', () => {
    store.setFragmentAndChecker('rejected', true);
    store.resetChecker();
    expect(store.checker()).toEqual(false);
  });

  it('should set banner message by type - submitted', () => {
    store.setBannerMessageByType('submitted', 'Test Name');
    expect(store.bannerMessage()).toEqual("You have submitted Test Name's account for review.");
  });

  it('should set banner message by type - deleted', () => {
    store.setBannerMessageByType('deleted', 'Test Name');
    expect(store.bannerMessage()).toEqual("You have deleted Test Name's account.");
  });

  it('should set banner message by type - rejected', () => {
    store.setBannerMessageByType('rejected', 'Test Name');
    expect(store.bannerMessage()).toEqual("You have rejected Test Name's account.");
  });

  it('should set banner message by type - approved', () => {
    store.setBannerMessageByType('approved', 'Test Name');
    expect(store.bannerMessage()).toEqual("You have approved Test Name's account.");
  });

  it('should not set banner message if type does not exist', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.setBannerMessageByType('nonexistent' as any, 'Test Name');
    expect(store.bannerMessage()).toEqual('');
  });

  it('should get defendant name from account', () => {
    const account = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT.account);
    store.setAccount(account);
    const defendantName = store.getDefendantName();
    expect(defendantName).toEqual('Alice Williams');
  });

  it('should get defendant name from account', () => {
    const account = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT.account);
    account.defendant_type = 'company';
    account.defendant.company_name = 'Tech Innovations Ltd.';
    store.setAccount(account);
    const defendantName = store.getDefendantName();
    expect(defendantName).toEqual('Tech Innovations Ltd.');
  });
});
