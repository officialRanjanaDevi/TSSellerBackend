import { Request, Response, NextFunction } from "express";
import Product from "../models/product.model";
import Category from "../models/category.model";
import Review from "../models/review.model";
import Store from "../models/store.model";
// import ProductCommission from "../models/commission.model";
import SubCategory from "../models/category-sub.model";
import cloudinary from "../config/cloudinary";
import ProductCommission from "../models/commission.model";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;
export class ProductController {
  static async getCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id;
      const result = await Category.findById(id);
      // console.log('result is " ',result)

      res.status(200).json({ message: "success", result: result });
    } catch (e) {
      res.status(500).json(e.message);
      console.log(e);
    }
  }
  static async getProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const products = await Product.find();
      // console.log(products)
      res.status(200).json({
        success: true,
        products,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const productId = req.params.productId;
      const products = await Product.findById(productId);
      res.status(200).json({
        success: true,
        products,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getProductsBySellerId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sellerId = req.params.sellerId;
      const { page: pageParam, limit: limitParam } = req.query;
      const page = Number(pageParam);
      const limit = Number(limitParam);
      const totalProducts = await Product.countDocuments({
        sellerId: new mongoose.Types.ObjectId(sellerId),
        forRent: false
    });
    
      if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
        res
          .status(400)
          .json({ message: "Page and limit must be positive integers." });
        return;
      }
      const products = await Product.find({
        sellerId: new ObjectId(sellerId),
        forRent: false,
      })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
      // console.log(totalProducts,'is skflak')
      // console.log(products)
      if (!products.length) {
        res.status(404).json({ message: "No products found for this seller" });
        return;
      }

      res.status(200).json({
        success: true,
        products,
        total:totalProducts
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getRentsBySellerId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sellerId = req.params.sellerId;
      // console.log(sellerId)
      const products = await Product.find({
        sellerId: new ObjectId(sellerId),
        forRent: true,
      }).lean();
      // console.log(products)
      if (!products.length) {
        res.status(404).json({ message: "No products found for this seller" });
        return;
      }

      res.status(200).json({
        success: true,
        products,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getFollower(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const storeId = req.params.id;
      const store = await Store.findOne({ _id: storeId })
        .populate("categories")
        .populate({ path: "followers.followers", model: "user" })
        .populate("sellerId")
        .exec();
      console.log(store.followers);
      res.status(200).json({
        store,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
  static async postProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      let { productId, variants } = req.body;

      if (!productId) {
        productId = uuidv4();
      }

      const productData = { ...req.body, productId, variants };

      const product = new Product(productData);

      const savedProduct = await product.save();

      res.status(201).json({
        success: true,
        data: savedProduct,
      });
    } catch (err: any) {
      console.error("Error:", err.message);
      next({ code: err.code, message: err.message, error: err });
    }
  }

  static async putProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const productId = req.params.id;
      
      let product = await Product.findById(productId);

      if (!product) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        req.body,
        { new: true }
      );

      if (!updatedProduct) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedProduct,
      });
    } catch (err: any) {
      console.error("Error:", err.message);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // console.log('product id is : ',req.params.id)
      const product = await Product.findById(req.params.id);

      if (!product) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }
      // Deleting Images From Cloudinary
      // for (let i = 0; i < product.images.length; i++) {
      //   await cloudinary.uploader.destroy(product.images[i].public_id);
      // }
      await cloudinary.uploader.destroy(product.productImage);
      await product.deleteOne();

      res.status(200).json({
        success: true,
        message: "Product Deleted Succefully",
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getCategoryTree(req: Request, res: Response): Promise<void> {
    try {
      const getCategoryTreeRecursive = async (
        parentId: string | null
      ): Promise<any> => {
        const categories = await Category.find({ parent: parentId }).lean();

        return Promise.all(
          categories.map(async (category) => ({
            _id: category._id,
            name: category.name,
            image: category.image,
            children: await getCategoryTreeRecursive(category._id),
          }))
        );
      };

      const tree = await getCategoryTreeRecursive(null);
      res.status(200).json(tree);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Fetch all categories
      const categories = await Category.find();
      const subcategories = await SubCategory.find();

      const buildSubCategories = (categoryId, categories) => {
        return categories
          .filter(
            (subCategory) =>
              subCategory.parent?.toString() === categoryId.toString()
          )
          .map((subCategory) => ({
            _id: subCategory._id,
            name: subCategory.name,
            description: subCategory.description,
            image: subCategory.image,
            status: subCategory.status,
            attributes: subCategory.attributes,

            subCategories: buildSubCategories(subCategory._id, categories),
          }));
      };

      const formattedCategories = categories.map((category) => ({
        name: category.name,
        _id: category._id,
        description: category.description,
        image: category.image,
        status: category.status,
        attributes: category.attributes,

        subCategories: buildSubCategories(category._id, categories),
      }));

      // const formattedCategories = categories.map((category) => {
      //   return {
      //     name: category.name,
      //     _id:category._id,
      //     subCategories: categories
      //       .filter(subCategory => subCategory.parent?.toString() === category._id.toString())
      //       .map(subCategory => ({
      //         _id:subCategory._id ,
      //         name: subCategory.name,
      //         description: subCategory.description,
      //         image: subCategory.image,
      //         status: subCategory.status,
      //         attributes: subCategory.attributes,
      //         // subsubcategories:categories.filter(subCategory=>SubCategory.parent?.toString===subcategories)
      //         // options: subCategory.options,
      //       })),
      //     // subCategories: subcategories
      //     //   .filter((subCategory) => subCategory.category.toString() === category._id.toString())
      //     //   .map((subCategory) => ({
      //     //     name: subCategory.name,
      //     //     description: subCategory.description,
      //     //   })),
      //     // _id: category._id,
      //     // description: category.description,
      //     // image: category.image,
      //     // status: category.status,
      //     // attributes: category.attributes,
      //     // // options: category.options,
      //   };
      // });
      // console.log(formattedCategories, " is categories!");

      res.status(200).json({
        success: true,
        data: formattedCategories,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  // static async getCategory(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {
  //     const categories = await Category.find();

  //     res.status(200).json({
  //       success: true,
  //       data: categories,
  //     });
  //   } catch (err: any) {
  //     console.error("Error:", err);
  //     const error = JSON.parse(err.message);
  //     next({ code: error.code, message: error.message, error: error.error });
  //   }
  // }

  static async getAllSubcategoriesByCategoryId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { categoryId } = req.params;

    try {
      const subcategories = await SubCategory.find({ category: categoryId });
      res.status(200).json({ data: subcategories });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async createSubCategory(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //Add a new sub category using the CategoryService
      // const {name,description,category}=request.body
      const subcategory = new SubCategory(request.body);
      const subcategories = await subcategory.save();
      // Responde with the created category and status code of 201 (created)
      response.status(201).json({ subcategories });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async createCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      const {
        name,
        description,
        detailedDescription,
        subDescriptions,
        parent,
        featured,
      } = req.body;

      const savedProduct = await Category.create({
        name,
        description,
        detailedDescription,
        subDescriptions,
        parent,
        featured,
        avatar: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      });

      res.status(201).json({
        success: true,
        data: savedProduct,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async updateCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const productId = req.params.id;

      const updatedProduct = await Category.findByIdAndUpdate(
        productId,
        req.body,
        { new: true }
      );

      if (!updatedProduct) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedProduct,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async deleteCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const productId = req.params.id;
      // console.log("lllllllllllllllllll", productId);

      const deletedProduct = await Category.findByIdAndDelete(productId);

      if (!deletedProduct) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getReview(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const reviews = await Review.find({}).populate({
        path: "productId userId",
        select: "productName review name email",
      });

      res.status(200).json({
        reviews,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async createReview(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const review = new Review(req.body);
      const savedResponse = await review.save();

      res.status(200).json({
        savedResponse,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async deleteReview(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const reviewId = req.params.reviewId;

      const reviewProdcut = await Review.findByIdAndDelete(reviewId);

      if (!reviewProdcut) {
        res
          .status(404)
          .json({ success: false, error: "ReviewProdcut not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Review Product Deleted",
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getCommissionProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const products = await Product.find(req.query);

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async postCommissionProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const commission = new ProductCommission(req.body);
      const savedCommission = await commission.save();

      res.status(200).json({
        success: true,
        data: savedCommission,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async putCommissionProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const commissionID = req.params.id;

      const updatedCommission = await ProductCommission.findByIdAndUpdate(
        commissionID,
        req.body,
        { new: true }
      );
      if (!updatedCommission) {
        res
          .status(404)
          .json({ success: false, error: "Product Commission not found" });
        return;
      }
      res.status(200).json({
        success: true,
        updatedCommission,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getCommissionProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const commissionID = req.params.id;

      const commission = await ProductCommission.findById(commissionID);
      res.status(200).json({ commission });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getAllCommissionProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const commission = await ProductCommission.find({}).populate({
        path: "productId",
        select: "productName",
      });

      res.status(200).json({ success: true, commission });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async deleteCommissionProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const commissionID = req.params.id;

      const deletedCommission = await ProductCommission.findByIdAndDelete(
        commissionID
      );

      if (!deletedCommission) {
        res.status(404).json({ success: false, error: "Customer not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Commission deleted successfully",
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async postCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async putCategoriesById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async deleteCategoriesById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getCommissionHistoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async patchCommissionStatusById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const commissionID = req.params.id;

      const updatedCommission = await ProductCommission.findByIdAndUpdate(
        commissionID,
        req.body,
        { new: true }
      );

      res.status(200).json({
        success: true,
        data: updatedCommission,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
}
