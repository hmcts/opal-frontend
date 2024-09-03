import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { canDeactivateGuard } from '@guards';
import { ICanDeactivateCanComponentDeactivate } from '@interfaces';

describe('canDeactivateGuard', () => {
  let mockComponent: ICanDeactivateCanComponentDeactivate;
  let mockCurrentRoute: ActivatedRouteSnapshot;
  let mockCurrentState: RouterStateSnapshot;
  let mockNextState: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    mockCurrentRoute = {} as ActivatedRouteSnapshot;
    mockCurrentState = {} as RouterStateSnapshot;
    mockNextState = {} as RouterStateSnapshot;
  });

  it('should return true if canDeactivate method of component returns true', () => {
    mockComponent = {
      canDeactivate: jasmine.createSpy('canDeactivate').and.returnValue(true),
    };

    const result = canDeactivateGuard(mockComponent, mockCurrentRoute, mockCurrentState, mockNextState);

    expect(result).toBeTrue();
    expect(mockComponent.canDeactivate).toHaveBeenCalled();
  });

  it('should return false if canDeactivate method of component returns false and user clicks Cancel', () => {
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
