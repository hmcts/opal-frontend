import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesComponent } from './fines.component';
import { FinesService } from '@services/fines';
import { GlobalStateService } from '@services';
import { FINES_MAC__STATE_MOCK } from '@mocks/fines/mac';

describe('FinesComponent', () => {
  let component: FinesComponent;
  let fixture: ComponentFixture<FinesComponent>;
  let mockFinesService: FinesService;
  let mockGlobalStateService: GlobalStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesComponent);
    component = fixture.componentInstance;

    mockFinesService = TestBed.inject(FinesService);
    mockFinesService.finesMacState = FINES_MAC__STATE_MOCK;
    mockGlobalStateService = TestBed.inject(GlobalStateService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call on destroy and clear state', () => {
    const destroy = spyOn(component, 'ngOnDestroy');

    component.ngOnDestroy();
    fixture.detectChanges();

    expect(destroy).toHaveBeenCalled();
    expect(mockFinesService.finesMacState).toEqual(FINES_MAC__STATE_MOCK);
    expect(mockGlobalStateService.error()).toEqual({ error: false, message: '' });
  });
});
