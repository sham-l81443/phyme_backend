import { Request, NextFunction, Response } from "express";

export * from './express';
export * from './googleprofile';
export * from './req-user';
export * from './video';
export interface IController {
    (req: Request, res: Response, next: NextFunction): void;
}