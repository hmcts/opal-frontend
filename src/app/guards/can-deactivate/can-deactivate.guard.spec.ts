import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { canDeactivateGuard } from '@guards/can-deactivate/can-deactivate.guard';
import { ICanDeactivateCanComponentDeactivate } from '@guards/can-deactivate/interfaces/can-deactivate-can-component-deactivate.interface';

describe('canDeactivateGuard', () => {
  let mockComponent: ICanDeactivateCanComponentDeactivate | null;
  let mockCurrentRoute: ActivatedRouteSnapshot | null;
  let mockCurrentState: RouterStateSnapshot | null;
  let mockNextState: RouterStateSnapshot | null;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    mockCurrentRoute = {} as ActivatedRouteSnapshot;
    mockCurrentState = {} as RouterStateSnapshot;
    mockNextState = {} as RouterStateSnapshot;
  });

  afterAll(() => {
    mockComponent = null;
    mockCurrentRoute = null;
    mockCurrentState = null;
    mockNextState = null;
    TestBed.resetTestingModule();
  });

  it('should return true if canDeactivate method of component returns true', () => {
    if (!mockCurrentRoute || !mockCurrentState || !mockNextState) {
      fail('Required properties not properly initialised');
      return;
    }

    mockComponent = {
      canDeactivate: jasmine.createSpy('canDeactivate').and.returnValue(true),
    };

    const result = canDeactivateGuard(mockComponent, mockCurrentRoute, mockCurrentState, mockNextState);

    expect(result).toBeTrue();
    expect(mockComponent.canDeactivate).toHaveBeenCalled();
  });

  it('should return false if canDeactivate method of component returns false and user clicks Cancel', () => {
    if (!mockCurrentRoute || !mockCurrentState || !mockNextState) {
      fail('Required properties not properly initialised');
      return;
    }

    mockComponent = {
      canDeactivate: jasmine.createSpy('canDeactivate').and.returnValue(false),
    };

    spyOn(window, 'confirm').and.returnValue(false); // Simulate user clicking Cancel

    const result = canDeactivateGuard(mockComponent, mockCurrentRoute, mockCurrentState, mockNextState);

    expect(result).toBeFalse();
    expect(mockComponent.canDeactivate).toHaveBeenCalled();
    expect(window.confirm).toHaveBeenCalledWith(
      'WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.',
    );
  });

  it('should return true if canDeactivate method of component returns false and user clicks OK', () => {
    if (!mockCurrentRoute || !mockCurrentState || !mockNextState) {
      fail('Required properties not properly initialised');
      return;
    }

    mockComponent = {
      canDeactivate: jasmine.createSpy('canDeactivate').and.returnValue(false),
    };

    spyOn(window, 'confirm').and.returnValue(true); // Simulate user clicking OK

    const result = canDeactivateGuard(mockComponent, mockCurrentRoute, mockCurrentState, mockNextState);

    expect(result).toBeTrue();
    expect(mockComponent.canDeactivate).toHaveBeenCalled();
    expect(window.confirm).toHaveBeenCalledWith(
      'WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.',
    );
  });
});
