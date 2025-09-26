import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CustomVerticalScrollPaneComponent } from '@hmcts/opal-frontend-common/components/custom/custom-vertical-scroll-pane';
import { CustomVerticalScrollPaneInnerPaneComponent } from '@hmcts/opal-frontend-common/components/custom/custom-vertical-scroll-pane/custom-vertical-scroll-pane-inner-pane';
import { CustomVerticalScrollPaneOuterPaneComponent } from '@hmcts/opal-frontend-common/components/custom/custom-vertical-scroll-pane/custom-vertical-scroll-pane-outer-pane';
import { GovukCheckboxesItemComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import {
  GovukTableComponent,
  GovukTableHeadingComponent,
  GovukTableBodyRowComponent,
  GovukTableBodyRowDataComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-table';
import { IFinesSaSearchFilterBusinessUnitForm } from '../interfaces/fines-sa-search-filter-business-unit-form.interface';
import { FormControl, FormGroup, FormRecord, ReactiveFormsModule } from '@angular/forms';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { CommonModule } from '@angular/common';
import {
  MojSubNavigationComponent,
  MojSubNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { Domain } from '../types/fines-sa-search-filter-business-unit-domains.type';
import { takeUntil } from 'rxjs';
import { IFinesSaSearchFilterBusinessUnitFieldErrors } from '../interfaces/fines-sa-search-filter-business-unit-field-errors.interface';
import { FINES_SA_SEARCH_FILTER_BUSINESS_UNIT_FIELD_ERRORS } from '../constants/fines-sa-search-filter-business-unit-field-errors.constant';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { FINES_SA_ROUTING_PATHS } from '../../../routing/constants/fines-sa-routing-paths.constant';
import { FinesSaStore } from '../../../stores/fines-sa.store';
import {
  atLeastOneBusinessUnitSelectedRecordValidator,
  businessUnitSelectionRootMirrorValidator,
} from '../validators/fines-sa-search-filter-business-unit-select-bu.validator';
import { FINES_SA_SEARCH_FILTER_BUSINESS_UNIT_STATE } from '../constants/fines-sa-search-filter-business-unit-state.constant';

@Component({
  selector: 'app-fines-sa-search-filter-business-unit-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GovukTableComponent,
    GovukTableHeadingComponent,
    GovukTableBodyRowComponent,
    GovukTableBodyRowDataComponent,
    GovukCheckboxesItemComponent,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    MojSubNavigationComponent,
    MojSubNavigationItemComponent,
    CustomVerticalScrollPaneComponent,
    CustomVerticalScrollPaneOuterPaneComponent,
    CustomVerticalScrollPaneInnerPaneComponent,
  ],
  templateUrl: './fines-sa-search-filter-business-unit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchFilterBusinessUnitForm extends AbstractFormBaseComponent {
  private readonly RECORD_CTRL = 'fsa_search_account_business_unit_ids';
  private readonly FINES_ALL_CTRL = 'fsa_search_account_business_unit_ids_fines_select_all';
  private readonly CONF_ALL_CTRL = 'fsa_search_account_business_unit_ids_confiscation_select_all';

  private get record(): FormRecord<FormControl<boolean>> {
    return this.form.get(this.RECORD_CTRL) as FormRecord<FormControl<boolean>>;
  }
  private get finesAllCtrl(): FormControl<boolean> {
    return this.form.get(this.FINES_ALL_CTRL) as FormControl<boolean>;
  }
  private get confAllCtrl(): FormControl<boolean> {
    return this.form.get(this.CONF_ALL_CTRL) as FormControl<boolean>;
  }
  private businessUnitSelections = signal<Record<number, boolean>>({});
  private readonly finesSaStore = inject(FinesSaStore);
  private readonly finesSaSearchAccountRoutingPaths = FINES_SA_ROUTING_PATHS;

  @Output() protected override formSubmit = new EventEmitter<IFinesSaSearchFilterBusinessUnitForm>();
  protected override fieldErrors: IFinesSaSearchFilterBusinessUnitFieldErrors =
    FINES_SA_SEARCH_FILTER_BUSINESS_UNIT_FIELD_ERRORS;

  @Input({ required: true }) public businessUnits!: IOpalFinesBusinessUnit[];
  public tab = signal<Domain>('fines');
  public finesBusinessUnits: IOpalFinesBusinessUnit[] = [];
  public confiscationBusinessUnits: IOpalFinesBusinessUnit[] = [];

  public selectedFines = computed(() => {
    const selections = this.businessUnitSelections();
    return this.finesBusinessUnits.reduce(
      (count, businessUnit) => count + (selections[businessUnit.business_unit_id] ? 1 : 0),
      0,
    );
  });

  public selectedConfiscation = computed(() => {
    const selections = this.businessUnitSelections();
    return this.confiscationBusinessUnits.reduce(
      (count, businessUnit) => count + (selections[businessUnit.business_unit_id] ? 1 : 0),
      0,
    );
  });

  public selectedTotal = computed(() => {
    const selections = this.businessUnitSelections();
    return Object.values(selections).filter(Boolean).length;
  });

  /**
   * Creates a FormRecord keyed by business_unit_id with boolean controls.
   * Each control starts with false and is non-nullable. The record has a validator
   * that ensures at least one business unit is selected.
   */
  private createBusinessUnitControlsRecord(): FormRecord<FormControl<boolean>> {
    const controls = this.businessUnits.reduce<Record<number, FormControl<boolean>>>((acc, unit) => {
      acc[unit.business_unit_id] = new FormControl<boolean>(false, { nonNullable: true });
      return acc;
    }, {});
    if (this.businessUnits.length === 0) {
      // No units: return an empty record without the validator to avoid a permanently invalid form
      return new FormRecord<FormControl<boolean>>({});
    }
    return new FormRecord<FormControl<boolean>>(controls, {
      validators: atLeastOneBusinessUnitSelectedRecordValidator,
    });
  }

  /**
   * Builds the main FormGroup for this component. It includes the FormRecord of
   * business unit controls and two header select-all checkboxes. A root validator
   * ensures header and child states remain consistent.
   *
   * @param record - The FormRecord of business unit controls.
   */
  private buildBusinessUnitForm(record: FormRecord<FormControl<boolean>>): void {
    this.form = new FormGroup(
      {
        [this.RECORD_CTRL]: record,
        [this.FINES_ALL_CTRL]: new FormControl(false, { nonNullable: true }),
        [this.CONF_ALL_CTRL]: new FormControl(false, { nonNullable: true }),
      },
      { validators: businessUnitSelectionRootMirrorValidator(this.RECORD_CTRL) },
    );
  }

  /**
   * Populates finesBusinessUnits and confiscationBusinessUnits arrays by splitting
   * the input businessUnits by their opal_domain value.
   */
  private groupBusinessUnitsByDomain(): void {
    this.finesBusinessUnits = this.businessUnits.filter((u) => u.opal_domain === 'Fines');
    this.confiscationBusinessUnits = this.businessUnits.filter((u) => u.opal_domain === 'Confiscation');
  }

  /**
   * Sets the initial selection state from the given FormRecord into the signal
   * and triggers validation without emitting events.
   *
   * @param record - The FormRecord containing business unit controls.
   */
  private initialiseBusinessUnitSelections(record: FormRecord<FormControl<boolean>>): void {
    this.businessUnitSelections.set(
      this.objectFromFormRecord<boolean, boolean, number>(record, {
        mapKey: Number,
        mapValue: (v) => !!v,
      }),
    );
    record.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Synchronises selections from the record, updates validity without emitting,
   * and mirrors the header select-all checkboxes.
   */
  private refreshSelectionsValidityAndHeaders(record: FormRecord<FormControl<boolean>>): void {
    this.businessUnitSelections.set(
      this.objectFromFormRecord<boolean, boolean, number>(record, {
        mapKey: Number,
        mapValue: (v) => !!v,
      }),
    );
    record.updateValueAndValidity({ emitEvent: false });
    this.updateHeaderSelectAllFromRecord(record);
  }

  /**
   * Subscribes to changes in the FormRecord to keep selections and validity
   * up to date. Also ensures the header select-all checkboxes reflect the current state.
   *
   * @param record - The FormRecord containing business unit controls.
   */
  private subscribeToBusinessUnitChanges(record: FormRecord<FormControl<boolean>>): void {
    record.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.refreshSelectionsValidityAndHeaders(record);
    });
  }

  /**
   * Reads the store's selected business unit ids and returns a full
   * business_unit_id -> boolean map for all available units.
   * Values are true when the id exists in the store; otherwise false.
   *
   * @returns Record<string, boolean> with stringified business_unit_id keys.
   */
  private readSelectionRecordFromStore(): Record<string, boolean> {
    const storeSelectedIds = this.finesSaStore.searchAccount().fsa_search_account_business_unit_ids ?? [];
    const selected = new Set<number>(storeSelectedIds);
    return this.businessUnits.reduce<Record<string, boolean>>((acc, u) => {
      acc[u.business_unit_id.toString()] = selected.has(u.business_unit_id);
      return acc;
    }, {});
  }

  /**
   * Updates the two header select-all controls (Fines/Confiscation)
   * based on the current state of their child business unit controls.
   *
   * @param record - The FormRecord containing child controls.
   */
  private updateHeaderSelectAllFromRecord(record: FormRecord<FormControl<boolean>>): void {
    const currentSelections = this.objectFromFormRecord<boolean, boolean, number>(record, {
      mapKey: Number,
      mapValue: (v) => !!v,
    });
    const allFines =
      this.finesBusinessUnits.length > 0 &&
      this.finesBusinessUnits.every((u) => !!currentSelections[u.business_unit_id]);
    const allConfiscation =
      this.confiscationBusinessUnits.length > 0 &&
      this.confiscationBusinessUnits.every((u) => !!currentSelections[u.business_unit_id]);
    this.finesAllCtrl.setValue(allFines, { emitEvent: false });
    this.confAllCtrl.setValue(allConfiscation, { emitEvent: false });
  }

  /**
   * Initialises the business unit selection form.
   * Breaks down into smaller steps for readability & testability.
   */
  private initialiseBusinessUnitForm(): void {
    const record = this.createBusinessUnitControlsRecord();
    this.buildBusinessUnitForm(record);
    this.groupBusinessUnitsByDomain();

    if (this.businessUnits.length === 0) {
      // Ensure derived state and headers are consistent for an empty dataset
      this.businessUnitSelections.set({});
      this.finesAllCtrl.setValue(false, { emitEvent: false });
      this.confAllCtrl.setValue(false, { emitEvent: false });
      return; // nothing else to wire up
    }

    this.initialiseBusinessUnitSelections(record);
    this.subscribeToBusinessUnitChanges(record);
    this.initialiseSelectAllControls(record);
  }

  /**
   * Initialises the header select‑all controls (Fines/Confiscation) so they update
   * their respective child controls. (Child → header mirroring is handled by
   * the valueChanges subscription.)
   *
   * @param record - The FormRecord containing business unit controls.
   */
  private initialiseSelectAllControls(record: FormRecord<FormControl<boolean>>): void {
    const finesSelectAll = this.finesAllCtrl;
    const confiscationSelectAll = this.confAllCtrl;

    const setAllInDomain = (domain: 'Fines' | 'Confiscation', value: boolean) => {
      const businessUnitsInDomain = domain === 'Fines' ? this.finesBusinessUnits : this.confiscationBusinessUnits;
      businessUnitsInDomain.forEach((businessUnit) => {
        const ctrl = record.get(businessUnit.business_unit_id.toString()) as FormControl<boolean> | null;
        if (ctrl && ctrl.value !== value) {
          ctrl.setValue(value, { emitEvent: true }); // propagate
        }
      });
      record.updateValueAndValidity({ emitEvent: true });
    };

    finesSelectAll.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => setAllInDomain('Fines', !!value));
    confiscationSelectAll.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => setAllInDomain('Confiscation', !!value));
  }

  /**
   * Performs the initial form setup on component init:
   * - Builds the form.
   * - Applies the base state.
   * - Loads selection state from the store.
   * - Updates header select-all checkboxes.
   */
  private initialiseForm(): void {
    this.initialiseBusinessUnitForm();
    this.setInitialErrorMessages();

    // Reset to base, then apply store selection without event storms
    this.rePopulateForm({ ...FINES_SA_SEARCH_FILTER_BUSINESS_UNIT_STATE });

    const map = this.readSelectionRecordFromStore();
    this.patchFormRecordFromObject<boolean, string>(this.record, map, { emitEvent: false });
    this.refreshSelectionsValidityAndHeaders(this.record);
  }

  /**
   * Switches the active tab between fines and confiscation.
   *
   * @param tab - Target tab, either 'fines' or 'confiscation'.
   */
  public handleTabSwitch(tab: string): void {
    this.tab.set(tab as Domain);
  }

  /**
   * Gets the FormControl for a specific business unit id.
   *
   * @param businessUnitId - The id of the business unit.
   * @returns The FormControl<boolean> for that id.
   */
  public getBusinessUnitControl(businessUnitId: string) {
    return this.form.get([this.RECORD_CTRL, businessUnitId]) as FormControl<boolean>;
  }

  /**
   * Cancels editing and navigates back to the fines search view.
   *
   * Navigates to the search child route, relative to the parent route, and
   * preserves the active tab in the URL fragment.
   */
  public cancel(): void {
    this['router'].navigate([this.finesSaSearchAccountRoutingPaths.children.search], {
      relativeTo: this['activatedRoute'].parent,
      fragment: this.finesSaStore.activeTab(),
    });
  }

  public override ngOnInit(): void {
    this.initialiseForm();
    super.ngOnInit();
  }
}
