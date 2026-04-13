import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent } from './fines-mac-offence-details-review-offence-heading-title.component';
import { OPAL_FINES_OFFENCES_REF_DATA_DUPLICATE_CODE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-duplicate-code.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_EXACT_MATCH_MULTI_RESULT_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-multi-result.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-singular.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent', () => {
  let component: FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent);
    component = fixture.componentInstance;

    component.offenceCode = OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK.refData[0].get_cjs_code;
    component.offenceRefData = OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit action when onActionClick is called', () => {
    const action = 'Change';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emitSpy = vi.spyOn<any, any>(component.actionClicked, 'emit');

    component.onActionClick(action);

    expect(emitSpy).toHaveBeenCalledWith(action);
  });

  it('should set offenceTitle when getOffenceTitle is called', () => {
    component.getOffenceTitle();

    expect(component.offenceTitle).toEqual(component.offenceRefData.refData[0].offence_title);
  });

  it('should use the exact code match when multiple offences are returned', () => {
    component.offenceCode = 'CD71039';
    component.offenceRefData = OPAL_FINES_OFFENCES_REF_DATA_EXACT_MATCH_MULTI_RESULT_MOCK;

    component.getOffenceTitle();

    expect(component.offenceTitle).toEqual('Criminal damage to property valued under £5000');
  });

  it('should use the saved offence id when duplicate code matches are returned', () => {
    component.offenceCode = 'GMMET001';
    component.offenceId = 41800;
    component.offenceRefData = OPAL_FINES_OFFENCES_REF_DATA_DUPLICATE_CODE_MOCK;

    component.getOffenceTitle();

    expect(component.offenceTitle).toEqual('Duplicate offence title B');
  });

  it('should fall back to the first offence title when duplicate code matches are returned without a saved offence id', () => {
    component.offenceCode = 'GMMET001';
    component.offenceId = null;
    component.offenceRefData = OPAL_FINES_OFFENCES_REF_DATA_DUPLICATE_CODE_MOCK;

    component.getOffenceTitle();

    expect(component.offenceTitle).toEqual('Duplicate offence title A');
  });
});
