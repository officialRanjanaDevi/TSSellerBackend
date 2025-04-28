import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import SellerSchema, { SellerRegister } from "../models/registerSeller.model";
import Seller from "../models/seller.model";

export interface AuthenticatedRequest extends Request {
  seller?: SellerRegister;
  token?: string;
}

export const isAuthenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req?.headers?.authorization?.split(" ")[1];
    try {
      if (token) {
        const decoded = Jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as Jwt.JwtPayload;
        const seller = await SellerSchema.findById(decoded?.id);
        req.seller = seller;
        req.token = token;
        next();
      }
    } catch (error) {
      res.status(401).json({ message: "Not Authorised, Please Login Again" });
    }
  } else {
    res
      .status(401)
      .json({ message: "There is no token attached to the header..." });
  }
};
