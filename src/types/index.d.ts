
import { Request, NextFunction, Response } from "express"
export interface IController {
    (req: Request, res: Response, next: NextFunction): void;
}