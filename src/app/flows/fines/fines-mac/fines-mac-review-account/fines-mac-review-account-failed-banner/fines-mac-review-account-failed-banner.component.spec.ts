import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountFailedBannerComponent } from './fines-mac-review-account-failed-banner.component';
import { FinesDraftStoreType } from '../../../fines-draft/stores/types/fines-draft.type';
import { FinesDraftStore } from '../../../fines-draft/stores/fines-draft.store';
import { FINES_DRAFT_BANNER_MESSAGES } from '../../../fines-draft/stores/constants/fines-draft-store-banner-messages.constant';

describe('FinesMacReviewAccountFailedBannerComponent', () => {
  let component: FinesMacReviewAccountFailedBannerComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountFailedBannerComponent>;
  let finesDraftStore: FinesDraftStoreType;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountFailedBannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountFailedBannerComponent);
    component = fixture.componentInstance;

    finesDraftStore = TestBed.inject(FinesDraftStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set banner message on init', () => {
    const expectedMessage = FINES_DRAFT_BANNER_MESSAGES.error();

    component.ngOnInit();

    expect(finesDraftStore.bannerMessage()).toEqual(expectedMessage);
  });

  it('should reset banner message on destroy', () => {
    component.ngOnDestroy();

    expect(finesDraftStore.bannerMessage()).toEqual('');
  });
});
