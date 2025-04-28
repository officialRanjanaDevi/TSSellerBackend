import { Request,Response,NextFunction } from "express";
import PaymentModel from "../models/payment.model";
export class paymentController{
    static async getPayment(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void>{
        const id=req.params.id;

    }
}