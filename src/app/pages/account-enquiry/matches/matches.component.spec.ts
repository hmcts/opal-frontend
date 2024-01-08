import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesComponent } from './matches.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AccountEnquiryRoutes } from '@enums';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StateService } from '@services';
import { SEARCH_STATE_MOCK } from '@mocks';

describe('MatchesComponent', () => {
  let component: MatchesComponent;
  let fixture: ComponentFixture<MatchesComponent>;
  let router: Router;
  let stateService: StateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchesComponent, RouterTestingModule, HttpClientTestingModule, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchesComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    stateService = TestBed.inject(StateService);
    stateService.accountEnquiry.set({ search: SEARCH_STATE_MOCK });

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
});
