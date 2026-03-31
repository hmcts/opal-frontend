import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let globalStore: GlobalStoreType;

  const permissionsServiceMock = {
    getUniquePermissions: vi.fn().mockReturnValue([1, 5, 6, 13]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, RouterModule.forRoot([])],
      providers: [{ provide: PermissionsService, useValue: permissionsServiceMock }],
    }).compileComponents();

    globalStore = TestBed.inject(GlobalStore);
    globalStore.setUserState(structuredClone(OPAL_USER_STATE_MOCK));

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render dashboard navigation links with govuk-link--no-visited-state', () => {
    const expectedLinkIds = [
      'finesCavCheckerLink',
      'finesCavInputterLink',
      'finesSaSearchLink',
      'finesConsolidationLink',
    ];

    expectedLinkIds.forEach((linkId) => {
      const link = fixture.nativeElement.querySelector(`#${linkId}`) as HTMLAnchorElement | null;

      expect(link).toBeTruthy();
      if (!link) throw new Error(`Dashboard link not found: ${linkId}`);

      expect(link.classList.contains('govuk-link')).toBe(true);
      expect(link.classList.contains('govuk-link--no-visited-state')).toBe(true);
      expect(link.getAttribute('tabindex')).toBeNull();
    });
  });
});
