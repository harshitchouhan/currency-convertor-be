import express from "express";
import { ApiError } from "../core/ApiError";

export abstract class BaseController {
  /**
   * wrapper function to handle catch condition on all async functions
   * @param fn any
   * @returns fn
   */
  protected catchAsyn = (fn: any) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      fn(req, res, next).catch((err: any) => {
        return ApiError.handle(err, res);
      });
    };
  };
}
