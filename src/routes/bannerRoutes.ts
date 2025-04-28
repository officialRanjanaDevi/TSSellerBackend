import { Router } from "express";
import {BannerController} from '../controllers/bannerController'
import { Request, Response, NextFunction } from "express";
import uploads from "../middlewares/multerConfig"
export default class BannerRoutes {
  static banner() {
    const router = Router();

    router.route("/upload/:category").post(uploads.single("banner"),BannerController.uploadBanner)
     router.route("/getBanners").get(BannerController.getAllBanner)
     router.route("/deleteBanner/:category").delete(BannerController.deleteBanner)

    return router;
  }
}
