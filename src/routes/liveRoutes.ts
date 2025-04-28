import { Router } from "express";
import { LiveChatController } from "../controllers/liveChat.controller";
import { CategoryController } from "../controllers/category.controller";

export class LiveChatRoute {
  static register(io: any) {
    const router = Router();

    router.get("/getChat/:storeId/:userId", LiveChatController.getChat);
    router.post("/createMessage", (req, res, next) =>
      LiveChatController.createMessage(req, res, next, io)
    );
    router.get("/getStoreChats/:storeId", LiveChatController.getStoreChats);

    router.get("/meeting/:meetingId", LiveChatController.getMeeting);
    router.post("/meeting", LiveChatController.createMeeting);
    router.get("/meetings", LiveChatController.getAllMeetings);

    router.get("/store/:id", LiveChatController.getStoreById);

    router.get("/order/:id", LiveChatController.getOrder);
    router.put("/updateCart/:customerId", LiveChatController.updateCart);
    router.get("/videoRequests", LiveChatController.getAllAppointments);
    router.put("/videoRequests/:requestId", LiveChatController.updateAppointment);
    router.post("/createzoom", LiveChatController.createZoomMeeting);

    //Category section  ------------------------------------------------------------------------------->
    router.post("/categories", CategoryController.createCategory);
    router.get("/categories/:categoryId", CategoryController.getCategory);

    router.get("/categories", CategoryController.getCategories);

    router.get(
      "/categories/children/:parentId",
      CategoryController.getChildCategories
    );

    return router;
  }
}
