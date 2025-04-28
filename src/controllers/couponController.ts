import { Request, Response, NextFunction } from "express";
import Domain from "../models/domain.model";
export class CouponController {
  static async getAllDomain(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const domains = await Domain.find({});
      res.status(200).json({
        domains,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
  static async createNewDomain(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { newDomain } = req.body;

      if (!newDomain) {
        res.status(400).json({ message: "Missing newDomain in request body" });
      }

      const { couponType, discount, domain } = newDomain;

      if (!couponType || !discount || !domain) {
        res.status(400).json({ message: "All fields are required" });
      }


      const newdomain = await Domain.create({ couponType, discount, domain })
      res.status(200).json({
        newdomain,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
  static async updateDiscount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { couponType, discount } = req.body
      const updatedDomains = await Domain.updateMany(
        { couponType },
        { $set: { discount } }
      );
      res.status(200).json({
        message: "success"
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
  static async updateDiscountById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { discount } = req.body;
      const updatedDomain = await Domain.findByIdAndUpdate(
        id,
        { $set: { discount } },
        { new: true }
      );
      res.status(200).json({
        message: "success"
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
  static async deleteDiscount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const domain = await Domain.findByIdAndDelete(id);
      if (domain) {
        res.status(200).json({
          message: "success"
        });
      } else {
        res.status(400).json({
          message: "failed to delete domain"
        });
      }

    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, couponType } = req.params;
      const domain = Domain.updateMany(
        { couponType },
        { $set: { status } }
      );
      if (domain) {
        res.status(200).json({
          message: "successfully updated"
        });
      } else {
        res.status(400).json({
          message: "failed to update domain stauts"
        });
      }

    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
}