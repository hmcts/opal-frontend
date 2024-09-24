import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsSearchOffencesComponent } from './fines-mac-offence-details-search-offences.component';

describe('FinesMacOffenceDetailsSearchOffencesComponent', () => {
  let component: FinesMacOffenceDetailsSearchOffencesComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsSearchOffencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsSearchOffencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
