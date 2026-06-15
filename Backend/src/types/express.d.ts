declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        email: string;
        created_at: Date;
      };
    }
  }
}

export {};