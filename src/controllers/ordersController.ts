import { Request, Response, NextFunction } from "express";
import Order from "../models/order.model";
import SubOrder from "../models/sub_order.model";
import Product from "../models/product.model";
import CourierPartner from "../models/courier_partner_model";
import { PrometheusContentType } from "prom-client";
export class order_controller {
  static async orderPending(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const seller_id = req.params.sellerId;
      // console.log(seller_id,'is-----------------')
      console.log(seller_id, "seller id <-");

      const pendingSubOrders = await SubOrder.find(
        { storeId: seller_id, status: "pending" },
        { productId: 1, orderId: 1, quantity: 1, size: 1 }
      ).lean();

      if (pendingSubOrders.length === 0) {
        res.status(200).json({ message: "No pending orders found" });
        return;
      }

      const productIds = pendingSubOrders.map((subOrder) => subOrder.productId);
      const orderIds = pendingSubOrders.map((subOrder) => subOrder.orderId);
      const subOrderIds = pendingSubOrders.map((subOrder) => subOrder._id);

      const productDetails = await Product.find(
        { _id: { $in: productIds } },
        {
          _id: 1,
          productName: 1,
          productImage: 1,
          shortDescription: 1,
          price: 1,
          images: 1,
        }
      ).lean();

      const response = pendingSubOrders.map((subOrder) => {
        const productInfo = productDetails.find(
          (product) => product._id.toString() === subOrder.productId.toString()
        );
        return {
          subOrderId: subOrder._id,
          orderId: subOrder.orderId,
          productId: subOrder.productId,
          productDetails: productInfo,
          quantity: subOrder.quantity,
          size: subOrder.size,
        };
      });

      res.status(200).json({ orders: response, message: "order list found!" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  //order processed

  static async orderProcessed(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const seller_id = req.params.sellerid;
      // console.log('seller id : ',seller_id)
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const processedSubOrders = await SubOrder.find(
        { storeId: seller_id, status: "processed" },
        { productId: 1, orderId: 1, quantity: 1, size: 1 }
      )
        .lean()
        .skip(skip)
        .limit(limit);

      const totalCount = await SubOrder.countDocuments({
        storeId: seller_id,
        status: "processed",
      });

      if (processedSubOrders.length === 0) {
        res.status(200).json({ message: "No processed orders found" });
        return;
      }

      const productIds = processedSubOrders.map(
        (subOrder) => subOrder.productId
      );

      const productDetails = await Product.find(
        { _id: { $in: productIds } },
        {
          _id: 1,
          productName: 1,
          shortDescription: 1,
          price: 1,
          images: 1,
          productImage:1
        }
      ).lean();

      const response = processedSubOrders.map((subOrder) => {
        const productInfo = productDetails.find(
          (product) => product._id.toString() === subOrder.productId.toString()
        );
        return {
          subOrderId: subOrder._id,
          orderId: subOrder.orderId,
          productId: subOrder.productId,
          productDetails: productInfo,
          quantity: subOrder.quantity,
          size: subOrder.size,
        };
      });

      res.status(200).json({
        orders: response,
        totalCount,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  //order shipped code
  static async orderShipped(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const seller_id = req.params.seller_id;
      console.log(seller_id);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const shippedSubOrders = await SubOrder.find(
        { storeId: seller_id, status: "shipped" },
        { productId: 1, orderId: 1, quantity: 1, size: 1 }
      )
        .skip(skip)
        .limit(limit)
        .lean();

      const totalCount = await SubOrder.countDocuments({
        storeId: seller_id,
        status: "shipped",
      });

      if (shippedSubOrders.length === 0) {
        res.status(200).json({ message: "No shipped orders found" });
        return;
      }

      const productIds = shippedSubOrders.map((subOrder) => subOrder.productId);

      const productDetails = await Product.find(
        { _id: { $in: productIds } },
        { _id: 1, productName: 1, productImage: 1, images: 1 }
      ).lean();

      const response = shippedSubOrders.map((subOrder) => {
        const productInfo = productDetails.find(
          (product) => product._id.toString() === subOrder.productId.toString()
        );
        return {
          subOrderId: subOrder._id,
          orderId: subOrder.orderId,
          productId: subOrder.productId,
          productDetails: productInfo,
          quantity: subOrder.quantity,
          size: subOrder.size,
        };
      });

      res.status(200).json({ results: response, totalCount });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  //cancelled order
  static async orderCancelled(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const seller_id = req.params.seller_id;
      // console.log(seller_id,'->')
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const cancelledSubOrders = await SubOrder.find(
        { storeId: seller_id, status: "cancelled" },
        { productId: 1, orderId: 1, quantity: 1, size: 1 }
      )
        .skip(skip)
        .limit(limit)
        .lean();

      const totalCount = await SubOrder.countDocuments({
        storeId: seller_id,
        status: "cancelled",
      });

      if (cancelledSubOrders.length === 0) {
        res.status(200).json({ message: "No cancelled orders found" });
        return;
      }

      const productIds = cancelledSubOrders.map(
        (subOrder) => subOrder.productId
      );

      const productDetails = await Product.find(
        { _id: { $in: productIds } },
        { _id: 1, productName: 1, productImage: 1, images: 1 }
      ).lean();

      const response = cancelledSubOrders.map((subOrder) => {
        const productInfo = productDetails.find(
          (product) => product._id.toString() === subOrder.productId.toString()
        );
        return {
          subOrderId: subOrder._id,
          orderId: subOrder.orderId,
          productId: subOrder.productId,
          productDetails: productInfo,
          quantity: subOrder.quantity,
          size: subOrder.size,
          productImage:productInfo?.productImage
        };
      });
      console.log(response)

      res.status(200).json({ results: response, totalCount });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  //cancellation of order

  static async cancelOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const subOrderId = req.params.subOrderId;

      const updatedOrder = await SubOrder.findByIdAndUpdate(
        subOrderId,
        {
          status: "cancelled",
          $push: {
            statusUpdates: {
              status: "cancelled",
            },
          },
        },
        { new: true }
      );

      if (!updatedOrder) {
        res.status(404).json({ message: "Sub-order not found" });
        return;
      }

      res
        .status(200)
        .json({
          message: "Order status updated to cancelled",
          order: updatedOrder,
        });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  //acceptance of order

  static async processOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const subOrderId = req.params.subOrderId;

      const updatedOrder = await SubOrder.findByIdAndUpdate(
        subOrderId,
        {
          status: "processed",
          $push: {
            statusUpdates: {
              status: "processed",
            },
          },
        },
        { new: true }
      );

      if (!updatedOrder) {
        res.status(404).json({ message: "Sub-order not found" });
        return;
      }

      res
        .status(200)
        .json({
          message: "Order status updated to processed",
          order: updatedOrder,
        });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async ShippedOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const subOrderId = req.params.subOrderId;

      const updatedOrder = await SubOrder.findByIdAndUpdate(
        subOrderId,
        {
          status: "shipped",
          $push: {
            statusUpdates: {
              status: "shipped",
            },
          },
        },
        { new: true }
      );

      if (!updatedOrder) {
        res.status(404).json({ message: "Sub-order not found" });
        return;
      }

      res
        .status(200)
        .json({
          message: "Order status updated to shipped",
          order: updatedOrder,
        });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getCourierDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const storeId = req.params.storeId;
      const data = await CourierPartner.find();
      if (data.length === 0) {
        res.status(200).json({
          success: true,
          message: "No data found",
          results: [],
        });
        return;
      }
      res.status(200).json({
        success: true,
        results: data,
      });
    } catch (e) {
      console.log("Error fetching courier details:", e);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching courier details",
      });
    }
  }

  static async getdeliveryInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { deliveryStatus } = req.query;
      // console.log(deliveryStatus)
      if (!deliveryStatus) {
        res.status(400).json({
          success: false,
          message: "Delivery status is required.",
        });
        return;
      }

      const delivery_statusdata = await SubOrder.find({
        delivery_status: deliveryStatus,
      });
      const statusData= await SubOrder.find({
        status:deliveryStatus,
      })

      const data=[...delivery_statusdata,...statusData]

      if (!data.length) {
        res.status(200).json({
          success: true,
          message: "No data found for the selected delivery status.",
          results: [],
        });
        return;
      }

      res.status(200).json({
        success: true,
        results: data,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching delivery info.",
      });
    }
  }

  static async getOverview(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const overviewData = await SubOrder.aggregate([
        {
          $group: {
            _id: "$delivery_status",
            productCount: { $sum: 1 },
            delivery_partner: { $first: "$delivery_partner" },
            delivery_price: { $sum: "$delivery_price" },
            finalPrice: { $sum: "$finalPrice" },
            total_after_delivery: { $sum: "$total_after_delivery" },
          },
        },
        {
          $project: {
            _id: 0,
            delivery_status: "$_id",
            productCount: 1,
            delivery_partner: 1,
            delivery_price: 1,
            finalPrice: 1,
            total_after_delivery: 1,
            total_price: { $add: ["$finalPrice", "$delivery_price"] },
          },
        },
      ]);
      
      
      console.log(overviewData,'is <-')
      res.status(200).json(overviewData);
    } catch (error) {
      console.error("Error fetching overview data:", error);
      res.status(500).json({ error: "Failed to fetch overview data." });
    }
  }
}
