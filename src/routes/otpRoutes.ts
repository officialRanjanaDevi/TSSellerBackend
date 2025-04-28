import { Router } from "express";
import { OtpController } from "../controllers/otpController";

export class OtpRoute {
  static register() {
    const router = Router();

    // Route for dashboard Summary
    router.route("/send-otp").post(OtpController.sendOTP);

    return router;
  }
}
