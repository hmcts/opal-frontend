import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesComponent } from './fines.component';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GLOBAL_ERROR_STATE } from '@hmcts/opal-frontend-common/stores/global/constants';
import { FinesDraftStoreType } from './fines-draft/stores/types/fines-draft.type';
import { FinesDraftStore } from './fines-draft/stores/fines-draft.store';
import { OpalFines } from './services/opal-fines-service/opal-fines.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesComponent', () => {
  let component: FinesComponent;
  let fixture: ComponentFixture<FinesComponent>;
  let finesDraftStore: FinesDraftStoreType;
  let globalStore: GlobalStoreType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;

  beforeEach(async () => {
    mockOpalFinesService = {
      clearAllCaches: vi.fn().mockName('OpalFines.clearAllCaches'),
    };

    await TestBed.configureTestingModule({
      imports: [FinesComponent],
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesComponent);
    component = fixture.componentInstance;

    finesDraftStore = TestBed.inject(FinesDraftStore);

    globalStore = TestBed.inject(GlobalStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call on destroy and clear state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(finesDraftStore, 'resetStore');

    component.ngOnDestroy();
    fixture.detectChanges();

    expect(globalStore.bannerError()).toEqual({ ...GLOBAL_ERROR_STATE });
    expect(finesDraftStore.resetStore).toHaveBeenCalled();
    expect(mockOpalFinesService.clearAllCaches).toHaveBeenCalled();
  });
});
