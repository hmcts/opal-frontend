import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, RouterModule.forRoot([])],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(
      (request) =>
        request.url === '/opal-legacy-db-stub/opal' &&
        request.params.get('actionType') === 'searchDefendantAccounts',
    );
    req.flush('<response />');
    expect(component).toBeTruthy();
  });

  it('should call the legacy stub opal endpoint on init', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(
      (request) =>
        request.url === '/opal-legacy-db-stub/opal' &&
        request.params.get('actionType') === 'searchDefendantAccounts',
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ defendant: { postcode: 'AB1 2CD' } });
    expect(req.request.headers.get('Accept')).toBe('application/xml');
    expect(req.request.responseType).toBe('text');
    req.flush('<response><count>1</count></response>');
  });
});
