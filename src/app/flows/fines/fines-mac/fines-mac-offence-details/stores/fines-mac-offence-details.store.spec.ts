import { TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsStoreType } from './types/fines-mac-offence-details.type';
import { FinesMacOffenceDetailsStore } from './fines-mac-offence-details.store';
import { IAbstractFormArrayControls } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../mocks/fines-mac-offence-details-form.mock';

describe('FinesMacOffenceDetailsStore', () => {
  let store: FinesMacOffenceDetailsStoreType;

  beforeEach(() => {
    store = TestBed.inject(FinesMacOffenceDetailsStore);
  });

  it('should initialise with the default state', () => {
    expect(store.offenceDetailsDraft()).toEqual([]);
    expect(store.rowIndex()).toBeNull();
    expect(store.formArrayControls()).toEqual([]);
    expect(store.removeMinorCreditor()).toBeNull();
    expect(store.offenceIndex()).toEqual(0);
    expect(store.emptyOffences()).toBeFalse();
    expect(store.addedOffenceCode()).toEqual('');
    expect(store.minorCreditorAdded()).toBeFalse();
    expect(store.offenceRemoved()).toBeFalse();
    expect(store.offenceCodeMessage()).toEqual('');
  });

  it('should update offence code message', () => {
    const message = 'Test message';
    store.setOffenceCodeMessage(message);
    expect(store.offenceCodeMessage()).toEqual(message);
  });

  it('should update offence removed', () => {
    store.setOffenceRemoved(true);
    expect(store.offenceRemoved()).toBeTrue();
  });

  it('should update minor creditor added', () => {
    store.setMinorCreditorAdded(true);
    expect(store.minorCreditorAdded()).toBeTrue();
  });

  it('should update added offence code', () => {
    const offenceCode = 'Test offence code';
    store.setAddedOffenceCode(offenceCode);
    expect(store.addedOffenceCode()).toEqual(offenceCode);
  });

  it('should update empty offences', () => {
    store.setEmptyOffences(true);
    expect(store.emptyOffences()).toBeTrue();
  });

  it('should update offence index', () => {
    const index = 1;
    store.setOffenceIndex(index);
    expect(store.offenceIndex()).toEqual(index);
  });

  it('should update remove minor creditor', () => {
    const minorCreditor = 1;
    store.setRemoveMinorCreditor(minorCreditor);
    expect(store.removeMinorCreditor()).toEqual(minorCreditor);

    store.setRemoveMinorCreditor(null);
    expect(store.removeMinorCreditor()).toBeNull();
  });

  it('should update row index', () => {
    const index = 1;
    store.setRowIndex(index);
    expect(store.rowIndex()).toEqual(index);

    store.setRowIndex(null);
    expect(store.rowIndex()).toBeNull();
  });

  it('should update form array controls', () => {
    const formArrayControls = [
      { surname: { inputId: 'surname', inputName: 'Surname', controlName: 'surname' } },
    ] as IAbstractFormArrayControls[];
    store.setFormArrayControls(formArrayControls);
    expect(store.formArrayControls()).toEqual(formArrayControls);
  });

  it('should update offence details draft', () => {
    const offenceDetailsDraft = [FINES_MAC_OFFENCE_DETAILS_FORM_MOCK];
    store.setOffenceDetailsDraft(offenceDetailsDraft);
    expect(store.offenceDetailsDraft()).toEqual(offenceDetailsDraft);
  });

  it('should reset store draft imposition minor', () => {
    store.resetStoreDraftImpositionMinor();
    expect(store.offenceDetailsDraft()).toEqual([]);
    expect(store.rowIndex()).toBeNull();
    expect(store.formArrayControls()).toEqual([]);
    expect(store.removeMinorCreditor()).toBeNull();
  });

  it('should reset offence code message', () => {
    store.setOffenceCodeMessage('Test message');
    store.resetOffenceCodeMessage();
    expect(store.offenceCodeMessage()).toEqual('');
  });

  it('should reset offence removed', () => {
    store.resetStore();
    expect(store.offenceDetailsDraft()).toEqual([]);
    expect(store.rowIndex()).toBeNull();
    expect(store.formArrayControls()).toEqual([]);
    expect(store.removeMinorCreditor()).toBeNull();
    expect(store.offenceIndex()).toEqual(0);
    expect(store.emptyOffences()).toBeFalse();
    expect(store.addedOffenceCode()).toEqual('');
    expect(store.minorCreditorAdded()).toBeFalse();
    expect(store.offenceRemoved()).toBeFalse();
    expect(store.offenceCodeMessage()).toEqual('');
  });
});
