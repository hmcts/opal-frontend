import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDefendantDetailsAtAGlanceTabComponent } from './fines-acc-defendant-details-at-a-glance-tab.component';
import { OPAL_FINES_ACCOUNT_DETAILS_AT_A_GLANCE_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-details-at-a-glance-tab-ref-data.mock';

describe('FinesAccDefendantDetailsAtAGlanceTabComponent', () => {
  let component: FinesAccDefendantDetailsAtAGlanceTabComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsAtAGlanceTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsAtAGlanceTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsAtAGlanceTabComponent);
    component = fixture.componentInstance;
    component.tabData = OPAL_FINES_ACCOUNT_DETAILS_AT_A_GLANCE_TAB_REF_DATA_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
