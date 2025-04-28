import { NextFunction, Request, Response } from "express";
import { OrderService } from "../services/order.service";

export class OrderController {
  static async create(request, response, next): Promise<void> {
    try {
      console.log("Raw Request Body:", request.body);
      const { userId } = request.params;
      const orderData = request.body;

      const result = await new OrderService().createOrder({
        userId,
        ...orderData,
      });
      response.status(201).json(result);
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
}
