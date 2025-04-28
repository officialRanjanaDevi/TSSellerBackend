import Banner from "../models/banner.model";
import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import SellerSchema from "../models/registerSeller.model";

export class BannerController {
  // Upload banner by admin
  static async uploadBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category } = req.params;
  
      if (!req.file) {
        return next({ code: 400, message: "Please upload file", error: "Please provide an image file" });
      }
  
      const filePath = req.file.path;
  
  
      const bannerUpload = await cloudinary.uploader.upload(filePath, {
        resource_type: "image",
        folder: "banners",
      });
  
      let existingBanner = await Banner.findOne({ category });
  
      if (existingBanner) {
        existingBanner.url = bannerUpload.secure_url;
        await existingBanner.save();
      } else {
        await Banner.create({
          url: bannerUpload.secure_url,
          category,
        });
      }
  
        res.status(201).json({
        success: true,
        message: "Banner uploaded successfully",
        url: bannerUpload.secure_url
      });
  
    } catch (err: any) {
      console.error("Error:", err);
      next({ code: 500, message: err.message || "Internal Server Error", error: err });
    }
  }
  

  // Delete a particular reel uploaded by the seller
  static async deleteBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category } = req.params;

      if(!category){
        return next({ code: 400, message: "No Category found", error: "Empty Category" }); 
      }
      const banner = await Banner.findOneAndDelete({category});
      if(!banner){
        return next({ code: 400, message: "No Banner found", error: "Failed to delete" }); 
      }
      res.status(201).json({
        success: true,
        data: banner,
        message:`Banner named ${banner.category} deleted successfully`
      });
    } catch (err: any) {
      console.error("Error:", err);
      next({ code: 500, message: err.message || "Internal Server Error", error: err });
    }
  }

  // Get all banners 
  static async getAllBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
     
      const banners = await Banner.find();
      if(!banners){
        return next({ code: 500, message: "Failed to fetch banners", error: "Failed to fetch banners" });
      }
      res.status(200).json({
        success: true,
        data: banners,
      });
    } catch (err: any) {
      console.error("Error:", err);
      next({ code: 500, message: err.message || "Internal Server Error", error: err });
    }
  }
}
