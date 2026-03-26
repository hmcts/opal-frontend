import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent } from './fines-mac-offence-details-review-offence-heading-title.component';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
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
    const multiResultResponse: IOpalFinesOffencesRefData = {
      count: 4,
      refData: [
        {
          offence_id: 41799,
          get_cjs_code: 'CD71039',
          business_unit_id: 52,
          offence_title: 'Criminal damage to property valued under £5000',
          offence_title_cy: null,
          date_used_from: '1997-11-16T00:00:00Z',
          date_used_to: null,
          offence_oas: 'Contrary to sections 1(1) and 4 of the Criminal Damage Act 1971.',
          offence_oas_cy: null,
        },
        {
          offence_id: 30733,
          get_cjs_code: 'CD71039A',
          business_unit_id: 52,
          offence_title: 'Attempt criminal damage to property valued under £5000',
          offence_title_cy: null,
          date_used_from: '1971-01-01T00:00:00Z',
          date_used_to: null,
          offence_oas: 'Contrary to section 1(1) of the Criminal Attempts Act 1981.',
          offence_oas_cy: null,
        },
        {
          offence_id: 30734,
          get_cjs_code: 'CD71039B',
          business_unit_id: 52,
          offence_title: 'Aid, abet, counsel and procure damage under £5000',
          offence_title_cy: null,
          date_used_from: '1971-01-01T00:00:00Z',
          date_used_to: null,
          offence_oas: 'Contrary to sections 1(1) and 4 of the Criminal Damage Act 1971.',
          offence_oas_cy: null,
        },
        {
          offence_id: 30735,
          get_cjs_code: 'CD71039C',
          business_unit_id: 52,
          offence_title: 'Conspiracy to destroy or damage property under £5000',
          offence_title_cy: null,
          date_used_from: '1971-01-01T00:00:00Z',
          date_used_to: '2004-12-25T00:00:00Z',
          offence_oas: 'Contrary to section 1 of the Criminal Law Act 1977.',
          offence_oas_cy: null,
        },
      ],
    };

    component.offenceCode = 'CD71039';
    component.offenceRefData = multiResultResponse;

    component.getOffenceTitle();

    expect(component.offenceTitle).toEqual('Criminal damage to property valued under £5000');
  });
});
