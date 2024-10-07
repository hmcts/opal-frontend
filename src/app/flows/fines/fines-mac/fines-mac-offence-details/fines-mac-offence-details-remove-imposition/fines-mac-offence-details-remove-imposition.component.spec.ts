import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsRemoveImpositionComponent } from './fines-mac-offence-details-remove-imposition.component';

describe('FinesMacOffenceDetailsRemoveImpositionComponent', () => {
  let component: FinesMacOffenceDetailsRemoveImpositionComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsRemoveImpositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsRemoveImpositionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsRemoveImpositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
