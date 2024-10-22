import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsMinorCreditorComponent } from './fines-mac-offence-details-minor-creditor.component';

describe('FinesMacOffenceDetailsMinorCreditorComponent', () => {
  let component: FinesMacOffenceDetailsMinorCreditorComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsMinorCreditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsMinorCreditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsMinorCreditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
