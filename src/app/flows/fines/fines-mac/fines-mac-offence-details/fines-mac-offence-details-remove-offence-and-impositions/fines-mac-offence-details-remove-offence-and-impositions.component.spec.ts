import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent } from './fines-mac-offence-details-remove-offence-and-impositions.component';

describe('FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent', () => {
  let component: FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
