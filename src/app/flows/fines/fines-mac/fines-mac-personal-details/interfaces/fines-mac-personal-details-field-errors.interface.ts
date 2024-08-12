import { IAbstractFieldError, IAbstractFieldErrors } from "@interfaces/components/abstract";

export interface IFinesMacPersonalDetailsFieldErrors extends IAbstractFieldErrors {
    Title: IAbstractFieldError;
    Forenames: IAbstractFieldError;
    Surname: IAbstractFieldError;
    AliasForenames_0: IAbstractFieldError;
    AliasSurname_0: IAbstractFieldError;
    AliasForenames_1: IAbstractFieldError;
    AliasSurname_1: IAbstractFieldError;
    AliasForenames_2: IAbstractFieldError;
    AliasSurname_2: IAbstractFieldError;
    AliasForenames_3: IAbstractFieldError;
    AliasSurname_3: IAbstractFieldError;
    AliasForenames_4: IAbstractFieldError;
    AliasSurname_4: IAbstractFieldError;
    VehicleMake: IAbstractFieldError;
    VehicleRegistrationMark: IAbstractFieldError;
}