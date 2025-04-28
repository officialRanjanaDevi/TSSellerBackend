import { NextFunction, Request, Response } from "express";
import Payment from "../models/payment.model";
import Commission from "../models/commission.model";
import Seller from "../models/seller.model";

export class SuperAdminController {
  static async getListMerchant(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const merchant = await Seller.find();

      res.status(200).json({
        merchant,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async postMerchant(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const merchant = new Seller(req.body);
      const savedMerchant = await merchant.save();

      res.status(200).json({
        success: true,
        data: savedMerchant,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async putMerchant(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const merchantId = req.params.id;

      const updatedMerchant = await Seller.findByIdAndUpdate(
        merchantId,
        req.body,
        { new: true }
      );

      if (!updatedMerchant) {
        res.status(404).json({ success: false, error: "Merchant not found" });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedMerchant,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async deleteMerchant(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sellerID = req.params.id;
      const deletedMerchant = await Seller.findByIdAndDelete(sellerID);

      if (!deletedMerchant) {
        res.status(404).json({ success: false, error: "Merchant not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Merchant deleted successfully",
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getMerchantById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const merchantID = req.params.id;

      const merchant = await Seller.findById(merchantID);
      res.status(200).json({
        success: true,
        data: merchant,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getMerchantFilter(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getMerchantCommission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const commissionId = req.params.id;

      const commission = await Commission.findById(commissionId);
      res.status(200).json({
        success: true,
        data: commission,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async putMerchantCommission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const commissionId = req.params.id;

      const updatedCommission = await Commission.findByIdAndUpdate(
        commissionId,
        req.body,
        {
          new: true,
        }
      );

      if (!updatedCommission) {
        res.status(404).json({ success: false, error: "Offer not found" });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedCommission,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getMerchantPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const merchantID = req.params.id;

      const paymentDetail = await Payment.findById(merchantID);

      res.status(200).json({
        paymentDetail,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async postMerchantPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payment = new Payment(req.body);
      const savedPayment = await payment.save();

      res.status(201).json({
        success: true,
        data: savedPayment,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
}
