import { Request, Response, NextFunction } from "express";
import Order from "../models/order.model";

export class TrackingController {
  static async getTrackingById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trackingID = req.params.id;

      const tracking = await Order.findById(trackingID);

      res.status(200).json({
        success: true,
        data: tracking,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getTracking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tracking = await Order.find({});
      res.status(200).json({
        success: true,
        data: tracking,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async putTrackingById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trackingID = req.params.id;

      const updatedTracking = await Order.findByIdAndUpdate(trackingID);

      res.status(200).json({
        success: true,
        data: updatedTracking,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async deleteTrackingById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trackingID = req.params.id;

      const deletedTracking = await Order.findByIdAndDelete(trackingID);

      res.status(200).json({
        success: true,
        data: deletedTracking,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
}
