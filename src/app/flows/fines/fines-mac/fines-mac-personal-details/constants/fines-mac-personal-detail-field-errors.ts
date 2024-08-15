import { IFinesMacPersonalDetailsFieldErrors } from '../interfaces';

export const FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS: IFinesMacPersonalDetailsFieldErrors = {
  Title: {
    required: {
      message: 'Select a title',
      priority: 1,
    },
  },
  Forenames: {
    required: {
      message: `Enter defendant's first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `The defendant's first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The defendant's first name(s) must only contain alphabetical text`,
      priority: 2,
    },
  },
  Surname: {
    required: {
      message: `Enter defendant's last name`,
      priority: 1,
    },
    maxlength: {
      message: `The defendant's last name must be 30 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The defendant's last name must only contain alphabetical text`,
      priority: 2,
    },
  },
  AliasForenames_0: {
    required: {
      message: `Enter first name(s) for alias 1`,
      priority: 1,
    },
    maxlength: {
      message: `The first name(s) must be 20 characters or fewer for alias 1`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The first name(s) must only contain alphabetical text for alias 1`,
      priority: 3,
    },
  },
  AliasSurname_0: {
    required: {
      message: `Enter last name for alias 1`,
      priority: 1,
    },
    maxlength: {
      message: `The last name must be 30 characters or fewer for alias 1`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The last name must only contain alphabetical text for alias 1`,
      priority: 3,
    },
  },
  AliasForenames_1: {
    required: {
      message: `Enter first name(s) for alias 2`,
      priority: 1,
    },
    maxlength: {
      message: `The first name(s) must be 20 characters or fewer for alias 2`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The first name(s) must only contain alphabetical text for alias 2`,
      priority: 3,
    },
  },
  AliasSurname_1: {
    required: {
      message: `Enter last name for alias 2`,
      priority: 1,
    },
    maxlength: {
      message: `The last name must be 30 characters or fewer for alias 2`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The last name must only contain alphabetical text for alias 2`,
      priority: 3,
    },
  },
  AliasForenames_2: {
    required: {
      message: `Enter first name(s) for alias 3`,
      priority: 1,
    },
    maxlength: {
      message: `The first name(s) must be 20 characters or fewer for alias 3`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The first name(s) must only contain alphabetical text for alias 3`,
      priority: 3,
    },
  },
  AliasSurname_2: {
    required: {
      message: `Enter last name for alias 3`,
      priority: 1,
    },
    maxlength: {
      message: `The last name must be 30 characters or fewer for alias 3`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The last name must only contain alphabetical text for alias 3`,
      priority: 3,
    },
  },
  AliasForenames_3: {
    required: {
      message: `Enter first name(s) for alias 4`,
      priority: 1,
    },
    maxlength: {
      message: `The first name(s) must be 20 characters or fewer for alias 4`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The first name(s) must only contain alphabetical text for alias 4`,
      priority: 3,
    },
  },
  AliasSurname_3: {
    required: {
      message: `Enter last name for alias 4`,
      priority: 1,
    },
    maxlength: {
      message: `The last name must be 30 characters or fewer for alias 4`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The last name must only contain alphabetical text for alias 4`,
      priority: 3,
    },
  },
  AliasForenames_4: {
    required: {
      message: `Enter first name(s) for alias 5`,
      priority: 1,
    },
    maxlength: {
      message: `The first name(s) must be 20 characters or fewer for alias 5`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The first name(s) must only contain alphabetical text for alias 5`,
      priority: 3,
    },
  },
  AliasSurname_4: {
    required: {
      message: `Enter last name for alias 5`,
      priority: 1,
    },
    maxlength: {
      message: `The last name must be 30 characters or fewer for alias 5`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The last name must only contain alphabetical text for alias 5`,
      priority: 3,
    },
  },
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
