import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IFinesMacReviewAccountDecisionForm } from './interfaces/fines-mac-review-account-decision-form.interface';
import { FINES_MAC_REVIEW_ACCOUNT_DECISION_FORM_MOCK } from './mocks/fines-mac-review-account-decision-form.mock';
import { FinesMacReviewAccountDecisionComponent } from './fines-mac-review-account-decision.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FinesDraftStoreType } from '../../../fines-draft/stores/types/fines-draft.type';
import { FinesDraftStore } from '../../../fines-draft/stores/fines-draft.store';

describe('FinesMacReviewAccountDecisionComponent', () => {
  let component: FinesMacReviewAccountDecisionComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountDecisionComponent>;
  let formSubmit: IFinesMacReviewAccountDecisionForm;
  let finesDraftStore: FinesDraftStoreType;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_MAC_REVIEW_ACCOUNT_DECISION_FORM_MOCK);
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountDecisionComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('draft'),
            fragment: 'to-review',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountDecisionComponent);
    component = fixture.componentInstance;

    finesDraftStore = TestBed.inject(FinesDraftStore);
    finesDraftStore.setChecker(true);
    finesDraftStore.setFragment('to-review');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to check and validate tabs', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleFormSubmit(formSubmit);

    expect(routerSpy).toHaveBeenCalledWith([component['checkAndValidateTabs']], {
      fragment: component['finesDraftStore'].fragment(),
    });
  });
});
