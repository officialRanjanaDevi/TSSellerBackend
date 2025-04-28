import { NextFunction, Request, Response } from "express";

import mongoose from "mongoose";
import { StoreService } from "../services/store.service";
import Store from "../models/store.model";
// import Address from "../models/address.model";
export class StoreController {
  static async create(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const store = new Store(request.body);
      const result1 = await store.save();

      // console.log(result);
      response.status(201).json(result1);
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  // static async updateStore(
  //   request: Request,
  //   response: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {
  //     const storeId = request.params.storeId;
  //     const data = request.body;
  //     const storeDetails = {
  //       ...data.storeDetails,
  //     };
  //     // Update seller details
  //     const updatedSeller = await Store.findByIdAndUpdate(
  //       storeId,
  //       storeDetails,
  //       { new: true }
  //     );
  //     const addressDetails = {
  //       refId: storeId,
  //       type: "store",
  //       ...data.addressDetails,
  //     };
  //     // Update address details
  //     const updatedAddress = await Address.findOneAndUpdate(
  //       { refId: storeId, type: "store" },
  //       addressDetails,
  //       { new: true }
  //     );
  //     response
  //       .status(200)
  //       .json({ success: true, data: updatedSeller, address: updatedAddress });
  //   } catch (err) {
  //     const error = JSON.parse(err.message);
  //     next({ code: error.code, message: error.message, error: error.error });
  //   }
  // }

  static async getOne(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      const result = await new StoreService().getOneStore(
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
}
