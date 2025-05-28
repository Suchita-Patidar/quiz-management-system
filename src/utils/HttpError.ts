// utils/HttpError.ts
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
    Error.captureStackTrace(this, this.constructor);
  }
}
