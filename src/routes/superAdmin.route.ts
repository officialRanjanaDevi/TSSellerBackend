import { Router } from "express";
import { SuperAdminController } from "../controllers/superAdmin.controller";

export class SuperAdminRoute {
  static register() {
    const router = Router();

    // Merchant Page
    router.route("/api/merchants").get(SuperAdminController.getListMerchant);
    /* Add Merchant */
    router.route("/api/merchants").post(SuperAdminController.postMerchant);
    /* Update Merchant */
    router.route("/api/merchants/:id").put(SuperAdminController.putMerchant);
    /* Delete Merchant */
    router
      .route("/api/merchants/:id")
      .delete(SuperAdminController.deleteMerchant);
    /* Specific Merchant */
    router
      .route("/api/merchants/:id")
      .get(SuperAdminController.getMerchantById);
    /* Filter Merchant */
    router
      .route(" /api/merchants/filter")
      .get(SuperAdminController.getMerchantFilter);
    /* Get Merchant Commission */
    router
      .route("/api/merchants/:id/commission")
      .get(SuperAdminController.getMerchantCommission);
    /* Put Merchant Commission */
    router
      .route("/api/merchants/:id/commission")
      .put(SuperAdminController.putMerchantCommission);
    /* Get Specific Merchant Payment */
    router
      .route("/api/merchants/:id/payments")
      .get(SuperAdminController.getMerchantPayment);
    /* Post Merchant Payment */
    router
      .route("/api/merchants/:id/payments")
      .post(SuperAdminController.postMerchantPayment);

    return router;
  }
}
