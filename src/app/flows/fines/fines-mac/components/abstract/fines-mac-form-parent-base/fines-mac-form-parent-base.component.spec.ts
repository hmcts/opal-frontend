import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMacStore } from '../../../stores/fines-mac.store';
import { FinesMacStoreType } from '../../../stores/types/fines-mac-store.type';
import { FINES_MAC_STATE_MOCK } from '../../../mocks/fines-mac-state.mock';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../../constants/fines-mac-defendant-types-keys';
import { FINES_MAC_ROUTING_PATHS } from '../../../routing/constants/fines-mac-routing-paths.constant';
import { IFinesMacRoutingNestedRoutes } from '../../../routing/interfaces/fines-mac-routing-nested-routes.interface';
import {
  FinesMacFormParentBaseComponent,
  TFinesMacNestedRouteNavigationResult,
} from './fines-mac-form-parent-base.component';

@Component({
  selector: 'app-test-fines-mac-form-parent-base',
  template: '',
})
class TestFinesMacFormParentBaseComponent extends FinesMacFormParentBaseComponent {
  public testNavigateToNestedRoute(
    nestedRouteKey: keyof IFinesMacRoutingNestedRoutes,
  ): TFinesMacNestedRouteNavigationResult {
    return this.navigateToNestedRoute(nestedRouteKey);
  }

  public testHandleNestedFlowNavigation(nestedRouteKey: keyof IFinesMacRoutingNestedRoutes): void {
    this.handleNestedFlowNavigation(nestedRouteKey);
  }
}

describe('FinesMacFormParentBaseComponent', () => {
  let component: TestFinesMacFormParentBaseComponent;
  let fixture: ComponentFixture<TestFinesMacFormParentBaseComponent>;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestFinesMacFormParentBaseComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestFinesMacFormParentBaseComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    fixture.detectChanges();
  });

  it('should navigate to the configured nested route', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routerSpy = vi.spyOn<any, any>(component['router'], 'navigate');
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;

    const result = component.testNavigateToNestedRoute('personalDetails');

    expect(result).toBe('navigated');
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.contactDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should return missingDefendantType when defendant type is unavailable', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routerSpy = vi.spyOn<any, any>(component['router'], 'navigate');
    component.defendantType = undefined as unknown as string;

    const result = component.testNavigateToNestedRoute('personalDetails');

    expect(result).toBe('missingDefendantType');
    expect(routerSpy).not.toHaveBeenCalled();
  });

  it('should return routeNotConfigured when the route is explicitly unavailable for the defendant type', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routerSpy = vi.spyOn<any, any>(component['router'], 'navigate');
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.company;

    const result = component.testNavigateToNestedRoute('personalDetails');

    expect(result).toBe('routeNotConfigured');
    expect(routerSpy).not.toHaveBeenCalled();
  });

  it('should fall back to account details when nested flow has no defendant type', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routerSpy = vi.spyOn<any, any>(component['router'], 'navigate');
    component.defendantType = undefined as unknown as string;

    component.testHandleNestedFlowNavigation('personalDetails');

    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should not navigate when nested flow route is explicitly unavailable for the defendant type', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routerSpy = vi.spyOn<any, any>(component['router'], 'navigate');
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.company;

    component.testHandleNestedFlowNavigation('personalDetails');

    expect(routerSpy).not.toHaveBeenCalled();
  });

  it('should update unsaved changes in the Fines MAC store and parent state', () => {
    component.handleUnsavedChanges(true);
    expect(finesMacStore.unsavedChanges()).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(finesMacStore.unsavedChanges()).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});
