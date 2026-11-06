import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccMajorCreditorDetailsAtAGlanceTabComponent } from './fines-acc-major-creditor-details-at-a-glance-tab.component';
import { beforeEach, describe, expect, it } from 'vitest';
import { OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_MOCK } from '../../../services/opal-fines-service/mocks/opal-fines-account-major-creditor-at-a-glance-with-defendant.mock';

describe('FinesAccMajorCreditorDetailsAtAGlanceTabComponent', () => {
  let component: FinesAccMajorCreditorDetailsAtAGlanceTabComponent;
  let fixture: ComponentFixture<FinesAccMajorCreditorDetailsAtAGlanceTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccMajorCreditorDetailsAtAGlanceTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccMajorCreditorDetailsAtAGlanceTabComponent);
    component = fixture.componentInstance;
    component.tabData = OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
