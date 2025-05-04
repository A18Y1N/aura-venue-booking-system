// types/response.ts

export interface IApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }
  