import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormRecord } from '@angular/forms';
import { FinesSaSearchFilterBusinessUnitForm } from './fines-sa-search-filter-business-unit-form.component';
import { FinesSaStore } from '../../../stores/fines-sa.store';
import { FinesSaStoreType } from '../../../stores/types/fines-sa.type';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('FinesSaSearchFilterBusinessUnitForm', () => {
  let component: FinesSaSearchFilterBusinessUnitForm;
  let fixture: ComponentFixture<FinesSaSearchFilterBusinessUnitForm>;
  let mockFinesSaStore: FinesSaStoreType;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaSearchFilterBusinessUnitForm],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: 'search',
            fragment: of('individuals'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchFilterBusinessUnitForm);
    component = fixture.componentInstance;

    // Provide business units input BEFORE detectChanges() so ngOnInit sees them
    component.businessUnits = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData;
    mockFinesSaStore = TestBed.inject(FinesSaStore);
    mockFinesSaStore.setBusinessUnitIds([61, 68]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initialises selection and counts from the store ids', () => {
    const record = component['form'].get('fsa_search_account_business_unit_ids') as FormRecord<FormControl<boolean>>;

    expect(record.get('61')?.value).toBeTrue();
    expect(record.get('67')?.value).toBeFalse();
    expect(record.get('68')?.value).toBeTrue();
    expect(record.get('69')?.value).toBeFalse();
    expect(record.get('70')?.value).toBeFalse();
    expect(record.get('71')?.value).toBeFalse();
    expect(record.get('73')?.value).toBeFalse();

    // Counts
    expect(component.selectedFines()).toBe(1); // only id 61 is a Fines BU
    expect(component.selectedConfiscation()).toBe(1); // only id 68 is a Conf BU
    expect(component.selectedTotal()).toBe(2);

    // Header checkboxes reflect computed state
    expect(component['form'].get('fsa_search_account_business_unit_ids_fines_select_all')?.value).toBeFalse();
    expect(component['form'].get('fsa_search_account_business_unit_ids_confiscation_select_all')?.value).toBeTrue();
  });

  it('getBusinessUnitControl should return the specific BU control', () => {
    const ctrl = component.getBusinessUnitControl('67');
    expect(ctrl).toBeTruthy();
    expect(ctrl.value).toBeFalse();
  });

  it('toggling the fines select-all header checks all fines children and updates counts', () => {
    const finesAll = component['form'].get(
      'fsa_search_account_business_unit_ids_fines_select_all',
    ) as FormControl<boolean>;
    finesAll.setValue(true);

    const record = component['form'].get('fsa_search_account_business_unit_ids') as FormRecord<FormControl<boolean>>;

    // Fines BUs (61,67,69,70,71) should now be true; Confiscation unchanged (68 true from store)
    expect(record.get('61')?.value).toBeTrue();
    expect(record.get('67')?.value).toBeTrue();
    expect(record.get('69')?.value).toBeTrue();
    expect(record.get('70')?.value).toBeTrue();
    expect(record.get('71')?.value).toBeTrue();
    expect(record.get('68')?.value).toBeTrue();

    // Counts: fines 5, conf 1, total 6
    expect(component.selectedFines()).toBe(5);
    expect(component.selectedConfiscation()).toBe(1);
    expect(component.selectedTotal()).toBe(6);
  });

  it('toggling the confiscation select-all header checks all confiscation children and updates counts', () => {
    const confAll = component['form'].get(
      'fsa_search_account_business_unit_ids_confiscation_select_all',
    ) as FormControl<boolean>;
    confAll.setValue(true);

    const record = component['form'].get('fsa_search_account_business_unit_ids') as FormRecord<FormControl<boolean>>;

    // Confiscation BUs (68) should now be true; fines unchanged from initial (61 true, 67 false, 69 false)
    expect(record.get('68')?.value).toBeTrue();
    expect(record.get('61')?.value).toBeTrue();
    expect(record.get('67')?.value).toBeFalse();
    expect(record.get('69')?.value).toBeFalse();

    // Counts: fines 1, conf 1, total 2
    expect(component.selectedFines()).toBe(1);
    expect(component.selectedConfiscation()).toBe(1);
    expect(component.selectedTotal()).toBe(2);
  });

  it('should cancel and route back to the search screen', () => {
    spyOn(component['router'], 'navigate');
    component.cancel();
    expect(component['router'].navigate).toHaveBeenCalledWith(
      [component['finesSaSearchAccountRoutingPaths'].children.search],
      {
        relativeTo: component['activatedRoute'].parent,
        fragment: component['finesSaStore'].activeTab(),
      },
    );
  });

  it('selectedConfiscation returns 0 when no confiscation unit is selected (covers false branch in reducer)', () => {
    // Recreate component with store seeded to only a Fines id so Confiscation (68) is false
    const store = TestBed.inject(FinesSaStore);
    store.setBusinessUnitIds([61]);

    const fresh = TestBed.createComponent(FinesSaSearchFilterBusinessUnitForm);
    const cmp = fresh.componentInstance;
    cmp.businessUnits = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData;
    fresh.detectChanges();

    const record = cmp['form'].get('fsa_search_account_business_unit_ids') as FormRecord<FormControl<boolean>>;
    expect(record.get('68')?.value).toBeFalse();
    expect(cmp.selectedConfiscation()).toBe(0);
  });

  it('initialises with empty selection when store ids are undefined (covers ?? [] path)', () => {
    // Seed store with undefined so buildSelectionRecordFromStore uses the fallback []
    const store = TestBed.inject(FinesSaStore);
    // @ts-expect-error forcing undefined to exercise fallback
    store.setBusinessUnitIds(undefined);

    const fresh = TestBed.createComponent(FinesSaSearchFilterBusinessUnitForm);
    const cmp = fresh.componentInstance;
    cmp.businessUnits = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData;
    fresh.detectChanges();

    const record = cmp['form'].get('fsa_search_account_business_unit_ids') as FormRecord<FormControl<boolean>>;
    // All BUs should be false
    ['61', '67', '68', '69', '70', '71', '73'].forEach((id) => {
      expect(record.get(id)?.value).toBeFalse();
    });
    expect(cmp.selectedTotal()).toBe(0);
    expect(cmp.selectedFines()).toBe(0);
    expect(cmp.selectedConfiscation()).toBe(0);
  });
});
