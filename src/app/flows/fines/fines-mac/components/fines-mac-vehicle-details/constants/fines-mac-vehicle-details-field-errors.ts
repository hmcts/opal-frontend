import { IFinesMacVehicleDetailsFieldErrors } from '../interfaces';

export const FINES_MAC_VEHICLE_DETAILS_FIELD_ERRORS: IFinesMacVehicleDetailsFieldErrors = {
  VehicleMake: {
    maxlength: {
      message: `The make of car must be 30 characters or fewer`,
      priority: 1,
    },
  },
  VehicleRegistrationMark: {
    maxlength: {
      message: `The registration number must be 11 characters or fewer`,
      priority: 1,
    },
  },
};
