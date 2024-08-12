export interface IAbstractFormBaseFieldError {
  [key: string]: {
    message: string;
    priority: number;
  };
}
