import { Router } from 'express';
import { CouponController } from '../controllers/couponController';


export default class CouponRoute {
    static register() {
        const router = Router();
        router.route("/domain").post(CouponController.createNewDomain)
        router.route("/domain/:id").delete(CouponController.deleteDiscount)
        router.route("/domain").get(CouponController.getAllDomain)
        router.route("/updateDiscount").post(CouponController.updateDiscount)
        router.route("/updateDiscount/:id").post(CouponController.updateDiscountById)
        router.route("/updateStatus/:status/:couponType").post(CouponController.updateStatus)
        return router;
    }
}