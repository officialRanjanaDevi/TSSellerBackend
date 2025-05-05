import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { SellerRoute } from "./routes/seller.route";
import { SuperAdminRoute } from "./routes/superAdmin.route";
import { SellerAuthRoute } from "./routes/sellerAuthRoute";
import { OtpRoute } from "./routes/otpRoutes";
import { StoreRoute } from "./routes/store.route";
import connectDatabase from "./config/db";
import { v2 as cloudinary } from "cloudinary";
import http from "http";
import { LiveChatRoute } from "./routes/liveRoutes";
import LiveChat from "./models/liveChat.model";
import Product from "./models/product.model";
import client from "prom-client"; // metric collection
import responseTime from "response-time";
import logger from "./logger";
import Category from "./models/category.model";
import categoryRoutes from "./routes/category.route";
import { Server } from "socket.io";
import notificationRoutes from "./routes/notification.route";
import Notification, {
  NotificationDocument,
} from "./models/notification.model";
import mongoose from "mongoose";
import { title } from "process";
// import router from './routes/seller.route';
// /import { ValidationRoute } from './routes/validationRoute';
dotenv.config({ path: ".env" });
import socketIo from "socket.io";
import User from "./models/user.model";
import SellerSchema from "./models/registerSeller.model";
import { ValidationRoute } from "./routes/validation.route";
import Ticket from "./models/ticketModel";
import SubCategory from "./models/category-sub.model";
import { addProductRoute } from "./routes/addProductRoute";
import { orderRoute } from "./routes/orderRoute";
import reelRoutes from "./routes/reelRoutes";
import CouponRoute from "./routes/couponRoutes";
import bannerRoutes from "./routes/bannerRoutes";
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;


app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Create custom metric
const reqResTime = new client.Histogram({
  name: "http_request_response_time",
  help: "This tells how much time is taken by request and response",
  labelNames: ["method", "route", "status_code"],
  buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000], // Customize your buckets here
});

const totalReqCounter = new client.Counter({
  name: "total_req",
  help: "Tells total req",
});

// Configure CORS for Socket.IO
export const io = new Server(server, {
  cors: {
    origin: [
      "https://seller.trialshopy.com",
      "https://www.seller.trialshopy.com",
      "https://admin.trialshopy.com",
      "https://www.admin.trialshopy.com",
      "https://trialshopy.com",
      "http://13.202.102.83:5173",
      "http://13.202.102.83:5174",
      "http://localhost:5174",
      "http://localhost:5173",
      process.env.Frontend_Endpoint,
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});
app.use("/orders", orderRoute.order());
// Connect to database
connectDatabase();

// Middleware to track response time
app.use(
  responseTime((req: Request, res: Response, time: number) => {
    totalReqCounter.inc();
    reqResTime
      .labels(req.method, req.url, res.statusCode.toString())
      .observe(time);
  })
);

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://seller.trialshopy.com",
      "https://www.seller.trialshopy.com",
      "https://admin.trialshopy.com",
      "https://www.admin.trialshopy.com",
      "https://trialshopy.com",
      "http://13.202.102.83:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "http://localhost:5173",
      process.env.Frontend_Endpoint,
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



app.post("/api/upload", async (req, res) => {
  try {
    let images = [];
    // console.log('image section is ',req.body.images)
    // Normalize the input to always be an array
    if (typeof req.body.images === "string") {
      images = [req.body.images];
    } else if (Array.isArray(req.body.images)) {
      images = req.body.images;
    } else {
      return res
        .status(400)
        .json({ message: "Invalid input format for images" });
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      if (typeof images[i] !== "string") {
        return res.status(400).json({ message: "Invalid image path or URL" });
      }

      const result = await cloudinary.uploader.upload(images[i], {
        folder: "productImages",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    // console.log(imagesLinks);
    res.status(200).json({
      message: "File uploaded successfully",
      urls: imagesLinks,
    });
  } catch (err) {
    console.log(err.message, "errrrrrrrrrrrrrrrrrrrrrrrrrr");
    res.status(500).json({ message: "Internal server error", err });
  }
});

app.put("/api/upload/update/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;

    let product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    // Images Start Here
    let imagesfile = [];

    if (typeof req.body.imagesfile === "string") {
      imagesfile.push(req.body.imagesfile);
    } else {
      imagesfile = req.body.imagesfile;
    }

    if (imagesfile !== undefined) {
      // Deleting imagesfile From Cloudinary
      for (let i = 0; i < product?.images?.length; i++) {
        await cloudinary.uploader.destroy(product.images[i].public_id);
      }

      const imagesLinks = [];

      for (let i = 0; i < imagesfile.length; i++) {
        const result = await cloudinary.uploader.upload(imagesfile[i], {
          folder: "products",
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      res.status(200).json({
        message: "File updated successfully",
        urls: imagesLinks,
      });
    }
  } catch (err) {
    // Handle the case where the error message might not be JSON
    let errorDetails = {
      code: 500,
      message: "Internal Server Error",
      error: err.message,
    };
    try {
      errorDetails = JSON.parse(err.message);
    } catch (parseError) {
      // If parsing fails, keep the default error details
    }
    next({
      code: errorDetails.code,
      message: errorDetails.message,
      error: errorDetails.error,
    });
  }
});

app.post("/api/upload/category", async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "categoryImages",
    });

    res.status(200).json({
      message: "File uploaded successfully",
      urls: result,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error", err });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});








// Define a route to expose metrics
app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", client.register.contentType);
  const metrics = await client.register.metrics();
  res.send(metrics);
});

app.use("", SellerRoute.register());
app.use("/super-admin", SuperAdminRoute.register());
app.use("", StoreRoute.register());
app.use("/api/v1", SellerAuthRoute.register());
app.use("/api/v1", OtpRoute.register());
app.use("/uploads", express.static("uploads"));
app.use("/api/v1", LiveChatRoute.register(io));
app.use("/api/v1/categories", categoryRoutes);

app.use("/api/add_products", addProductRoute.addProduct());
app.use("/api/seller-auth", SellerAuthRoute.register());
app.use("/api/v1", notificationRoutes);
app.use("/orders", orderRoute.order());
// app.use('/api/sellers', ValidationRoute);
app.use("/api/v1", ValidationRoute);
app.use("/api/v1/coupon",CouponRoute.register())
// app.use("/api/payment",)






app.use("/reels", reelRoutes.reel());


app.use("/banner", bannerRoutes.banner());








// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(err.code || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: err.error || {},
  });
});
io.on("connection", (socket) => {
  socket.on("join_room", async (roomId: string) => {
    socket.join(roomId);

    // Fetch notifications for the room
    const notifications = await Notification.find({ userId: roomId }).lean(); // Ensure to use 'await' for asynchronous calls

    const response = notifications.map((notification) => ({
      title: notification.title,
      message: notification.message,
      url: notification.url, // No need for template literals here
      createdAt: notification.createdAt,
    }));

    io.to(roomId).emit("receive_notification", response);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    // console.log('Client disconnected:', socket.id);
  });
});

app.post("/api/send-notification", async (req, res) => {
  const { userId, title, message, url } = req.body;

  // Check if storeId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  if (!userId || !title || !message) {
    return res
      .status(400)
      .json({ message: "User ID, title, and message are required" });
  }

  try {
    const newNotification = new Notification({
      userId,
      title,
      message,
      url,
    });

    // Save the notification to the database
    await newNotification.save();

    // Emit notification to the seller's socket room
    io.to(userId.toString()).emit("receive_notification", newNotification);

    res.status(200).json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/send-notification/broadcast", async (req, res) => {
  console.log(req.body);
  const { title, message, url } = req.body;

  if (!title || !message) {
    return res.status(400).json({ message: "Title and message are required" });
  }

  try {
    const sellers = await SellerSchema.find({}, "_id");

    if (!sellers || sellers.length === 0) {
      return res.status(404).json({ message: "No sellers found" });
    }
    const notifications = {
      userId: "Broadcast",
      broadcast: true,
      title,
      message,
      url,
    };
    const notification = new Notification(notifications);
    console.log(notification);
    await notification.save();
    sellers.forEach((seller) => {
      io.to(seller._id.toString()).emit("receive_notification", {
        userId: seller._id,
        title,
        message,
      });
    });

    res
      .status(200)
      .json({ message: "Broadcast notification sent successfully" });
  } catch (error) {
    console.error("Error broadcasting notification:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/s-notifications/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Ensure the userId is valid and log it
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ error: "Invalid User ID" });
    }
    // console.log('Fetching notifications for User ID:', userId);

    // Fetch notifications for the user and sort them by timestamp in descending order
    const notifications = await Notification.find({ userId }).sort({
      timestamp: -1,
    });

    // Send the notifications as an object, as expected by the frontend
    res.status(200).send({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send({ error: "Failed to fetch notifications" });
  }
});

app.get("/api/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 });
    res.status(200).send({ notifications });
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch notifications" });
  }
});
// DELETE route to delete a notification by ID
app.delete("/api/notifications/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedNotification = await Notification.findByIdAndDelete(userId);

    if (deletedNotification) {
      res
        .status(200)
        .send({ success: true, message: "Notification deleted successfully." });
    } else {
      res
        .status(404)
        .send({ success: false, message: "Notification not found." });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to delete notification.",
      error,
    });
  }
});

//super admin api

app.get("/api/tickets/unresolved", async (req, res) => {
  try {
    const tickets = await Ticket.find({
      resolved: false,
      $or: [
        // { ResponseFromAdmin: { $exists: false } },
        { ResponseFromAdmin: "" },
        // { ResponseFromAdmin: null }
      ],
    });
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching unresolved tickets:", error);
    res.status(500).send("Server Error");
  }
});

app.get("/api/tickets/answered", async (req, res) => {
  try {
    const answeredTickets = await Ticket.find({
      ResponseFromAdmin: { $exists: true, $ne: "" },
    });
    res.json(answeredTickets);
  } catch (error) {
    console.error("Error fetching answered tickets:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching answered tickets." });
  }
});

app.put("/api/tickets/:id", async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;

  try {
    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { ResponseFromAdmin: response },
      { new: true }
    );

    if (!ticket) return res.status(404).send("Ticket not found");

    res.json(ticket);
  } catch (error) {
    console.error("Error responding to ticket:", error);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/tickets/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) return res.status(404).send("Ticket not found");

    res.json({ message: "Ticket deleted" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/subcategories/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(id, 'Deleting subcategory with ID');
  try {
    const result = await SubCategory.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/subcategories/:id", async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.json(subCategory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
