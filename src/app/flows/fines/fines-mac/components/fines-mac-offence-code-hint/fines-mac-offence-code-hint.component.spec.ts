import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgTemplateOutlet } from '@angular/common';
import { MojTicketPanelComponent } from '@hmcts/opal-frontend-common/components/moj/moj-ticket-panel';
import { FinesMacOffenceCodeHintComponent } from './fines-mac-offence-code-hint.component';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';

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
    fixture.componentRef.setInput('selectedOffenceConfirmation', false);
    fixture.detectChanges();

    expect(component.selectedOffenceConfirmation).toBe(false);

    // Update state
    fixture.componentRef.setInput('selectedOffenceConfirmation', true);
    fixture.detectChanges();

    expect(component.selectedOffenceConfirmation).toBe(true);
    expect(component.offenceCode).toEqual(mockOffenceCode);
  });
});
