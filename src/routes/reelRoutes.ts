import { Router } from "express";
import {ReelController} from '../controllers/reel.controller'
import { Request, Response, NextFunction } from "express";
import uploads from "../middlewares/multerConfig"
export default class ReelRoutes {
  static reel() {
    const router = Router();

    router.route("/upload/:id").post(uploads.single("reel"),ReelController.uploadReel)
    router.route("/getReels/:id").post(ReelController.getAllReel)
    router.route("/getAllReels").get(ReelController.getAllReels)
    router.route("/like/:id/:userId").post(ReelController.likeReel)
    router.route("/dislike/:id/:userId").post(ReelController.dislikeReel)
    router.route("/comment/:id/:userId").post(ReelController.addComment)
    router.route("/share/:id").post(ReelController.shareReel)
    return router;
  }
}
