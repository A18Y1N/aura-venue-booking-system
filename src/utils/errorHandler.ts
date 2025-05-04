export function getErrorMessage(error: unknown): string {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      typeof error.response.data === "object" &&
      error.response.data !== null &&
      "message" in error.response.data
    ) {
      return (error.response.data as { message?: string }).message || "Something went wrong";
    }
  
    if (error instanceof Error) return error.message;
  
    return "Something went wrong";
  }
  