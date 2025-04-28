import { NextFunction, Request, Response } from "express";
import VerificationModel from "../models/verification.model";
import Store from "../models/store.model";

// Define a custom type for file uploads
interface CustomRequest extends Request {
  files?: Express.Multer.File[];
}

export class VerificationController {
  static async mainVerification(
    request: CustomRequest,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { sellerId } = request.params;
      // console.log('seller di sia',sellerId)
      const submitted = await Store.findByIdAndUpdate(
        sellerId,
        { varification: 'Submitted' },
        { new: true, runValidators: true }
      );
      
      
      const {
        aadharNumber,
        panNumber,
        GstinNumber,
        fullName,
        accountNumber,
        ifscNumber,
      } = request.body;

      // Explicitly define the type for allFiles
      const allFiles: Express.Multer.File[] = request.files || [];

      const formData = await VerificationModel.create({
        sellerId,
        aadharNumber,
        panNumber,
        GstinNumber,
        fullName,
        accountNumber,
        ifscNumber,
        aadharUpload: allFiles.find(
          (file) => file.fieldname === "aadharUpload"
        ),
        panUpload: allFiles.find((file) => file.fieldname === "panUpload"),
        GstinUpload: allFiles.find((file) => file.fieldname === "GstinUpload"),
        accountUpload: allFiles.find(
          (file) => file.fieldname === "accountUpload"
        ),
      });

      response.json({ status: "ok" });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      next({ code: 500, message: error.message, error: error });
    }
  }

  static async updateVerification(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { verificationId } = request.params;
      const data = request.body;

      const updateformData = await VerificationModel.findByIdAndUpdate(
        verificationId,
        data,
        { new: true }
      );

      if (!updateformData) {
        response
          .status(404)
          .json({ success: false, error: "verification not found" });
        return;
      }

      response.json({ success: true, data: updateformData });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      next({ code: 500, message: error.message, error: error });
    }
  }

  static async getsingleVerification(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { sellerId } = request.params;
      const result = await VerificationModel.findOne({
        sellerId: sellerId,
      }).exec();
      response.status(200).json(result);
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
}
