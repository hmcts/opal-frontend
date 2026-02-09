import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsRemoveMinorCreditorComponent } from './fines-mac-offence-details-remove-minor-creditor.component';

import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK } from '../fines-mac-offence-details-minor-creditor/mocks/fines-mac-offence-details-minor-creditor-form.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../mocks/fines-mac-offence-details-form.mock';
import { FinesMacOffenceDetailsStoreType } from '../stores/types/fines-mac-offence-details.type';
import { FinesMacOffenceDetailsStore } from '../stores/fines-mac-offence-details.store';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createSpyObj } from '@app/testing/create-spy-obj.helper';

describe('FinesMacOffenceDetailsRemoveMinorCreditorComponent', () => {
  let component: FinesMacOffenceDetailsRemoveMinorCreditorComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsRemoveMinorCreditorComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockUtilsService: any;
  let finesMacOffenceDetailsStore: FinesMacOffenceDetailsStoreType;

  beforeEach(async () => {
    mockUtilsService = createSpyObj(UtilsService, ['formatSortCode', 'upperCaseFirstLetter']);

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsRemoveMinorCreditorComponent],
      providers: [
        { provide: UtilsService, useValue: mockUtilsService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('offence-details'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsRemoveMinorCreditorComponent);
    component = fixture.componentInstance;

    const offenceDetailsWithMinorCreditor = structuredClone([FINES_MAC_OFFENCE_DETAILS_FORM_MOCK]);
    offenceDetailsWithMinorCreditor[0].childFormData = [FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK];
    finesMacOffenceDetailsStore = TestBed.inject(FinesMacOffenceDetailsStore);
    finesMacOffenceDetailsStore.setOffenceDetailsDraft(offenceDetailsWithMinorCreditor);
    finesMacOffenceDetailsStore.setRowIndex(0);
    finesMacOffenceDetailsStore.setRemoveMinorCreditor(0);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find the index of a minor creditor with the given imposition position', () => {
    const actualIndex = component['findMinorCreditorIndex'](0);

    expect(actualIndex).toBe(0);
  });

  it('should remove minor creditor when confirmMinorCreditorRemoval is called', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routerSpy = vi.spyOn<any, any>(component['router'], 'navigate');

    component.confirmMinorCreditorRemoval();

    expect(finesMacOffenceDetailsStore.offenceDetailsDraft()[0].childFormData).not.toContain(
      FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK,
    );
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence], {
      relativeTo: component['activatedRoute'].parent,
    });
  });
});
