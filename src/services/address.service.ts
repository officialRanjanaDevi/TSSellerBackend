import { IAddress, IAddressUpdate } from "../interfaces/address.interface";
import Address from "../models/address.model";
import { addressType } from "../models/address.model";

/**
 * *Service class for managing addresses.
 */
export class AddressService {
  /**
   ** Retrieves a list of addresses from the database.
   * @param {number} limit - The maximum number of addresses to retrieve.
   * @param {number} page - The page number of addresses to retrieve.
   * @param {string} [language] - The language of the addresses to retrieve. (optional)
   * @returns {Promise<Address[]>} - A promise that resolves to an array of addresses.
   */
  async getAllAddress(limit: number, page: number, language?: string) {
    // Retrieve all addresses from the database with pagination
    const addresses = await Address.find()
      .limit(limit)
      .skip(page * limit)
      .lean()
      .exec();
    // Return the addresses
    return addresses;
  }

  async getAddress(sellerId: string, type: string, language?: string) {
    // Retrieve addresses based on the provided reference ID
    const addresses = await Address.find({
      sellerIds: sellerId,
      type: type,
    }).exec();
    // Return the addresses
    return addresses;
  }

  /**
   * *Updates an address with the given ID using the provided updated data.
   * @param {string} addressId - The ID of the address to update.
   * @param {any} updatedData - The updated data to apply to the address.
   * @param {string} language - The language to use for error messages.
   * @returns {Promise<any>} - A promise that resolves to the updated address.
   * @throws {Error} - If the address is not found or an error occurs during the update.
   */
  async updateOneAddress(
    addressId: string,
    updatedData: any,
    language: string
  ): Promise<any> {
    try {
      // Find the address by ID and update
      const result = await Address.findOneAndUpdate(
        { _id: addressId },
        updatedData,
        { new: true }
      ).exec();
      return result;
    } catch (error) {
      // Handle any errors
      console.error("Error in updateOneAddress:", error);
      throw new Error(`Error updating address: ${error.message}`);
    }
  }
}
