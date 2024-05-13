export interface IFieldError {
  [key: string]: {
    message: string;
    priority: number;
  };
}
