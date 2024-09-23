import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsFormComponent } from './fines-mac-offence-details-form.component';

describe('FinesMacOffenceDetailsFormComponent', () => {
  let component: FinesMacOffenceDetailsFormComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
