import { Router } from "express";
import { order_controller } from "../controllers/ordersController";
export class orderRoute{
    static order(){
        const router=Router()

        //pending request routes
        router.get('/pending/:sellerId',order_controller.orderPending)
        router.get('/processed/:sellerid',order_controller.orderProcessed)
        router.get('/shipped/:seller_id', order_controller.orderShipped);
        router.get('/cancelled/:seller_id', order_controller.orderCancelled);
        router.put('/cancel/:subOrderId', order_controller.cancelOrder);
        router.put('/process/:subOrderId', order_controller.processOrder);
        router.put('/ship/:subOrderId',order_controller.ShippedOrder);
        router.get('/getCourierDetails/:storeId',order_controller.getCourierDetails)
        router.get('/returns',order_controller.getdeliveryInfo)
        router.get('/overview',order_controller.getOverview)
        return router
    }
}