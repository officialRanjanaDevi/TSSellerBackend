import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import Address from "../models/address.model";

export class CustomerController {
  static async getCustomer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const customer = await User.find({ role: "customer" });

      res.status(200).json({
        customer,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getCustomerById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const customerID = req.params.id;
      const customer = await User.findById(customerID);

      res.status(200).json({
        customer,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async postCustomer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;
      const findCustomer = await User.findOne({ email });

      if (findCustomer) {
        res.status(400).json({
          success: false,
          message: "Customer Already exist",
        });
        return;
      }

      const customer = new User(req.body);
      const savedCustomer = await customer.save();

      res.status(200).json({
        success: true,
        message: "Customer Added Successfully",
        data: savedCustomer,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async putCustomerById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const customerID = req.params.id;
      const updatedCustomer = await User.findByIdAndUpdate(
        customerID,
        req.body,
        { new: true }
      );

      if (!updatedCustomer) {
        res.status(404).json({ success: false, error: "Customer not found" });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedCustomer,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
  static async deleteCustomerById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const customerID = req.params.id;
      const deletedCustomer = await User.findByIdAndDelete(customerID);

      if (!deletedCustomer) {
        res.status(404).json({ success: false, error: "Customer not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Customer deleted successfully",
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getCountries(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const country = await Address.find().select("country");

      res.status(200).json({
        country,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
  static async getStates(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const states = await Address.find().select("state");

      res.status(200).json({
        states,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
  static async getCity(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const cities = await Address.find().select("townORcity");

      res.status(200).json({
        cities,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
  static async getAddressType(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const addressType = await Address.find().select("type");

      res.status(200).json({
        addressType,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
}
