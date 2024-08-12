export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const customError = (message: string, status: number) => {
  return new CustomError(message, status);
};
