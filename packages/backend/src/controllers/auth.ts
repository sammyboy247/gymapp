import { Request, Response } from 'express';

export const login = async (req: Request, res: Response) => {
  res.json({ message: 'Login successful' });
};

export const register = async (req: Request, res: Response) => {
  res.json({ message: 'Registration successful' });
};
