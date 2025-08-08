interface ApiResponse {
  success: boolean;
  data: any;
  message: string;
  errors?: any[];
}

const apiResponses = (success: boolean, data: any, message: string, errors: any = null): ApiResponse => {
  return {
    success,
    data,
    message,
    errors
  }
}

export {
  apiResponses
}
