import Reel from "../models/reel.model";
import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import SellerSchema from "../models/registerSeller.model";
import Seller from "../models/seller.model";
import mongoose from "mongoose";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class ReelController {
  // Upload reel by seller
  static async uploadReel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const seller = await SellerSchema.findById(id);
      if (!seller) {
        return next({ code: 404, message: "Seller not found", error: "Invalid seller ID" });
      }
      if (!req.file) {
        return next({ code: 400, message: "No file uploaded", error: "Please provide a video file" });
      }
      const videoPath = req.file.path;
      const  {caption,storeId } = req.body;
      console.log("hii")
      const reelUpload = await cloudinary.uploader.upload(videoPath, {
        resource_type: "video",
        folder: "reels",
      });
      console.log("Cloudinary upload successful:", reelUpload);
      const uploadedReel = await Reel.create({
        sellerId: id,
        video: reelUpload.secure_url,
        caption,
        storeId
      });
      res.status(201).json({
        success: true,
        data: uploadedReel,
      });

    } catch (err: any) {
      console.error("Error:", err);
      next({ code: 500, message: err.message || "Internal Server Error", error: err });
    }
  }

  // Delete a particular reel uploaded by the seller
  static async deleteReel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if(!id){
        res
        .status(400)
        .json({ message: "Reel Id is missing" });
      return;
      }
      const reels = await Reel.findByIdAndDelete(id);
      res.status(201).json({
        success: true,
        data: reels,
      });
    } catch (err: any) {
      console.error("Error:", err);
      next({ code: 500, message: err.message || "Internal Server Error", error: err });
    }
  }

  // Get all reels uploaded by the seller
  static async getAllReel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if(!id){
      }
      const reels = await Reel.find({sellerId:id}).populate("likes dislikes comments");
      const reels2=await Reel.aggregate([
        { $match: { sellerId: id } },
        {
          $lookup: {
            from: "stores",
            localField: "storeId",
            foreignField: "_id",
            as: "store"
          }
        },
        { $unwind: { path: "$likes", preserveNullAndEmptyArrays: true } },
   
        {
          $lookup: {
            from: "users",
            localField: "likes.userId",
            foreignField: "_id",
            as: "likes.user"
          }
        },
        {
          $unwind: { path: "$likes.user", preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: "$_id",
            doc: { $first: "$$ROOT" },
            likes: { $push: "$likes.user._id" }
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$doc", { "likes": "$likes" }]
            }
          }
        },
      
        // Repeat for dislikes
        { $unwind: { path: "$dislikes", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "users",
            localField: "dislikes.userId",
            foreignField: "_id",
            as: "dislikes.user"
          }
        },
        {
          $unwind: { path: "$dislikes.user", preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: "$_id",
            doc: { $first: "$$ROOT" },
            dislikes: { $push: "$dislikes.user_id" }
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$doc", { "dislikes": "$dislikes" }]
            }
          }
        },
        // Repeat for comments
        {
          $lookup: {
            from: "users",
            let: { comments: "$comments" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", { $map: { input: "$$comments", as: "c", in: "$$c.userId" } }]
                  }
                }
              }
            ],
            as: "commentUsers"
          }
        },
        {
          $addFields: {
            comments: {
              $map: {
                input: "$comments",
                as: "c",
                in: {
                  $mergeObjects: [
                    "$$c",
                    {
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$commentUsers",
                              as: "u",
                              cond: { $eq: ["$$u._id", "$$c.userId"] }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      ]);
      res.status(201).json({
        success: true,
        data: reels,
      });
    } catch (err: any) {
      console.error("Error:", err);
      next({ code: 500, message: err.message || "Internal Server Error", error: err });
    }
  }

  //get all reels to show user 
  static async getAllReels(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
    
      const reels = await Reel.aggregate([
        {
          $lookup: {
            from: "stores",
            localField: "storeId",
            foreignField: "_id",
            as: "store"
          }
        },
        // Unwind likes array
          { $unwind: { path: "$likes", preserveNullAndEmptyArrays: true } },
   
        {
          $lookup: {
            from: "users",
            localField: "likes.userId",
            foreignField: "_id",
            as: "likes.user"
          }
        },
        {
          $unwind: { path: "$likes.user", preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: "$_id",
            doc: { $first: "$$ROOT" },
            likes: { $push: "$likes.user._id" }
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$doc", { "likes": "$likes" }]
            }
          }
        },
      
        // Repeat for dislikes
        { $unwind: { path: "$dislikes", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "users",
            localField: "dislikes.userId",
            foreignField: "_id",
            as: "dislikes.user"
          }
        },
        {
          $unwind: { path: "$dislikes.user", preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: "$_id",
            doc: { $first: "$$ROOT" },
            dislikes: { $push: "$dislikes.user_id" }
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$doc", { "dislikes": "$dislikes" }]
            }
          }
        },
      
        // Repeat for comments
        {
          $lookup: {
            from: "users",
            let: { comments: "$comments" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", { $map: { input: "$$comments", as: "c", in: "$$c.userId" } }]
                  }
                }
              }
            ],
            as: "commentUsers"
          }
        },
        {
          $addFields: {
            comments: {
              $map: {
                input: "$comments",
                as: "c",
                in: {
                  $mergeObjects: [
                    "$$c",
                    {
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$commentUsers",
                              as: "u",
                              cond: { $eq: ["$$u._id", "$$c.userId"] }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      ]);
      
      res.status(201).json({
        success: true,
        data: reels,
       
      });
    } catch (err: any) {
      console.error("Error:", err);
      next({ code: 500, message: err.message || "Internal Server Error", error: err });
    }
  }

  static async likeReel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        const {userId}=req.params;
        const reel = await Reel.findById(id); 

        if (!reel) {
          return next({ code: 400, message: "No reel found", error: "incorrect reel id" });
        }

        const alreadyLiked = reel.likes.some(
          (like) => like.userId.toString() === userId
        );
      
        let updatedReel;
       
        if (alreadyLiked) {
          // Remove like
          updatedReel = await Reel.findByIdAndUpdate(
            reel._id,
            {
              $pull: { likes: { userId } },
            },
            { new: true }
          );
        } else {
          // Add like
          updatedReel = await Reel.findByIdAndUpdate(
            reel._id,
            {
              $push: { likes: { userId } },
            },
            { new: true }
          );
        }
 
        res.status(200).json({
            success: true,
            data: updatedReel,
        });
    } catch (err: any) {
        console.error("Error:", err);
        next({ code: 500, message: err.message || "Internal Server Error", error: err });
    }
}
static async dislikeReel(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const {userId}=req.params;
    const reel = await Reel.findById(id); 

    if (!reel) {
      return next({ code: 400, message: "No reel found", error: "incorrect reel id" });
    }

    const alreadyDisLiked = reel.dislikes.some(
      (dislike) => dislike.userId.toString() === userId
    );
  
    let updatedReel;
   
    if (alreadyDisLiked) {
      updatedReel = await Reel.findByIdAndUpdate(
        reel._id,
        {
          $pull: { dislikes: { userId } },
        },
        { new: true }
      );
    } else {
      updatedReel = await Reel.findByIdAndUpdate(
        reel._id,
        {
          $push: { dislikes: { userId } },
        },
        { new: true }
      );
    }

    res.status(200).json({
        success: true,
        data: updatedReel,
    });
  } catch (err: any) {
      console.error("Error:", err);
      next({ code: 500, message: err.message || "Internal Server Error", error: err });
  }
}

static async addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
try{
  const { id } = req.params;
  const {userId}=req.params;
  const {comment}=req.body;
  const reel = await Reel.findById(id); 
    if (!reel) {
      return next({ code: 400, message: "No reel found", error: "incorrect reel id" });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);
   const updatedReel = await Reel.findByIdAndUpdate(
      reel._id,
      {
        $push: { comments: { userId: userObjectId ,comment} },
      },
      { new: true }
    );
    const objectId = new mongoose.Types.ObjectId(updatedReel._id);
    const updatedreel=  await Reel.aggregate([
      {$match:{_id:objectId}},
      {
        $lookup: {
          from: "stores",
          localField: "storeId",
          foreignField: "_id",
          as: "store"
        }
      },
      // Unwind likes array
        { $unwind: { path: "$likes", preserveNullAndEmptyArrays: true } },
 
      {
        $lookup: {
          from: "users",
          localField: "likes.userId",
          foreignField: "_id",
          as: "likes.user"
        }
      },
      {
        $unwind: { path: "$likes.user", preserveNullAndEmptyArrays: true }
      },
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" },
          likes: { $push: "$likes.user._id" }
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$doc", { "likes": "$likes" }]
          }
        }
      },
    
      // Repeat for dislikes
      { $unwind: { path: "$dislikes", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "dislikes.userId",
          foreignField: "_id",
          as: "dislikes.user"
        }
      },
      {
        $unwind: { path: "$dislikes.user", preserveNullAndEmptyArrays: true }
      },
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" },
          dislikes: { $push: "$dislikes.user_id" }
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$doc", { "dislikes": "$dislikes" }]
          }
        }
      },
    
      // Repeat for comments
      {
        $lookup: {
          from: "users",
          let: { comments: "$comments" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", { $map: { input: "$$comments", as: "c", in: "$$c.userId" } }]
                }
              }
            }
          ],
          as: "commentUsers"
        }
      },
      {
        $addFields: {
          comments: {
            $map: {
              input: "$comments",
              as: "c",
              in: {
                $mergeObjects: [
                  "$$c",
                  {
                    user: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$commentUsers",
                            as: "u",
                            cond: { $eq: ["$$u._id", "$$c.userId"] }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: updatedreel
    });
   
}catch (err: any) {
  console.error("Error:", err);
  next({ code: 500, message: err.message || "Internal Server Error", error: err });
}
}

static async shareReel(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
      const { id } = req.params;
      const {share} = req.query; 
    
      const reel = await Reel.findById(id); 

      if (!reel) {
        return next({ code: 400, message: "No reel found", error: "incorrect reel id" });
      }
      const updatedReel = await Reel.findByIdAndUpdate(
        id,
        { $inc: { shares: 1 } }, 
        { new: true }
      );
      
      res.status(200).json({
          success: true,
          data: updatedReel,
      });
  } catch (err: any) {
      console.error("Error:", err);
      next({ code: 500, message: err.message || "Internal Server Error", error: err });
  }
}
  
}
