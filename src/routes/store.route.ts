import { Router } from "express";
import { StoreController } from "../controllers/store.controller";
import uploads from "../middlewares/multerConfig";
import { VerificationController } from "../controllers/verification.controller";
import { isAuthenticated } from "../middlewares/auth";

export class StoreRoute {
  static register() {
    const router = Router();
    router.route("/api/v1/:sellerId/addStore").post(StoreController.create);
    // router.route("/api/v1/addStore").post(StoreController.create);

    // router
    //   .route("/api/v1/updateStore/:storeId")
    //   .put(StoreController.updateStore);

    // Get information about a specific store under a seller.
    router.route("/api/v1/:sellerId/store").get(StoreController.getOne);

    // router
    //   .route("/api/v1/address/:sellerId/:refId")
    //   .get(AddressController.getAddress);

    router
      .route("/api/v1/saveFormData/:sellerId")
      .post(uploads.any(), VerificationController.mainVerification);

    // router
    //   .route("/api/v1/saveFormData/:sellerId")
    //   .put(
    //     isAuthenticated,
    //     uploads.any(),
    //     VerificationController.mainVerification
    //   );
    return router;
  }
}
