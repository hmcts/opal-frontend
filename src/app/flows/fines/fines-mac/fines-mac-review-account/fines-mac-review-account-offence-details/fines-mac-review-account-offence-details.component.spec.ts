import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountOffenceDetailsComponent } from './fines-mac-review-account-offence-details.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('FinesMacReviewAccountOffenceDetailsComponent', () => {
  let component: FinesMacReviewAccountOffenceDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountOffenceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountOffenceDetailsComponent],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountOffenceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit changeOffenceDetails event when changeOffenceDetails is called', () => {
    spyOn(component.emitChangeOffenceDetails, 'emit');

    component.changeOffenceDetails();

    expect(component.emitChangeOffenceDetails.emit).toHaveBeenCalled();
  });
});
