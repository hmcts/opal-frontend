import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MacStateService, GlobalStateService } from '@services';
import { MANUAL_ACCOUNT_CREATION_STATE } from '@constants';
import { ManualAccountCreationComponent } from './manual-account-creation.component';

describe('ManualAccountCreationComponent', () => {
  let component: ManualAccountCreationComponent;
  let fixture: ComponentFixture<ManualAccountCreationComponent>;
  let macStateService: MacStateService;
  let globalStateService: GlobalStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualAccountCreationComponent],
      providers: [MacStateService],
    }).compileComponents();

    fixture = TestBed.createComponent(ManualAccountCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    macStateService = TestBed.inject(MacStateService);
    macStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_STATE;
    globalStateService = TestBed.inject(GlobalStateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call on destroy and clear state', () => {
    const destroy = spyOn(component, 'ngOnDestroy');

    component.ngOnDestroy();
    fixture.detectChanges();

    expect(destroy).toHaveBeenCalled();
    expect(macStateService.manualAccountCreation).toEqual(MANUAL_ACCOUNT_CREATION_STATE);
    expect(globalStateService.error()).toEqual({ error: false, message: '' });
  });

  it('should call handleBeforeUnload ', () => {
    macStateService.manualAccountCreation.stateChanges = true;
    macStateService.manualAccountCreation.unsavedChanges = false;
    expect(component.handleBeforeUnload()).toBeFalsy();

    macStateService.manualAccountCreation.stateChanges = false;
    macStateService.manualAccountCreation.unsavedChanges = true;
    expect(component.handleBeforeUnload()).toBeFalsy();

    macStateService.manualAccountCreation.stateChanges = false;
    macStateService.manualAccountCreation.unsavedChanges = false;
    expect(component.handleBeforeUnload()).toBeTruthy();
  });

  it('should call canDeactivate ', () => {
    // Empty state, should return true
    macStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_STATE;
    expect(component.canDeactivate()).toBeTruthy();

    macStateService.manualAccountCreation.stateChanges = true;
    expect(component.canDeactivate()).toBeFalsy();

    macStateService.manualAccountCreation.stateChanges = false;
    expect(component.canDeactivate()).toBeTruthy();
  });
});
