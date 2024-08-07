import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacEmployerDetailsComponent } from './fines-mac-employer-details.component';

describe('FinesMacEmployerDetailsComponent', () => {
  let component: FinesMacEmployerDetailsComponent;
  let fixture: ComponentFixture<FinesMacEmployerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacEmployerDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacEmployerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
