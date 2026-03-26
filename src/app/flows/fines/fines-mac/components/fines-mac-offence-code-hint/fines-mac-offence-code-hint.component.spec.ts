import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgTemplateOutlet } from '@angular/common';
import { MojTicketPanelComponent } from '@hmcts/opal-frontend-common/components/moj/moj-ticket-panel';
import { FinesMacOffenceCodeHintComponent } from './fines-mac-offence-code-hint.component';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { beforeEach, describe, expect, it } from 'vitest';

describe('FinesMacOffenceCodeHintComponent', () => {
  let component: FinesMacOffenceCodeHintComponent;
  let fixture: ComponentFixture<FinesMacOffenceCodeHintComponent>;

  const mockOffenceCode: IOpalFinesOffencesRefData = OPAL_FINES_OFFENCES_REF_DATA_MOCK;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceCodeHintComponent, NgTemplateOutlet, MojTicketPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceCodeHintComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.componentRef.setInput('offenceCode', mockOffenceCode);
    fixture.componentRef.setInput('selectedOffenceConfirmation', false);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should accept offenceCode input', () => {
    fixture.componentRef.setInput('offenceCode', mockOffenceCode);
    fixture.detectChanges();

    expect(component.offenceCode).toEqual(mockOffenceCode);
  });

  it('should accept selectedOffenceConfirmation input as false', () => {
    fixture.componentRef.setInput('selectedOffenceConfirmation', false);
    fixture.detectChanges();

    expect(component.selectedOffenceConfirmation).toBe(false);
  });

  it('should accept selectedOffenceConfirmation input as true', () => {
    fixture.componentRef.setInput('offenceCode', mockOffenceCode);
    fixture.componentRef.setInput('selectedOffenceConfirmation', true);
    fixture.detectChanges();

    expect(component.selectedOffenceConfirmation).toBe(true);
  });

  it('should render component with both inputs provided', () => {
    fixture.componentRef.setInput('offenceCode', mockOffenceCode);
    fixture.componentRef.setInput('searchedOffenceCode', 'AK123456');
    fixture.componentRef.setInput('selectedOffenceConfirmation', true);
    fixture.detectChanges();

    expect(component.offenceCode).toEqual(mockOffenceCode);
    expect(component.selectedOffenceConfirmation).toBe(true);
  });

  it('should handle undefined offenceCode gracefully', () => {
    fixture.componentRef.setInput('offenceCode', undefined);
    fixture.componentRef.setInput('selectedOffenceConfirmation', false);

    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should maintain component state through input changes', () => {
    // Initial state
    fixture.componentRef.setInput('offenceCode', mockOffenceCode);
    fixture.componentRef.setInput('searchedOffenceCode', 'AK123456');
    fixture.componentRef.setInput('selectedOffenceConfirmation', false);
    fixture.detectChanges();

    expect(component.selectedOffenceConfirmation).toBe(false);

    // Update state
    fixture.componentRef.setInput('selectedOffenceConfirmation', true);
    fixture.detectChanges();

    expect(component.selectedOffenceConfirmation).toBe(true);
    expect(component.offenceCode).toEqual(mockOffenceCode);
  });

  it('should render Offence found when the searched code matches one result exactly', () => {
    const multipleMatchResponse: IOpalFinesOffencesRefData = {
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

    fixture.componentRef.setInput('offenceCode', multipleMatchResponse);
    fixture.componentRef.setInput('searchedOffenceCode', 'CD71039');
    fixture.componentRef.setInput('selectedOffenceConfirmation', true);
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('Offence found');
    expect(textContent).toContain('Criminal damage to property valued under £5000');
  });

  it('should render Offence not found when there is no exact code match', () => {
    fixture.componentRef.setInput('offenceCode', mockOffenceCode);
    fixture.componentRef.setInput('searchedOffenceCode', 'AK12345');
    fixture.componentRef.setInput('selectedOffenceConfirmation', true);
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('Offence not found');
    expect(textContent).toContain('Enter a valid offence code');
  });
});
