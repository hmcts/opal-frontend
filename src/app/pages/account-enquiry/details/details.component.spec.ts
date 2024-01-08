import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DetailsComponent } from './details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DEFENDANT_ACCOUNT_DETAILS_MOCK } from '@mocks';
import { DefendantAccountService } from '@services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountEnquiryRoutes } from '@enums';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsComponent, RouterTestingModule, HttpClientTestingModule],

      providers: [
        DefendantAccountService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ defendantAccountId: 123 }), // Mock the route params
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch defendant account details on initial setup', () => {
    spyOn(component['defendantAccountService'], 'getDefendantAccountDetails').and.returnValue(
      of(DEFENDANT_ACCOUNT_DETAILS_MOCK),
    );
    component['initialSetup']();
    expect(component['defendantAccountService'].getDefendantAccountDetails).toHaveBeenCalledWith(123);
    expect(component.data$).toBeDefined();
  });

  it('should navigate to matches page on handleBack', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.handleBack();
    expect(routerSpy).toHaveBeenCalledWith([AccountEnquiryRoutes.matches]);
  });
});
