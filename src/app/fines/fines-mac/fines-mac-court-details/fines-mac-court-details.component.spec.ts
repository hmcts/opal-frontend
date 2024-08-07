import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacCourtDetailsComponent } from './fines-mac-court-details.component';

describe('FinesMacCourtDetailsComponent', () => {
  let component: FinesMacCourtDetailsComponent;
  let fixture: ComponentFixture<FinesMacCourtDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacCourtDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacCourtDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
