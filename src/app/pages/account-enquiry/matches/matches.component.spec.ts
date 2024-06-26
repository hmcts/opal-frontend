import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchesComponent } from './matches.component';
import { Router, provideRouter } from '@angular/router';
import { AccountEnquiryRoutes } from '@enums';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SEARCH_STATE_MOCK } from '@mocks';
import { AeStateService } from '@services';

describe('MatchesComponent', () => {
  let component: MatchesComponent;
  let fixture: ComponentFixture<MatchesComponent>;
  let router: Router;
  let aeStateService: AeStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchesComponent, HttpClientTestingModule, BrowserAnimationsModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchesComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    aeStateService = TestBed.inject(AeStateService);
    aeStateService.accountEnquiry = { search: SEARCH_STATE_MOCK };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back to account search', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.handleBack();
    expect(navigateSpy).toHaveBeenCalledWith([AccountEnquiryRoutes.search]);
  });

  it('should have state and populate data$', () => {
    expect(component.data$).not.toBeUndefined();
  });

  it('should navigate to defendant account details', () => {
    const defendantAccountId = 123;
    const navigateSpy = spyOn(router, 'navigate');

    component.handleViewDefendantAccount(defendantAccountId);

    expect(navigateSpy).toHaveBeenCalledWith([AccountEnquiryRoutes.details, defendantAccountId]);
  });
});
