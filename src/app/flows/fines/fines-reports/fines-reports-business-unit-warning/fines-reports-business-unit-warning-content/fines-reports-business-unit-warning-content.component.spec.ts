import { ComponentRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesReportsBusinessUnitWarningContentComponent } from './fines-reports-business-unit-warning-content.component';

describe('FinesReportsBusinessUnitWarningContentComponent', () => {
  const setup = async (selectedBusinessUnitCount = 4) => {
    await TestBed.configureTestingModule({
      imports: [FinesReportsBusinessUnitWarningContentComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FinesReportsBusinessUnitWarningContentComponent);
    const component = fixture.componentInstance;
    const componentRef: ComponentRef<FinesReportsBusinessUnitWarningContentComponent> = fixture.componentRef;

    componentRef.setInput('selectedBusinessUnitCount', selectedBusinessUnitCount);
    fixture.detectChanges();

    return { component, fixture };
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the static warning content using the selected business unit count', async () => {
    const { fixture } = await setup(4);

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('You have selected 4 business units');
    expect(fixture.nativeElement.textContent).toContain('The report creation may time out due to too much data.');
  });

  it('should emit a continue request when Continue is selected', async () => {
    const { component } = await setup();
    const continueRequestedSpy = vi.fn();

    component.continueRequested.subscribe(continueRequestedSpy);
    component.handleContinue();

    expect(continueRequestedSpy).toHaveBeenCalledOnce();
  });

  it('should emit a go back request when Go back is selected', async () => {
    const { component } = await setup();
    const goBackRequestedSpy = vi.fn();

    component.goBackRequested.subscribe(goBackRequestedSpy);
    component.handleGoBack();

    expect(goBackRequestedSpy).toHaveBeenCalledOnce();
  });
});
