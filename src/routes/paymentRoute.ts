import { Router } from "express";
import { paymentController } from "../controllers/paymentController";
export class paymentRoute{
    static paymentsRoute(){
        const router=Router();
        router.get('/getPaymentDetails?:id',paymentController.getPayment);
    }
}