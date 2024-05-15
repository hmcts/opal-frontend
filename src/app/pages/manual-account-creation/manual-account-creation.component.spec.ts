import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualAccountCreationComponent } from './manual-account-creation.component';

describe('ManualAccountCreationComponent', () => {
  let component: ManualAccountCreationComponent;
  let fixture: ComponentFixture<ManualAccountCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualAccountCreationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManualAccountCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
