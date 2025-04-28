import { Request, Response, NextFunction } from "express";
import SellerSchema, { SellerRegister } from "../models/registerSeller.model";
import OTP from "../models/otp.model";
import { sendToken } from "../utils/Jwttoken";
import { AuthenticatedRequest } from "../middlewares/auth";
import crypto from "crypto";
import Store, { storeDetails } from "../models/store.model";
import { mailSender } from "../utils/mailSender";
import Notification from "../models/notification.model";
import { io } from "../index";

export class SellerAuthController {
  static async signUp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // console.log(req.body, "sig");
      const { email, password, otp, storeId, phoneNumber } = req.body;
      // Check if all details are provided
      if (!email || !password || !otp || !storeId || !phoneNumber) {
        res.status(403).json({
          success: false,
          message: "All fields are required",
        });
        return;
      }
      // Check if user already exists
      const existingUser = await SellerSchema.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: "User already exists",
        });
        return;
      }
      // Find the most recent OTP for the email
      const response = await OTP.find({ email })
        .sort({ createdAt: -1 })
        .limit(1);
      // console.log(response, "d");
      if (response.length === 0 || otp !== response[0].otp) {
        res.status(400).json({
          success: false,
          message: "The OTP is not valid",
        });
        return;
      }

      const seller = await SellerSchema.create({
        email,
        password,
        storeId,
        phoneNumber,
      });
      sendToken(seller, 201, res);
    } catch (err: any) {
      // Handle the case where the error message might not be JSON
      let errorDetails = {
        code: 500,
        message: "Internal Server Error",
        error: err.message,
      };
      try {
        errorDetails = JSON.parse(err.message);
      } catch (parseError) {
        // If parsing fails, keep the default error details
      }
      next({
        code: errorDetails.code,
        message: errorDetails.message,
        error: errorDetails.error,
      });
    }
  }

  static async updatenewSeller(
    req:Request,
    res:Response,
    next:NextFunction
  ):Promise<void>{
    try{
      const data=req.body;
      res.status(200)
    }catch(e){
      console.log(e);
      res.status(500).json({message:'internal server error!'})
    }
  }

  static async updateSeller(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sellerId = request.params.sellerId;
      const seller = await SellerSchema.findById(sellerId, { storeId: 1 });
      const storeId = seller ? seller.storeId : null;
      const updateProfile = request.body;
      const qrCode = `https:api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://Trialshopy.com/nearByStore/store?storeId=${storeId}`;
      // console.log(qrCode);
      updateProfile.qrCode = qrCode;
      const updatedSeller = await SellerSchema.findByIdAndUpdate(
        sellerId,
        updateProfile,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedSeller) {
        response.status(404).json({ message: "Store not found" });
        return;
      }
    //==============================================================================>socket-io-part-integrate
      // Send notification
      const notification = new Notification({
        title: "Profile Updated",
        message: "Your profile has been updated successfully.",
        userId: sellerId,
      });
      await notification.save();
      io.to(sellerId).emit("receive_notification", notification);

      response.status(200).json(updatedSeller);
    } catch (err) {
      let errorDetails = {
        code: 500,
        message: "Internal Server Error",
        error: err.message,
      };
      try {
        errorDetails = JSON.parse(err.message);
      } catch (parseError) {}
      next({
        code: errorDetails.code,
        message: errorDetails.message,
        error: errorDetails.error,
      });
    }
  }

  static async updateProfile(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sellerId = request.params.sellerId;
      const updateProfile = request.body;

      const updatedSeller = await SellerSchema.findByIdAndUpdate(
        sellerId,
        updateProfile,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedSeller) {
        response.status(404).json({ message: "Store not found" });
        return;
      }

      response.status(200).json(updatedSeller);
    } catch (err) {
      let errorDetails = {
        code: 500,
        message: "Internal Server Error",
        error: err.message,
      };
      try {
        errorDetails = JSON.parse(err.message);
      } catch (parseError) {}
      next({
        code: errorDetails.code,
        message: errorDetails.message,
        error: errorDetails.error,
      });
    }
  }

  static async getStore(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const storeId = req.params.storeId;
      // console.log(storeId)
      const store = await Store.findById(storeId);
      // console.log(store,'is store')
      if (!store) {
        res.status(404).json({ message: "Store not found" });
        return;
      }

      res.json({ data: store });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Server error", e });
    }
  }

  static async updateStore(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const storeId = request.params.storeId;
      const updateData = request.body;
      // const qrCode=`https:api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://Trialshopy.com/nearByStore/store?storeId=${storeId}`
      // updateData.qrCode=qrCode;
      // Find the store by ID and update it with the new data
      const updatedStore = await Store.findByIdAndUpdate(storeId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedStore) {
        response.status(404).json({ message: "Store not found" });
        return;
      }

      response.status(200).json(updatedStore);
    } catch (err) {
      let errorDetails = {
        code: 500,
        message: "Internal Server Error",
        error: err.message,
      };
      try {
        errorDetails = JSON.parse(err.message);
      } catch (parseError) {
        // If parsing fails, keep the default error details
      }
      next({
        code: errorDetails.code,
        message: errorDetails.message,
        error: errorDetails.error,
      });
    }
  }

  static async createStore(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const store = new Store(request.body);
      // console.log(store, "dfdf");
      const result1 = await store.save();
      response.status(201).json(result1);
    } catch (err) {
      // Handle the case where the error message might not be JSON
      let errorDetails = {
        code: 500,
        message: "Internal Server Error",
        error: err.message,
      };
      try {
        errorDetails = JSON.parse(err.message);
      } catch (parseError) {
        // If parsing fails, keep the default error details
      }
      next({
        code: errorDetails.code,
        message: errorDetails.message,
        error: errorDetails.error,
      });
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password, role } = req.body;

      if (role === "admin") {
        const admin = await SellerSchema.findOne({ email, role: "admin" });
        if (!admin) {
          res.status(403).json({
            success: false,
            message: "Unauthorized: Only admins can login with this role",
          });
          return;
        }
      }

      if (!email || !password) {
        res.status(403).json({
          success: false,
          message: "All fields are required",
        });
        return;
      }

      const seller = await SellerSchema.findOne({ email });
      if (!seller) {
        res.status(403).json({
          message: "Invalid Email and Password",
        });
        return;
      }

      const isPasswordMatch = await seller?.comparePassword(password);
      if (!isPasswordMatch) {
        res.status(403).json({
          message: "Invalid Email and Password",
        });
        return;
      }

      sendToken(seller, 200, res);
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getOne(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const storeId = request.params.storeId;
      const result = await Store.findById({ _id: storeId });

      if (!result) {
        response.status(404).json({ message: "Store Not found" });
        return;
      }

      response.json(result);
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getSellerDetails(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sellerId = request.params.sellerId;
      const result = await SellerSchema.findById({ _id: sellerId });
      if (!result) {
        response.status(404).json({ message: "Seller Not found" });
        return;
      }

      response.json(result);
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getAllSellerForAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sellers = await SellerSchema.find({});
      res.status(200).json({
        success: true,
        sellers,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });

      res.status(200).json({
        success: true,
        message: "Logged Out.",
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async checkLogin(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    if (req.seller && req.token) {
      res.status(200).json({
        message: "User is logged in",
        token: req.token,
        seller: req.seller,
      });
    } else {
      res.status(401).json({ message: "User is not logged in" });
    }
  }

  //update Password
  static async updatePassword(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { oldPassword, newPassword, reEnterPassword } = req.body;

      if (!req.seller) {
        res.status(401).json({ message: "Unauthorized access" });
        return;
      }

      const seller = await SellerSchema.findById(req.seller.id);
      if (!seller) {
        res.status(404).json({ message: "Seller not found" });
        return;
      }

      const isPasswordMatch = await seller.comparePassword(oldPassword);
      if (!isPasswordMatch) {
        res.status(400).json({ message: "Old Password is Incorrect" });
        return;
      }

      if (newPassword !== reEnterPassword) {
        res.status(400).json({
          success: false,
          message: "Passwords do not match",
        });
        return;
      }

      seller.password = newPassword;
      await seller.save();

      sendToken(seller, 200, res);
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { storeId } = req.params;
      const sellerStatus = await Store.findById(storeId);
      res.status(200).json({ sellerStatus });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const frontend_url = req.body.protocol;
      const seller = await SellerSchema.findOne({ email: req.body.email });

      if (!seller) {
        res.status(404).json({
          success: false,
          message: "Seller not found",
        });
        return;
      }
      //Get resetPasssword Token

      const resetToken = seller.getResetPasswordToken();

      await seller.save({ validateBeforeSave: false });
      //create a url for forgotpassword
      const resetPassswordUrl = `${frontend_url}/password/reset/${resetToken}`;

      const message = `You Password reset token is :-\n\n ${resetPassswordUrl} \n\n 
    If you have not requested this email then, please ignore it `;

      try {
        //you can also use html body in message(just search it on google)
        await mailSender(seller.email, `Password Recovery`, message);

        res.status(200).json({
          sucess: true,
          message: `Email Send to ${seller.email} succesfully.`,
        });
      } catch (error) {
        seller.restPasswordToken = undefined;
        seller.resetPasswordExpired = undefined;

        await seller.save({ validateBeforeSave: false });
      }
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const restPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

      const seller = await SellerSchema.findOne({
        restPasswordToken,
        resetPasswordExpired: { $gt: Date.now() },
      });

      if (!seller) {
        res.status(404).json({
          success: false,
          message: "Reset Password Token is invalid  or has been expired",
        });
        return;
      }

      if (req.body.password !== req.body.confirmPassword) {
        res.status(404).json({
          success: false,
          message: "Password dosen't match",
        });
        return;
      }

      seller.password = req.body.password;
      seller.restPasswordToken = undefined;
      seller.resetPasswordExpired = undefined;

      await seller.save();

      sendToken(seller, 200, res);
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
  static async Payment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.status(200).json({ hello: "user" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
