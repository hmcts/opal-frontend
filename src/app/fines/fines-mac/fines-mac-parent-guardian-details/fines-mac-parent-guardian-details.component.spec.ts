import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacParentGuardianDetailsComponent } from './fines-mac-parent-guardian-details.component';

describe('FinesMacParentGuardianDetailsComponent', () => {
  let component: FinesMacParentGuardianDetailsComponent;
  let fixture: ComponentFixture<FinesMacParentGuardianDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacParentGuardianDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacParentGuardianDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
