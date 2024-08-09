export interface IAbstractFieldError {
  [key: string]: {
    message: string;
    priority: number;
  };
}
