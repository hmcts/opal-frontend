import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent } from './fines-mac-offence-details-search-offences-results-table-wrapper.component';

describe('FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent', () => {
  let component: FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
