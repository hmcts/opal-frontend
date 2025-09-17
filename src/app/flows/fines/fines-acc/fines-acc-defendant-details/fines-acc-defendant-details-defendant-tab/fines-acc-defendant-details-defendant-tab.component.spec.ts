import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDefendantDetailsDefendantTabComponent } from './fines-acc-defendant-details-defendant-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_DEFENDANT_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-defendant-tab-ref-data.mock';

describe('FinesAccDefendantDetailsAtAGlanceTabComponent', () => {
  let component: FinesAccDefendantDetailsDefendantTabComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsDefendantTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsDefendantTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsDefendantTabComponent);
    component = fixture.componentInstance;
    component.tabData = OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_DEFENDANT_TAB_REF_DATA_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
