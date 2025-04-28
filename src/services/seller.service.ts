import Seller, { sellerStatus } from "../models/seller.model";
import Address from "../models/address.model";

export class SellerService {
  async createSeller(data: any) {
    try {
      const sellerDetails = {
        ...data.sellerDetails,
      };

      const userExist = await Seller.findOne({ email: sellerDetails.email });
      if (userExist) {
        return;
      }

      const seller = new Seller(sellerDetails);

      const result1 = await seller.save();

      const sellerId = result1._id;
      const addressDetails = {
        refId: sellerId,
        type: "seller",
        ...data.addressDetails,
      };
      const address = new Address(addressDetails);
      const result2 = await address.save();

      return { data: result1, address: result2 };
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateSeller(sellerId: string, data: any) {
    try {
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

      return { data: updatedSeller, address: updatedAddress };
    } catch (err) {
      throw new Error(err);
    }
  }

  async getAllSeller(limit: number, page: number, language?: string) {
    const sellers = await Seller.find()
      .limit(limit)
      .skip(page * limit)
      .lean()
      .exec();
    return sellers;
  }

  async getOneSeller(sellerId: string, language?: string) {
    const seller = await Seller.findOne({ sellerIds: sellerId }).exec();
    return seller;
  }

  async checkLogin(sellerId: string) {
    const seller = await Seller.findOne({ _id: sellerId }).exec();
    return { Login: "Successful", success: true, SellerData: seller };
  }
}
