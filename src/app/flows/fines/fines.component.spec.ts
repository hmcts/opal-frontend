import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesComponent } from './fines.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_STATE_MOCK } from '../fines/fines-mac/mocks/fines-mac-state.mock';
import { GlobalStore } from 'src/app/stores/global/global.store';

describe('FinesComponent', () => {
  let component: FinesComponent;
  let fixture: ComponentFixture<FinesComponent>;
  let mockFinesService: FinesService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let globalStore: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesComponent);
    component = fixture.componentInstance;

    mockFinesService = TestBed.inject(FinesService);
    mockFinesService.finesMacState = { ...FINES_MAC_STATE_MOCK };

    globalStore = TestBed.inject(GlobalStore);

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
    expect(mockFinesService.finesMacState).toEqual(FINES_MAC_STATE_MOCK);
    expect(globalStore.error()).toEqual({ error: false, message: '' });
  });
});
