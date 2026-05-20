import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesAccRemoveNonPayingPgComponent } from './fines-acc-remove-non-paying-pg.component';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_REMOVE_NON_PAYING_PG_SUCCESS_MESSAGE } from './constants/fines-acc-remove-non-paying-pg-success-message.constant';
import { FINES_ACC_DEFENDANT_DETAILS_TABS_KEYS } from '../fines-acc-defendant-details/constants/fines-acc-defendant-details-tabs-keys.constant';

describe('FinesAccRemoveNonPayingPgComponent', () => {
  let component: FinesAccRemoveNonPayingPgComponent;
  let mockRoute: ActivatedRoute;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockFinesAccStore: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;

  const createComponent = () => {
    const componentFixture = TestBed.createComponent(FinesAccRemoveNonPayingPgComponent);
    const componentInstance = componentFixture.componentInstance;
    componentFixture.detectChanges();

    return { componentFixture, componentInstance };
  };

  beforeEach(async () => {
    mockRoute = {
      snapshot: {
        data: {
          title: 'Are you sure you want to remove the parent or guardian details?',
        },
      },
    } as unknown as ActivatedRoute;

    mockRouter = {
      navigate: vi.fn(),
    };

    mockFinesAccStore = {
      getAccountNumber: signal('1234567890'),
      party_name: signal('Mr John SMITH'),
      account_id: signal(123),
      pg_party_id: signal('PG-123'),
      base_version: signal('8'),
      business_unit_id: signal('61'),
      setSuccessMessage: vi.fn(),
    };

    mockOpalFinesService = {
      clearAccountDetailsCache: vi.fn(),
      deleteDefendantAccountParty: vi.fn().mockReturnValue(of(null)),
    };

    TestBed.overrideComponent(FinesAccRemoveNonPayingPgComponent, {
      set: {
        template: '',
      },
    });

    await TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: FinesAccountStore, useValue: mockFinesAccStore },
        { provide: OpalFines, useValue: mockOpalFinesService },
      ],
    }).compileComponents();

    const createdComponent = createComponent();
    component = createdComponent.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise the page title and account identifier', () => {
    expect(component.pageTitle).toBe('Are you sure you want to remove the parent or guardian details?');
    expect(component.accountIdentifier).toBe('1234567890 – Mr John SMITH');
  });

  it('should use fallback page title when route title is missing', () => {
    mockRoute.snapshot.data = {};

    const { componentInstance } = createComponent();

    expect(componentInstance.pageTitle).toBe('Are you sure you want to remove the parent or guardian details?');
  });

  it('should use route title when route title is provided', () => {
    mockRoute.snapshot.data = {
      title: 'Remove parent or guardian details',
    };

    const { componentInstance } = createComponent();

    expect(componentInstance.pageTitle).toBe('Remove parent or guardian details');
  });

  it('should build account identifier with an empty party name when party name is null', () => {
    mockFinesAccStore.getAccountNumber = signal('1234567890');
    mockFinesAccStore.party_name = signal(null);

    const { componentInstance } = createComponent();

    expect(componentInstance.accountIdentifier).toBe('1234567890 – ');
  });

  it('should navigate back to the parent or guardian tab on cancel', () => {
    component.navigateToParentGuardianTab();

    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [`../../../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`],
      {
        relativeTo: mockRoute,
        fragment: FINES_ACC_DEFENDANT_DETAILS_TABS_KEYS['parent-or-guardian'],
      },
    );
  });

  it('should delete the parent guardian party and navigate to defendant tab on success', () => {
    component.handleRemoveParentGuardianDetails();

    expect(mockOpalFinesService.deleteDefendantAccountParty).toHaveBeenCalledWith(
      123,
      'PG-123',
      {
        defendant_account_party_id: 'PG-123',
      },
      '8',
      '61',
    );
    expect(mockOpalFinesService.clearAccountDetailsCache).toHaveBeenCalled();
    expect(mockFinesAccStore.setSuccessMessage).toHaveBeenCalledWith(FINES_ACC_REMOVE_NON_PAYING_PG_SUCCESS_MESSAGE);
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [`../../../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`],
      {
        relativeTo: mockRoute,
        fragment: FINES_ACC_DEFENDANT_DETAILS_TABS_KEYS.defendant,
      },
    );
  });

  it('should not set success message or navigate on delete failure', () => {
    mockOpalFinesService.deleteDefendantAccountParty.mockReturnValue(throwError(() => new Error('delete failed')));

    component.handleRemoveParentGuardianDetails();

    expect(mockFinesAccStore.setSuccessMessage).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate back to the parent or guardian tab if required delete data is missing', () => {
    mockFinesAccStore.pg_party_id = signal(null);

    const altFixture = TestBed.createComponent(FinesAccRemoveNonPayingPgComponent);
    const altComponent = altFixture.componentInstance;
    altFixture.detectChanges();

    altComponent.handleRemoveParentGuardianDetails();

    expect(mockOpalFinesService.deleteDefendantAccountParty).not.toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [`../../../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`],
      {
        relativeTo: mockRoute,
        fragment: FINES_ACC_DEFENDANT_DETAILS_TABS_KEYS['parent-or-guardian'],
      },
    );
  });
});
