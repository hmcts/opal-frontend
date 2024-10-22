import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsMinorCreditorFormComponent } from './fines-mac-offence-details-minor-creditor-form.component';

describe('FinesMacOffenceDetailsMinorCreditorFormComponent', () => {
  let component: FinesMacOffenceDetailsMinorCreditorFormComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsMinorCreditorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsMinorCreditorFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsMinorCreditorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
