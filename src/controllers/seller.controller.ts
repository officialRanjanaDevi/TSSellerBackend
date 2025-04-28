import { NextFunction, Request, Response } from "express";
import Order from "../models/order.model";
import Seller from "../models/seller.model";
import User from "../models/user.model";
import { SellerService } from "../services/seller.service";
import Address from "../models/address.model";
import SellerSchema from "../models/registerSeller.model";
import { Mongoose } from "mongoose";
import SubOrder from "../models/sub_order.model";
export class SellerController {
  static async getDashboardSummary(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const Id = req.params.sellerId; // Get the seller's ID from the request parameters

      const sellerData = await SellerSchema.findOne(
        { _id: Id },
        { storeId: 1 }
      );
      const storeId = sellerData?.storeId; // Safely access storeId

      // const { totalVisitors, uniqueVisitors } = await SellerSchema.findOne(
      //   { _id: Id },
      //   { totalVisitors: 1, uniqueVisitors: 1 }
      // );

      const totalOrders = await SubOrder.countDocuments({ storeId: storeId });

      const totalMerchants = await Seller.countDocuments({ role: "seller" });
      const totalCustomers = await User.countDocuments({ role: "customer" });

      const totalRevenueResult = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
      ]);
      const totalRevenue =
        totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

      res.status(200).json({
        totalOrders,
        totalRevenue,
        totalMerchants,
        totalCustomers,
        // totalVisitors,
        // uniqueVisitors
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getOrderStatus(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orderStatuses = await Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      // For the doughnut chart
      const formattedData = orderStatuses.map((status: any) => ({
        status: status._id,
        count: status.count,
      }));

      response.status(200).json({
        success: true,
        data: formattedData,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async deleteOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orderId = req.params.orderId;
      const order = await Order.findById(orderId).select("products -_id");
      const subOrderIds = order.products.map((product) => product._id);
      console.log(subOrderIds,'is the idssss')
      const deletedOrder = await Order.findByIdAndDelete(orderId);
      const deleteResult = await SubOrder.deleteMany({ _id: { $in: subOrderIds } });
      

      if (!deletedOrder) {
        res.status(404).json({ success: false, error: "Order not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Order deleted successfully",
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  // @validateRequestBody(sellerAdd)
  static async createSeller(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dataSeller = request.body;

      const userExist = await Seller.findOne({
        email: dataSeller.sellerDetails.email,
      });

      if (userExist) {
        response
          .status(404)
          .json({ success: false, error: "Email already exists" });
        return;
      }

      const result: any = await new SellerService().createSeller({
        ...request.body,
      });
      if (!result) {
        response
          .status(404)
          .json({ success: false, error: "seller not found" });
        return;
      }
      response.status(201).json(result);
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async updateSeller(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sellerId = request.params.sellerId;
      const data = request.body;

      const sellerDetails = {
        ...data.sellerDetails,
      };

      // Update seller details
      const updatedSeller = await Seller.findByIdAndUpdate(
        sellerId,
        sellerDetails,
        { new: true }
      );

      const addressDetails = {
        refId: sellerId,
        type: "seller",
        ...data.addressDetails,
      };

      // Update address details
      const updatedAddress = await Address.findOneAndUpdate(
        { refId: sellerId, type: "seller" },
        addressDetails,
        { new: true }
      );
      response
        .status(200)
        .json({ success: true, data: updatedSeller, address: updatedAddress });
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getAllSeller(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { limit = "0", page = "1" } = request.query;
      const l = parseInt(limit.toString());
      const p = parseInt(page.toString());
      const result = await new SellerService().getAllSeller(l, p);
      const sellers: any = await new SellerService().getAllSeller(0, 0);
      response.status(200).json({
        totalCount: sellers.length,
        page: Number(page) ?? 0,
        limit: Number(limit) ?? 0,
        data: result,
        totalUsers: sellers,
      });
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getOneSeller(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      const result = await new SellerService().getOneSeller(
        request.params.sellerId,
        language
      );
      response.json(result);
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getRecentActivity(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const recentActivity = await Order.find({
        status: { $in: ["pending", "processing", "shipped", "delivered"] },
      })
        .sort({ orderDate: -1 })
        .select("userId products status orderDate")
        .limit(10); // Limit to 10 recent activities, you can adjust this as needed

      res.status(200).json({
        success: true,
        data: recentActivity,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getOrderList(req: Request, res: Response, next: NextFunction) {
    try {
      // const seller_id=req.params.sellerId
      // const orders = await Order?.find({sellerId:seller_id})
      const orders = await Order.find().populate({
        path: "userId",
        select: "name email",
      });
      // console.log("orders is : ", orders);
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  // static async getOrderListBySellerId(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const seller_id = req.params.sellerId;
  //     const storeId=await SellerSchema.findOne({_id:seller_id},{storeId:1});
  //     if (!storeId) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Store ID not found for the given seller ID",
  //       });
  //     }
  //     const ordersGroupedByStatus = await Order.aggregate([
  //       {
  //         $match: { storeId: storeId }
  //       },
  //       {
  //         $group: {
  //           _id: "$status",
  //           orders: { $push: "$$ROOT" },
  //           totalOrders: { $sum: 1 }
  //         }
  //       }
  //     ]);

  //     const populatedOrders = await Order.populate(ordersGroupedByStatus, {
  //       path: "orders.userId",
  //       select: "name email"
  //     });

  //     res.status(200).json({
  //       success: true,
  //       orders: populatedOrders,
  //     });
  //   } catch (err: any) {
  //     console.error("Error:", err);

  //     let error;
  //     try {
  //       error = JSON.parse(err.message);
  //     } catch (parseError) {
  //       error = { code: 500, message: "Internal Server Error", error: parseError.message };
  //     }

  //     next({ code: error.code, message: error.message, error: error.error });
  //   }
  // }

  static async getSpecificOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const orderId = req.params.id;
      const order = await Order.findById(orderId);

      if (!order) {
        res.status(404).json({ success: false, error: "Order not found" });
        return;
      }

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async patchSpecificOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const orderId = req.params.id;
      const { status } = req.body;

      const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      if (!order) {
        res.status(404).json({ success: false, error: "Order not found" });
        return;
      }

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async postSpecificOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const orderId = req.params.id;
      const { action } = req.body;

      // Cancel or return order

      res.status(200).json({
        success: true,
        message: `Order ${action} successfully`,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
}
