import { Request, Response } from "express";
import Category, { CategoryStatus } from "../models/category.model";
import { ALL } from "dns";
import SubCategory from "../models/category-sub.model";

export class CategoryController {
  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, parent, image, featured, status, attributes } = req.body;
      const newCategory = new Category({
        name,
        description,
        parent: parent || null,
        image: image || {},
        featured: featured || false,
        status: status || CategoryStatus.ACTIVE,
        attributes: attributes || [],
      });
      await newCategory.save();
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ error: "Error creating category" });
      console.log(error);
    }
  }

  static async getCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const category = await Category.findById(categoryId).lean();
      const subCategory=await SubCategory.find({category:categoryId}).lean()

      if (!category) {
        res.status(404).json({ message: "Category not found" });
        return; // Ensure we don't continue execution
      }
      res.status(200).json({category,subCategory});
    } catch (error) {
      res.status(500).json({ error: "Error fetching category" });
      console.log(error);
    }
  }

  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const parentId = req.query.parent as string;
      const query: any = {};
      if (parentId) {
        query.parent = parentId === "null" ? null : parentId;
      }
      let limit: any = parseInt(req.query.limit as string);
      limit = (limit === ALL) ? 0 : limit;
      const page = parseInt(req.query.page as string) || 1;
      const skip = (page - 1) * limit;
      const categories = await Category.find(query).skip(skip).limit(limit);
      res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async getChildCategories(req: Request, res: Response): Promise<void> {
    const { parentId } = req.params;
    try {
      const categories = await Category.find({ parent: parentId });
      res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching child categories:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { image, ...updateFields } = req.body;

      // Format the image field if it is present
      let formattedImage = {};

      if (image) {
        if (typeof image === 'string') {
          // Assume it's a base64 image
          formattedImage = { url: image };
        } else if (image.public_id && image.url) {
          // Assume it's already in the desired format
          formattedImage = image;
        }
      }

      // Update category with the formatted image
      const updatedCategory = await Category.findByIdAndUpdate(id, {
        ...updateFields,
        image: formattedImage
      }, { new: true });

      if (!updatedCategory) {
        res.status(404).json({ message: "Category not found" });
        return; // Ensure we don't continue execution
      }
      res.status(200).json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
      console.log(error);
    }
  }

  static async getCategoryById(req: Request, res: Response): Promise<void>{
    const id=req.params.id
    // console.log(id,'iiiiiiiiiiiiiii')
  }
}
