import { Request, Response, NextFunction } from "express";
import otpGenerator from "otp-generator";
import OTP from "../models/otp.model";
import SellerSchema from "../models/registerSeller.model";
import { mailSender } from "../utils/mailSender";

export class OtpController {
  static async sendOTP(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;
      // Check if user is already present
      const checkUserPresent = await SellerSchema.findOne({ email });
      // If user found with provided email
      if (checkUserPresent) {
        res.status(401).json({
          success: false,
          message: "Seller is already registered",
        });
        return;
      }
      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      let result = await OTP.findOne({ otp: otp });
      while (result) {
        otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
        });
        result = await OTP.findOne({ otp: otp });
      }
      const otpPayload = { email, otp };

      const message = `Please confirm your OTP\n\n Here is your OTP code:-  ${otp}`;

      await mailSender(email, "Verification Email", message);

      const otpBody = await OTP.create(otpPayload);
      res.status(200).json({
        success: true,
        message: "OTP sent successfully",
        otp,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
}
