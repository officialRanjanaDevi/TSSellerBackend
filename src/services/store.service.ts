import Store, { StoreStatus } from "../models/store.model";
import mongoose from "mongoose";
import Address from "../models/address.model";
export class StoreService {
  async createStore(data) {
    try {
      const store = new Store(data);
      const result1 = await store.save();

      return { data: result1 };
    } catch (err) {
      throw new Error(err);
    }
  }

  async getOneStore(sellerId: string, language?: string) {
    const store = await Store.findOne({
      sellerId: sellerId,
    }).exec();
    return store;
  }
}
