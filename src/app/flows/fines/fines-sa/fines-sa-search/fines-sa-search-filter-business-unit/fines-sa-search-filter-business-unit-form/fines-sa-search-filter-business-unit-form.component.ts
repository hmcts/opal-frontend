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
  private static readonly RECORD_CTRL = 'fsa_search_account_business_unit_ids';
  private static readonly FINES_ALL_CTRL = 'fsa_search_account_business_unit_ids_fines_select_all';
  private static readonly CONF_ALL_CTRL = 'fsa_search_account_business_unit_ids_confiscation_select_all';

  private get record(): FormRecord<FormControl<boolean>> {
    return this.form.get(FinesSaSearchFilterBusinessUnitForm.RECORD_CTRL) as FormRecord<FormControl<boolean>>;
  }
  private get finesAllCtrl(): FormControl<boolean> {
    return this.form.get(FinesSaSearchFilterBusinessUnitForm.FINES_ALL_CTRL) as FormControl<boolean>;
  }
  private get confAllCtrl(): FormControl<boolean> {
    return this.form.get(FinesSaSearchFilterBusinessUnitForm.CONF_ALL_CTRL) as FormControl<boolean>;
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
    return this.finesBusinessUnits.reduce((acc, u) => acc + (selections[u.business_unit_id] ? 1 : 0), 0);
  });

  public selectedConfiscation = computed(() => {
    const selections = this.businessUnitSelections();
    return this.confiscationBusinessUnits.reduce((acc, u) => acc + (selections[u.business_unit_id] ? 1 : 0), 0);
  });

  public selectedTotal = computed(() => {
    const selections = this.businessUnitSelections();
    return Object.values(selections).filter(Boolean).length;
  });

  /**
   * Builds a complete mapping of business_unit_id -> boolean for every business unit.
   * Values are set to true if the id is present in the store’s selected ids, false otherwise.
   *
   * @returns Record<string, boolean> with stringified business_unit_id keys.
   */
  private buildSelectionRecordFromStore(): Record<string, boolean> {
    const storeSelectedIds = this.finesSaStore.searchAccount().fsa_search_account_business_unit_ids ?? [];
    const selected = new Set<number>(storeSelectedIds);
    return this.businessUnits.reduce<Record<string, boolean>>((acc, u) => {
      acc[u.business_unit_id.toString()] = selected.has(u.business_unit_id);
      return acc;
    }, {});
  }

  /**
   * Updates the two header select-all controls (fines/confiscation)
   * based on the current state of their child business unit controls.
   *
   * @param record - The FormRecord containing child controls.
   */
  private syncHeaderSelectAllFrom(record: FormRecord<FormControl<boolean>>): void {
    const current = record.getRawValue() as Record<string, boolean>;
    const allFines =
      this.finesBusinessUnits.length > 0 && this.finesBusinessUnits.every((u) => !!current[u.business_unit_id]);
    const allConf =
      this.confiscationBusinessUnits.length > 0 &&
      this.confiscationBusinessUnits.every((u) => !!current[u.business_unit_id]);
    this.finesAllCtrl.setValue(allFines, { emitEvent: false });
    this.confAllCtrl.setValue(allConf, { emitEvent: false });
  }

  /**
   * Initializes the business unit selection reactive form.
   * - Creates a FormRecord keyed by business_unit_id.
   * - Adds header select-all controls.
   * - Applies validators.
   * - Sets up subscriptions for counts and header mirroring.
   */
  private setupFilterBusinessUnitForm(): void {
    const controls = this.businessUnits.reduce<Record<number, FormControl<boolean>>>((acc, unit) => {
      acc[unit.business_unit_id] = new FormControl<boolean>(false, { nonNullable: true });
      return acc;
    }, {});

    const recordControlName = FinesSaSearchFilterBusinessUnitForm.RECORD_CTRL;

    const record = new FormRecord<FormControl<boolean>>(controls, {
      validators: atLeastOneBusinessUnitSelectedRecordValidator,
    });

    this.form = new FormGroup(
      {
        [FinesSaSearchFilterBusinessUnitForm.RECORD_CTRL]: record,
        [FinesSaSearchFilterBusinessUnitForm.FINES_ALL_CTRL]: new FormControl(false),
        [FinesSaSearchFilterBusinessUnitForm.CONF_ALL_CTRL]: new FormControl(false),
      },
      { validators: businessUnitSelectionRootMirrorValidator(recordControlName) },
    );

    this.finesBusinessUnits = this.businessUnits.filter((u) => u.opal_domain === 'Fines');
    this.confiscationBusinessUnits = this.businessUnits.filter((u) => u.opal_domain === 'Confiscation');

    // Initial snapshot + validation
    this.businessUnitSelections.set(
      this.normaliseRecord<boolean, boolean, number>(record, {
        keyCoerce: Number,
        valueCoerce: (v) => !!v, // coerce null/undefined to false
      }),
    );
    record.updateValueAndValidity({ emitEvent: false });

    record.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.businessUnitSelections.set(
        this.normaliseRecord<boolean, boolean, number>(record, {
          keyCoerce: Number,
          valueCoerce: (v) => !!v,
        }),
      );
      record.updateValueAndValidity({ emitEvent: false });
      this.syncHeaderSelectAllFrom(record);
    });

    this.setupSelectAllSync(record);
  }

  /**
   * Wires header select-all checkboxes to update their respective child controls.
   * (Child → header mirroring is handled in the main subscription.)
   *
   * @param record - The FormRecord containing business unit controls.
   */
  private setupSelectAllSync(record: FormRecord<FormControl<boolean>>): void {
    const finesSelectAll = this.finesAllCtrl;
    const confiscationSelectAll = this.confAllCtrl;

    const setDomain = (domain: 'Fines' | 'Confiscation', value: boolean) => {
      const list = domain === 'Fines' ? this.finesBusinessUnits : this.confiscationBusinessUnits;
      list.forEach((u) => {
        const ctrl = record.get(u.business_unit_id.toString()) as FormControl<boolean>;
        if (ctrl.value !== value) {
          ctrl.setValue(value, { emitEvent: true }); // propagate
        }
      });
    };

    finesSelectAll.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((val) => setDomain('Fines', !!val));
    confiscationSelectAll.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val) => setDomain('Confiscation', !!val));
  }

  /**
   * Performs the initial form setup on component init:
   * - Builds the form.
   * - Applies the base state.
   * - Loads selection state from the store.
   * - Updates header select-all checkboxes.
   */
  private initialFormSetup(): void {
    this.setupFilterBusinessUnitForm();
    this.setInitialErrorMessages();

    // Reset to base, then apply store selection without event storms
    this.rePopulateForm({ ...FINES_SA_SEARCH_FILTER_BUSINESS_UNIT_STATE });

    const map = this.buildSelectionRecordFromStore();
    this.writeRecord<boolean, string>(this.record, map, { emitEvent: false });
    this.businessUnitSelections.set(
      this.normaliseRecord<boolean, boolean, number>(this.record, {
        keyCoerce: Number,
        valueCoerce: (v) => !!v,
      }),
    );
    this.record.updateValueAndValidity({ emitEvent: false });
    this.syncHeaderSelectAllFrom(this.record);
  }

  /**
   * Switches the active tab between fines and confiscation.
   *
   * @param tab - Target tab, either 'fines' or 'confiscation'.
   */
  public handleTabSwitch(tab: string): void {
    this.tab.set(tab as 'fines' | 'confiscation');
  }

  /**
   * Gets the FormControl for a specific business unit id.
   *
   * @param businessUnitId - The id of the business unit.
   * @returns The FormControl<boolean> for that id.
   */
  public getBusinessUnitControl(businessUnitId: string) {
    return this.form.get(['fsa_search_account_business_unit_ids', businessUnitId]) as FormControl<boolean>;
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
    this.initialFormSetup();
    super.ngOnInit();
  }
}
