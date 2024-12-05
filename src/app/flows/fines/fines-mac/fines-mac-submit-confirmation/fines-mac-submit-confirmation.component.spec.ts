import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacSubmitConfirmationComponent } from './fines-mac-submit-confirmation.component';

describe('FinesMacSubmitConfirmationComponent', () => {
  let component: FinesMacSubmitConfirmationComponent;
  let fixture: ComponentFixture<FinesMacSubmitConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacSubmitConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesMacSubmitConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
