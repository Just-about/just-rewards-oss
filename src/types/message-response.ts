type MessageResponse<T> =
  | { data: T }
  | {
      error: {
        message?: string;
        status: number;
      };
    };
