import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StateService } from '@services';
import { MANUAL_ACCOUNT_CREATION_STATE } from '@constants';
import { ManualAccountCreationComponent } from './manual-account-creation.component';

describe('ManualAccountCreationComponent', () => {
  let component: ManualAccountCreationComponent;
  let fixture: ComponentFixture<ManualAccountCreationComponent>;
  let stateService: StateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualAccountCreationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManualAccountCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    stateService = TestBed.inject(StateService);
    stateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_STATE;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call on destroy and clear state', () => {
    const destroy = spyOn(component, 'ngOnDestroy');

    component.ngOnDestroy();
    fixture.detectChanges();

    expect(destroy).toHaveBeenCalled();
    expect(stateService.manualAccountCreation).toEqual(MANUAL_ACCOUNT_CREATION_STATE);
    expect(stateService.error()).toEqual({ error: false, message: '' });
  });

  it('should call handleBeforeUnload ', () => {
    stateService.manualAccountCreation.stateChanges = true;
    stateService.manualAccountCreation.unsavedChanges = false;
    expect(component.handleBeforeUnload()).toBeFalsy();

    stateService.manualAccountCreation.stateChanges = false;
    stateService.manualAccountCreation.unsavedChanges = true;
    expect(component.handleBeforeUnload()).toBeFalsy();

    stateService.manualAccountCreation.stateChanges = false;
    stateService.manualAccountCreation.unsavedChanges = false;
    expect(component.handleBeforeUnload()).toBeTruthy();
  });

  it('should call canDeactivate ', () => {
    // Empty state, should return true
    stateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_STATE;
    expect(component.canDeactivate()).toBeTruthy();

    stateService.manualAccountCreation.stateChanges = true;
    stateService.manualAccountCreation.unsavedChanges = false;
    expect(component.canDeactivate()).toBeFalsy();

    stateService.manualAccountCreation.stateChanges = false;
    stateService.manualAccountCreation.unsavedChanges = true;
    expect(component.canDeactivate()).toBeTruthy();
  });
});
