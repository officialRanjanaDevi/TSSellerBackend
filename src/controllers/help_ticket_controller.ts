import { Request, Response, NextFunction } from "express";
import Ticket from "../models/ticketModel";
import { string } from "joi";
import Notification from "../models/notification.model";
import mongoose from "mongoose";
export class Ticket_addData {
  static async add_data(
    request: Request,
    response: Response,
    next: NextFunction):Promise<void> {
    try {
    //   const seller_id = request.params.id;
      // console.log(request.body);
      const {title,seller_name,seller_id,store_id,problem_statement,phone_number}=request.body.formData
    //   const phone_number=request.body.phoneNumber
      const images = request.body.images
    //   console.log('images is: ',images)
    //     console.log(title,seller_name,seller_id,store_id,problem_statement,images)
        const newTicket = new Ticket({
            Issue_regarding: title,
            seller_name: seller_name,
            store_id: store_id,
            problem_statement: problem_statement,
            Images: images
          });

          const newNotification=new Notification({
            title:title,
            message:problem_statement,
            phone_number:phone_number,
            sender:store_id,
            for:'super-admin'
          })
          const added_notification=await newNotification.save();
          const added_data = await newTicket.save();
        // console.log(added_data)
      response.status(201).send({data:'success', message: "Ticket Raised successfully" });
    } catch (e) {
      console.log("an error occurred: ", e);
      response.status(500).send({ message: "Error adding data" });
    }
  }

  static async fetch_data(
    request: Request,
    response: Response,
    next: NextFunction):Promise<void>{
        const store_id=request.params.storeId;
        // console.log(store_id)
        const data=await Ticket.find({store_id:store_id}).lean()
        const jsonData = JSON.parse(JSON.stringify(data));
        // console.log(jsonData);
        response.json(jsonData);
    }

    static async delete_data(
      request: Request,
      response: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const _id = new mongoose.Types.ObjectId(request.params.id);
        const data = await Ticket.deleteOne({ _id: _id });
  
        if (data.deletedCount === 1) {
          response.status(200).json({ message: 'Ticket deleted successfully' });
        } else {
          response.status(404).json({ message: 'Ticket not found' });
        }
      } catch (error) {
        console.error('Error deleting ticket:', error);
        response.status(500).json({ message: 'Internal server error' });
      }
    }

    static async update_data(
      req:Request,
      res:Response,
      next:NextFunction
    ):Promise<void>{
      try {
        const id = req.params.id;
        const result = await Ticket.updateOne(
          { _id: id }, 
          { status: 'cancelled' }
        );
        if (result.modifiedCount === 1) {
          res.status(200).json({ message: 'Ticket status updated to cancelled successfully' });
        } else if (result.matchedCount === 0) {
          res.status(404).json({ message: 'Ticket not found' });
        } else {
          res.status(304).json({ message: 'No changes made to the ticket' });
        }
      } catch (e) {
        console.error('Error updating ticket status:', e);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
