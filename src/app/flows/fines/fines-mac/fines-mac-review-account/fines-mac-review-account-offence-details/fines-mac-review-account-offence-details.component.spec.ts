import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacReviewAccountOffenceDetailsComponent } from './fines-mac-review-account-offence-details.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('FinesMacReviewAccountOffenceDetailsComponent', () => {
  let component: FinesMacReviewAccountOffenceDetailsComponent | null;
  let fixture: ComponentFixture<FinesMacReviewAccountOffenceDetailsComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountOffenceDetailsComponent],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountOffenceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit changeOffenceDetails event when changeOffenceDetails is called', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    spyOn(component.emitChangeOffenceDetails, 'emit');

    component.changeOffenceDetails();

    expect(component.emitChangeOffenceDetails.emit).toHaveBeenCalled();
  });
});
