import { mount } from 'cypress/angular';
import { EnvironmentProviders, Provider, Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { IFinesMacState } from 'src/app/flows/fines/fines-mac/interfaces/fines-mac-state.interface';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';

/**
 * Local helper for MAC component tests that mount a single component against `FinesMacStore`.
 * Each mount gets a cloned state object, the shared manual-account route parent, and optional
 * submit/output wiring for components that expose a submit handler.
 */
interface IMountMacStoreComponentOptions<TState extends IFinesMacState> {
  additionalProviders?: Array<Provider | EnvironmentProviders>;
  component: Type<unknown>;
  componentProperties?: Record<string, unknown>;
  formSubmit?: (...args: any[]) => void;
  initialState: TState;
  onComponentReady?: (component: any) => void;
  routeSnapshotData?: Record<string, unknown>;
  submitHandlerName?: string;
}

export const mountMacStoreComponent = <TState extends IFinesMacState>({
  additionalProviders = [],
  component,
  componentProperties = {},
  formSubmit,
  initialState,
  onComponentReady,
  routeSnapshotData = {},
  submitHandlerName,
}: IMountMacStoreComponentOptions<TState>) => {
  const finesMacState = structuredClone(initialState);

  return mount(component, {
    providers: [
      OpalFines,
      ...additionalProviders,
      {
        provide: FinesMacStore,
        useFactory: () => {
          const store = new FinesMacStore();
          store.setFinesMacStore(finesMacState);
          return store;
        },
      },
      {
        provide: ActivatedRoute,
        useValue: {
          parent: of('manual-account-creation'),
          snapshot: {
            data: routeSnapshotData,
          },
        },
      },
    ],
    componentProperties,
  }).then(({ fixture }) => {
    const componentInstance: any = fixture.componentInstance as any;

    onComponentReady?.(componentInstance);

    if (formSubmit && submitHandlerName) {
      const submitHandler = componentInstance?.[submitHandlerName];

      if (submitHandler?.subscribe) {
        submitHandler.subscribe((...args: any[]) => formSubmit(...args));
      } else if (typeof submitHandler === 'function') {
        componentInstance[submitHandlerName] = formSubmit;
      }
    }

    if (formSubmit || onComponentReady) {
      fixture.detectChanges();
    }
  });
};
