import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

import { FinesAccMajorCreditorDetailsAtAGlanceTabComponent } from './fines-acc-major-creditor-details-at-a-glance-tab.component';
import { beforeEach, describe, expect, it } from 'vitest';
import { OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_MOCK } from '../../../services/opal-fines-service/mocks/opal-fines-account-major-creditor-at-a-glance-with-defendant.mock';
import { IOpalFinesAccountMajorCreditorAtAGlance } from '../../../services/opal-fines-service/interfaces/opal-fines-account-major-creditor-at-a-glance.interface';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../../../constants/release-feature-flags.constant';

type MajorCreditorAddress = IOpalFinesAccountMajorCreditorAtAGlance['major_creditor']['address'];

describe('FinesAccMajorCreditorDetailsAtAGlanceTabComponent', () => {
  let component: FinesAccMajorCreditorDetailsAtAGlanceTabComponent;
  let fixture: ComponentFixture<FinesAccMajorCreditorDetailsAtAGlanceTabComponent>;

  const getAddressValue = (): Element => {
    const element: HTMLElement = fixture.nativeElement;
    const addressHeading = Array.from(element.querySelectorAll('h3')).find(
      (heading) => heading.textContent === 'Address',
    );
    expect(addressHeading).toBeDefined();
    return addressHeading!.nextElementSibling!;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccMajorCreditorDetailsAtAGlanceTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccMajorCreditorDetailsAtAGlanceTabComponent);
    component = fixture.componentInstance;
    TestBed.inject(GlobalStore).setFeatureFlags({ [RELEASE_1A_1_2_FEATURE_FLAG]: true });
    fixture.componentRef.setInput('tabData', structuredClone(OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_MOCK));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  const missingAddresses: { description: string; address: MajorCreditorAddress }[] = [
    { description: 'null', address: null },
    { description: 'omitted', address: undefined },
    { description: 'empty object', address: {} },
    { description: 'null fields', address: { line_1: null, line_2: null, line_3: null, postcode: null } },
    { description: 'empty fields', address: { line_1: '', line_2: '', line_3: '', postcode: '' } },
    { description: 'whitespace fields', address: { line_1: ' ', line_2: '\t', line_3: ' ', postcode: ' ' } },
  ];

  describe.each(missingAddresses)('when the address is $description', ({ address }) => {
    it.each([true, false])(
      'should display the missing value and preserve BACS status when pay_by_bacs is %s',
      (payByBacs) => {
        component.tabData.major_creditor.address = address;
        component.tabData.major_creditor.pay_by_bacs = payByBacs;

        fixture.detectChanges();

        const value = getAddressValue();
        expect(value.querySelector('app-fines-not-provided')).not.toBeNull();
        expect(value.querySelector('[aria-hidden="true"]')?.textContent?.trim()).toBe('—');
        expect(value.querySelector('.govuk-visually-hidden')?.textContent?.trim()).toBe('No data');
        expect(fixture.nativeElement.querySelector('#is_bacs-badge').textContent.trim()).toBe(
          payByBacs ? 'Provided' : 'Not provided',
        );
        expect(fixture.nativeElement.textContent).toContain('TEST');
      },
    );
  });

  it('should preserve the address lines and uppercase the postcode', () => {
    component.tabData.major_creditor.address = {
      line_1: '1 Test Road',
      line_2: 'Suite 2',
      line_3: 'Hertford',
      postcode: 'sg13 8dq',
    };

    fixture.detectChanges();

    const value = getAddressValue();
    expect(value.textContent?.replace(/\s+/g, ' ').trim()).toBe('1 Test Road Suite 2 Hertford SG13 8DQ');
    expect(value.querySelectorAll('br')).toHaveLength(3);
    expect(value.querySelector('app-fines-not-provided')).toBeNull();
  });

  it('should display a partial address without blank lines', () => {
    component.tabData.major_creditor.address = { line_1: null, line_2: 'Suite 2', line_3: ' ', postcode: 'sg13 8dq' };

    fixture.detectChanges();

    const value = getAddressValue();
    expect(value.textContent?.replace(/\s+/g, ' ').trim()).toBe('Suite 2 SG13 8DQ');
    expect(value.querySelectorAll('br')).toHaveLength(1);
    expect(value.querySelector('app-fines-not-provided')).toBeNull();
  });

  it('should display a postcode-only address', () => {
    component.tabData.major_creditor.address = { postcode: 'sg13 8dq' };

    fixture.detectChanges();

    expect(getAddressValue().textContent?.trim()).toBe('SG13 8DQ');
    expect(getAddressValue().querySelector('br')).toBeNull();
  });

  it('should preserve the Central Fund exclusions for code, postcode and payout status', () => {
    fixture.componentRef.setInput('centralFund', true);
    component.tabData.major_creditor.name = 'Central Fund';

    fixture.detectChanges();

    expect(getAddressValue().textContent?.replace(/\s+/g, ' ').trim()).toBe('1 Test Road Test Test');
    expect(fixture.nativeElement.textContent).not.toContain('TE1 1ET');
    expect(fixture.nativeElement.textContent).not.toContain('(TEST)');
    expect(fixture.nativeElement.textContent).not.toContain('Payout status');
    expect(fixture.nativeElement.querySelector('#is_bacs-badge')).toBeNull();
  });

  it('should display the missing value for a Central Fund without an address', () => {
    fixture.componentRef.setInput('centralFund', true);
    component.tabData.major_creditor.address = null;

    fixture.detectChanges();

    expect(getAddressValue().querySelector('app-fines-not-provided')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#is_bacs-badge')).toBeNull();
  });
});
