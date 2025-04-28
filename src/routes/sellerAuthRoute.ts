import { Router } from "express";

import { SellerAuthController } from "../controllers/sellerAuth.controller";
import { isAuthenticated } from "../middlewares/auth";

export class SellerAuthRoute {
  static register() {
    const router = Router();
    //aashish 
    router.route('/payment/last_payment').get(SellerAuthController.Payment)
    // Route for dashboard Summary
    router.route("/signup").post(SellerAuthController.signUp);
    router.route("/login").post(SellerAuthController.login);
    router.route("/logout").get(SellerAuthController.logout);
    router.route("/all-sellers").get(SellerAuthController.getAllSellerForAdmin);
    router
      .route("/checklogin")
      .get(isAuthenticated, SellerAuthController.checkLogin);
    ///Update Password

    router
      .route("/password/update")
      .put(isAuthenticated, SellerAuthController.updatePassword);

    router.route("/password/forgot").post(SellerAuthController.forgotPassword);

    router
      .route("/password/reset/:token")
      .post(SellerAuthController.resetPassword);

    router.route("/addStore").post(SellerAuthController.createStore);
    router.route("/getStore/:storeId").get(SellerAuthController.getOne);
    router
      .route("/getSeller/:sellerId")
      .get(SellerAuthController.getSellerDetails);
    router.route("/get-status/:storeId").get(SellerAuthController.getStatus);
    router
      .route("/updateSeller/:sellerId")
      .put(SellerAuthController.updateSeller);
      router
      .route("/updateSeller")
      .put(SellerAuthController.updatenewSeller);
    router.route("/updateStore/:storeId").put(SellerAuthController.updateStore);
    router.route("/getStoreDetails/:storeId").get(SellerAuthController.getStore)
    router
      .route("/updateProfile/:sellerId")
      .put(SellerAuthController.updateProfile);

    return router;
  }
}
