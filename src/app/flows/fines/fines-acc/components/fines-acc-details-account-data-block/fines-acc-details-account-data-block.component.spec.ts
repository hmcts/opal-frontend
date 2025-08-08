import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDetailsAccountDataBlockComponent } from './fines-acc-details-account-data-block.component';
import { OPAL_FINES_ACCOUNT_DETAILS_AT_A_GLANCE_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-details-tab-ref-data.mock';

describe('FinesAccDetailsAccountDataBlockComponent', () => {
  let component: FinesAccDetailsAccountDataBlockComponent;
  let fixture: ComponentFixture<FinesAccDetailsAccountDataBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDetailsAccountDataBlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDetailsAccountDataBlockComponent);
    component = fixture.componentInstance;
    component.blockData = OPAL_FINES_ACCOUNT_DETAILS_AT_A_GLANCE_TAB_REF_DATA_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
