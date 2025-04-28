import { Request, Response, NextFunction } from "express";
import Offer from "../models/offer.model";
import { off } from "process";
import Product from "../models/product.model";
export class OffersController {
  static async getOffers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const Id=req.params.Id
      const offer = await Offer.find({sellerId:Id}).populate({
        path: "applicableProducts",
        select: "productName rating",
      });

      res.status(200).json({
        offer,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
  //get the product for additon of offer ----------------------------------------------->
  static async addOffer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sellerId = req.params.sellerId;
      if (!sellerId) {
        res.status(400).json({ message: 'Seller ID is required' });
        return;
      }
      const products = await Product.find({ sellerId:sellerId });
      if (!products.length) {
        res.status(404).json({ message: 'No products found for the given seller ID' });
        return;
      }
      res.status(200).json({products:products});
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
  //-------------------------------->get offer data function 
  static async getOfferData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ message: 'Seller ID is required' });
        return;
      }
      const offer = await Offer.findById(id).populate('applicableProducts');
      if (!offer) {
        res.status(404).json({ message: 'No offers found for the given seller ID' });
        return;
      }
      // const productIds = offer.applicableProducts;
      // const productNames=productIds.map(()=>{await Product.find()},[]);
      console.log(offer, 'is offer')
      res.status(200).json({offer:offer});
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async postOffers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const offer = new Offer(req.body);
      const savedOffer = await offer.save();

      res.status(200).json({
        success: true,
        data: savedOffer,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async putOffers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const offerID = req.params.id;
      const updatedOffer = await Offer.findByIdAndUpdate(offerID, req.body, {
        new: true,
      });

      if (!updatedOffer) {
        res.status(404).json({ success: false, error: "Offer not found" });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedOffer,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async deleteOffers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const offerID = req.params.id;
      const deletedOffer = await Offer.findByIdAndDelete(offerID);

      if (!deletedOffer) {
        res.status(404).json({ success: false, error: "Customer not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Offer deleted successfully",
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
}
