import { Request, Response, NextFunction } from "express";
import Product from "../models/product.model";
import { ObjectId } from "mongoose";
import SellerSchema from "../models/registerSeller.model";

export class addProductController {
  static async addProduct(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const productsData = request.body.globalformData;
      const categories=request.body.categories
      // console.log(productsData,'is product data ');
      const sellerId = request.body.sellerId;
      const storeId = request.body.storeId;
      
      // const storeId = await SellerSchema.findById({_id:sellerId}, {storeId:1});
      // console.log(storeId,'is storeid ');

      const Rent = request.query?.Rent || false;


      if (!sellerId) {
        response.status(400).json({ message: "Seller ID is required." });
        return;
      }


      interface ProductData {
        sellerId?: ObjectId;
        productName?: string;
        productImage?: string;
        shortDescription?: string;
        fullDescription?: string;
        categories?: string[];
        manufacturerDrop?: string;
        brand?: string;
        gstNumber?: string;
        sgstNumber?: string;
        countryOfOrigin?: string;
        Color: string; 
        status?: string;
        type?: string;
        material?: string;
        quantity?: number;
        startDate?: Date;
        endDate?: Date;
        Weight?: number;
        tags?: string[];
        HSNCode?: string;
        Images?: Array<{ public_id: string; url: string }>;
        related_product?: ObjectId[];
        Size?: Map<
          string,
          {
            trialshopyPrice?: string;
            defectivePrice?: string;
            mrp?: string;
            inventory?: string;
            skuId?: string;
            Price?: string;
            MRP?: string;
            Inventory?: string;
            SkuId?: string;
          }
        >;
        sku?: string;
        showonhome?: boolean;
        marknew?: boolean;
        reviewallow?: boolean;
        IsNumber?: string;
        CMLNumber?: string;
        price?: number;
        mrp?: number;
        isDiscount?: boolean;
        discount?: number;
        manufactureDate?: Date;
        expireDate?: Date;
        inStock?: boolean;
        stock?: number;
        orderMinQuantity?: number;
        orderMaxQuantity?: number;
        forRent?: boolean;
        rentPerHour?: number;
        features?: string[];
        attributes?: Map<string, { name?: string; value?: string }>;
        specifications?: Array<{ title?: string; value?: string }>;
        weight?: string;
        height?: string;
        length?: string;
        width?: string;
        dimensions?: string;
        publisher?: string;
        language?: string;
        metaTitle?: string;
        metaKeywords?: string[];
        metaDescription?: string;
        rating?: {
          count?: number;
          rating?: string;
        };
        isNewWeekly?: boolean;
        dateAdded?: Date;
        variants?: Array<{
          color?: string;
          size?: string;
          stock?: number;
          price?: number;
          discount?: number;
          sku?: string;
        }>;
      }

      

      // Save products and collect their IDs
      const savedProducts = await Promise.all(
        Object.values(productsData).map(async (productData) => {
          if (typeof productData === "object" && productData !== null) {
            try {
              const typedProductData = productData as ProductData;
              const newProduct = new Product({
                ...typedProductData,
                forRent: Rent,
                sellerId: sellerId,
                storeId:storeId,
                categories:categories
              });


              const savedProduct = await newProduct.save();
              return savedProduct._id;
              return savedProduct._id;
            } catch (error) {
              console.error("Error saving product:", error);
              throw error;
            }
          } else {
            throw new Error("Product data must be an object");
          }
        })
      );

      // Update related products
      const allProductIds = savedProducts;


      // Update related products
      // const allProductIds = savedProducts;

      await Promise.all(
        // allProductIds.map(async (id) => {
        allProductIds.map(async (id) => {
          const relatedProducts = allProductIds.filter(
            (relatedId) => relatedId.toString() !== id.toString()
          );


          await Product.findByIdAndUpdate(id, {
            $set: {
              related_product: relatedProducts,
            },
          });
        })
    // }));
      // response.status(201).json({
      //   data: savedProducts,
      //   success: true,
      //   message: "Products Created Successfully"
      // });
      )
      response.status(201).json({
        data: savedProducts,
        success: true,
        message: "Products Created Successfully"
      });
    } catch (err) {
      console.error(err);
      console.error(err);
      response.status(500).json({ message: "Server Error" });
    }
  }
}