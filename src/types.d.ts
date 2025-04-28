// src/types.d.ts
import { Request } from "express";
import { SellerRegister } from "./models/registerSeller.model";

declare module "express-serve-static-core" {
  interface Request {
    seller?: SellerRegister | null;
  }
}
