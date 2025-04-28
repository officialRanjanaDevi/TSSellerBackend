import Order from "../models/order.model";

export class OrderService {
  async createOrder(data: any) {
    const order = new Order(data);
    return order.save();
  }
}

export const orderService = new OrderService();
