import { Request, Response, NextFunction } from "express";
import LiveChat from "../models/liveChat.model";
import Meeting from "../models/meeting.model";
import Store from "../models/store.model";
import Order from "../models/order.model";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import Appointment from "../models/meetRequest.model";
import { param } from "express-validator";

export class LiveChatController {
  static async getChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { storeId, userId } = req.params;
    try {
      const chat = await LiveChat.findOne({ storeId, userId });
      if (chat) {
        res.json(chat);
      } else {
        res.json({ messages: [] });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async createMessage(
    req: Request,
    res: Response,
    next: NextFunction,
    io: any
  ): Promise<void> {
    const { storeId, userId, sender, content } = req.body;
    try {
      let chat = await LiveChat.findOne({ storeId, userId });
      if (!chat) {
        chat = new LiveChat({ storeId, userId, messages: [] });
      }

      if (sender && content) {
        const message = { sender, content, timestamp: new Date() };
        chat.messages.push(message);
        if (io) {
          io.to(chat._id.toString()).emit("receiveMessage", message);
        }
      }

      await chat.save();
      res.status(201).json(chat);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getMeeting(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { meetingId } = req.params;
    try {
      const meeting = await Meeting.findById(meetingId);
      if (meeting) {
        res.json(meeting);
      } else {
        res.status(404).json({ error: "Meeting not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Create a new meeting
  static async createMeeting(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const {
      title,
      status,
      date,
      time,
      zoom_meeting_id,
      zoom_meeting_password,
      sellerId,
      storeId,
      users,
    } = req.body;
    try {
      const newMeeting = new Meeting({
        title,
        status,
        date,
        time,
        zoom_meeting_id,
        zoom_meeting_password,
        sellerId,
        storeId,
        users,
      });

      const savedMeeting = await newMeeting.save();
      res.status(201).json(savedMeeting);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }


  static async updateAppointment( req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
    
      const { requestId } = req.params;
      const {data}=req.body
    
      const meeting = await Appointment.findByIdAndUpdate(
        requestId, 
        { status: data.status }, 
        { new: true } 
    );

    if (!meeting) {
      res.status(404).json({ message: "Meeting not found" });
    }

 
    res.status(200).json(meeting);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  static async getAllMeetings(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
   
      const meetings = await Meeting.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "users",
            foreignField: "_id",
            as: "users",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products",
            foreignField: "_id",
            as: "products",
          },
        }])
       console.log(meetings)
      res.json(meetings);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getStoreById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    try {
      const store = await Store.findById(id);
      if (store) {
        res.json(store);
      } else {
        res.status(404).json({ error: "Meeting not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getStoreChats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { storeId } = req.params;
    try {
      const chats = await LiveChat.find({ storeId }).select("userId");
      res.json(chats);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    try {
      const order = await Order.findOne({ _id: id });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { customerId } = req.params;
    const { items } = req.body;

    try {
      let cart = await Cart.findOne({ customerId });
      if (!cart) {
        throw new Error("No Cart Found For User");
      }

      for (const item of items) {
        const { productId, count } = item;

        const product = await Product.findById(productId._id);
        if (!product) {
          throw new Error(`Product with ID ${productId._id} not found`);
        }

        // Check if the item already exists in the cart's items array
        const existingItemIndex = cart.items.findIndex(
          (cartItem) => cartItem.productId.toString() === productId._id
        );

        if (existingItemIndex !== -1) {
          // If item exists, update the count
          cart.items[existingItemIndex].count = count;
        } else {
          throw Error("Something Went Wrong");
        }
      }

      const updatedCart = await cart.save();

      res.status(200).json(updatedCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getAllAppointments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const meetings = await Appointment.find().populate("products");
      res.json(meetings);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
      console.log("error", error);
    }
  }

  static async createZoomMeeting(req: Request, res: Response): Promise<void> {
    const { title, date, time, sellerId, storeId, users, products } = req.body;
    try {
      // Function to create a Zoom meeting
      async function createZoomMeeting() {
        const meetingStartTime = new Date(
          Date.now() + 10 * 60000
        ).toISOString(); // 10 minutes from now
        const meetingDuration = 60; // Meeting duration in minutes

        const togeneratejwt = await fetch(
          "https://zoom.us/oauth/token?grant_type=account_credentials&account_id=iN4p2eueRrSMgooHt4JDHw",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${Buffer.from(
                `Yv5uLHuQSWqNEq76HgN2eA:sPnN5uuSxfwKhRk8PtRmp1dlKDAIrWCS`
              ).toString("base64")}`,
            },
          }
        );
        const jwtData = await togeneratejwt.json();

        const jwtToken = jwtData.access_token;
        // console.log("jwtToken", jwtToken);

        const response = await fetch(
          "https://api.zoom.us/v2/users/me/meetings",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({
              topic: title,
              type: 2, // Scheduled Meeting
              start_time: meetingStartTime,
              duration: meetingDuration,
              timezone: "UTC",
              settings: {
                host_video: true,
                participant_video: true,
              },
            }),
          }
        );

        const responseData = await response.json();

        if (response.ok) {
          // console.log("Zoom meeting created successfully:", responseData);
          return responseData;
        } else {
          // console.error("Failed to create Zoom meeting:", responseData);
          throw new Error(responseData.message);
        }
      }

      const zoomMeeting = await createZoomMeeting();
      // Handle success (e.g., save meeting details, notify users, etc.)
      console.log("Meeting ID:", zoomMeeting.id);
      console.log("Meeting Password:", zoomMeeting.password);

      const newMeeting = new Meeting({
        title,
        date,
        time,
        zoom_meeting_id: zoomMeeting.id,
        zoom_meeting_password: zoomMeeting.password,
        sellerId,
        storeId,
        users,
        products,
      });

      const savedMeeting = await newMeeting.save();
      res.status(200).json(zoomMeeting);
    } catch (error) {
      res.status(500).json({ error: "Error scheduling appointment" });
    }
  }


}
