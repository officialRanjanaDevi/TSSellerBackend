import { Router } from "express";
import { SellerController } from "../controllers/seller.controller";
import { ProductController } from "../controllers/product.controller";
import { CustomerController } from "../controllers/customer.controller";
import { OffersController } from "../controllers/offers.controller";
import { TrackingController } from "../controllers/tracking.controller";
import { AddressController } from "../controllers/address.controller";
import { VerificationController } from "../controllers/verification.controller";
import { OrderController } from "../controllers/order.controller";
import { ValidationRoute } from './validation.route'; 
export class SellerRoute {
  static register() {
    const router = Router();

    // Route for dashboard Summary
    router
    .route("/dashboard/summary")
    .get(SellerController.getDashboardSummary);
    router
      .route("/dashboard/summary/:sellerId")
      .get(SellerController.getDashboardSummary);
    /* Order Status */
    router.route("/orders/status").get(SellerController.getOrderStatus);
    /* Recent Activity */
    router.route("/activity/recent").get(SellerController.getRecentActivity);
    /* Order Data List */
    router.route("/order/list").get(SellerController.getOrderList);
    // router.route("/order/list/:sellerId").get(SellerController.getOrderListBySellerId);
    /* Specific Order */
    router.route("/order/:id").get(SellerController.getSpecificOrder);
    router.route("/order/:orderId").delete(SellerController.deleteOrder);
    router.route("/api/v1/:userId/addOrder").post(OrderController.create);

    /* Patch Order */
    router
      .route("/orders/:id/status")
      .patch(SellerController.patchSpecificOrder);
    /* Post Order */
    router.route("/orders/:id/action").post(SellerController.postSpecificOrder);
    router.route("/api/v1/sellerAdd").post(SellerController.createSeller);
    router
      .route("/api/v1/sellerUpdate/:sellerId")
      .put(SellerController.updateSeller);

    router.route("/api/v1/sellers").get(SellerController.getAllSeller);
    router
      .route("/api/v1/sellers/:sellerId")
      .get(SellerController.getOneSeller);

    // Get a list of all addresses.
    router.route("/api/v1/address").post(AddressController.getAllAddress);
    // Get a specific address by type and reference ID.
    router
      .route("/api/v1/:sellerId/address/:type")
      .get(AddressController.getAddress);
    // Update an address by its ID.
    router.route("/api/v1/address/:_id").put(AddressController.updateAddress);
    // (Optional) Update an address by its ID using a different route.
    router
      .route("/api/v1/address/updateAddress/:_id")
      .put(AddressController.updateAddress);

    router
      .route("/api/v1/getFormData/:sellerId")
      .get(VerificationController.getsingleVerification);

    router
      .route("/api/v1/updateFormData/:verificationId")
      .put(VerificationController.updateVerification);
    
    // Product
    router.route("/products").get(ProductController.getProduct);
    /* Product Create */
    router.route("/products").post(ProductController.postProduct);
    /* Update Product */
    router.route("/products/:id").put(ProductController.putProduct);
    router.route("/products/:productId").get(ProductController.getProductById);

    /* Delete Product */
    router.route("/products/:id").delete(ProductController.deleteProduct);
    router.route("/follower/:id").get(ProductController.getFollower);

    /* Get Category*/
    router.route("/categories").get(ProductController.getCategory);
    router.route("/categories/tree").get(ProductController.getCategoryTree);

    router
      .route("/subcategories/:categoryId")
      .get(ProductController.getAllSubcategoriesByCategoryId);
    router
      .route("/subcategories/addSubCategory")
      .post(ProductController.createSubCategory);
    /* Category Create */
    router.route("/categories").post(ProductController.createCategory);
    /* Update Category */
    router.route("/categories/:id").put(ProductController.updateCategory);
    router.get(
      "/products/seller/:sellerId",
      ProductController.getProductsBySellerId
    );
    router.get(
      "/products/seller/:sellerId/rent",
      ProductController.getRentsBySellerId
    );
    /* Delete Category */
    router.route("/categories/:id").delete(ProductController.deleteCategory);
    router.route("/categories/:id").get(ProductController.getCategoryById);

    //Review
    router.route("/reviews").get(ProductController.getReview);
    router.route("/reviews/:reviewId").delete(ProductController.deleteReview);

    /* Post Review */
    router.route("/reviews/respond").post(ProductController.createReview);

    //Commission
    router
      .route("/commissions/products/:id")
      .get(ProductController.getCommissionProductById);

    router
      .route("/commissions/products")
      .get(ProductController.getAllCommissionProduct);
    /* Add Commission */
    router
      .route("/commissions/products")
      .post(ProductController.postCommissionProduct);
    /* Update Commission */
    router
      .route("/commissions/products/:id")
      .put(ProductController.putCommissionProductById);
    /* Get Specific Commission */
    router
      .route("/commissions/products/:id")
      .get(ProductController.getCommissionProductById);
    /* Delete Commission */
    router
      .route("/commissions/products/:id")
      .delete(ProductController.deleteCommissionProductById);
    /* */

    //Customer
    router.route("/customers").get(CustomerController.getCustomer);
    /* Specific Customer */
    router.route("/customers/:id").get(CustomerController.getCustomerById);
    /* Add Customer */
    router.route("/customers").post(CustomerController.postCustomer);
    /* Update Customer */
    router.route("/customers/:id").put(CustomerController.putCustomerById);
    /* Delete Customer */
    router
      .route("/customers/:id")
      .delete(CustomerController.deleteCustomerById);

    // Geographical data
    /* Location Countries */
    router.route("/locations/countries").get(CustomerController.getCountries);
    /* Location States */
    router.route("/locations/states").get(CustomerController.getStates);
    /* Location Cities */
    router.route("/locations/cities").get(CustomerController.getCity);
    /* Location Address Type */
    router
      .route("/locations/address-types")
      .get(CustomerController.getAddressType);

    // Offers
    router.route("/offers/:Id").get(OffersController.getOffers);
    /* Add Offers */
    router.route("/offers").post(OffersController.postOffers);
    /* Update Offers */
    router.route("/offers/:id").put(OffersController.putOffers);
    /* Delete Offers */
    router.route("/offers/:id").delete(OffersController.deleteOffers);
    router.route("/offers/products/:sellerId").get(OffersController.addOffer);

    router.route("/offers/getOffer/:id").get(OffersController.getOfferData)

    // Tracking
    router.route("/tracking/:id").get(TrackingController.getTrackingById);
    router.route("/trackings").get(TrackingController.getTracking);
    /* Update Tracking */
    router.route("/tracking/:id").put(TrackingController.putTrackingById);
    /* Delete Tracking */
    router.route("/tracking/:id").delete(TrackingController.deleteTrackingById);
    // router
    // .route("/dashboard/summary/:sellerId")
    // .get(SellerController.getDashboardSummary);
    // router.route("/getData/:storeId")

    return router;
  }
}
