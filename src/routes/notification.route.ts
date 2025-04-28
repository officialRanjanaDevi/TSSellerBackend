import express, { Request, Response } from 'express';
import SellerSchema from '../models/registerSeller.model';
import Notification from '../models/notification.model'; // Replace with your actual notification model
import {io} from '../index'

const router = express.Router();

// Route to send notifications
router.post('/send-notification', async (req: Request, res: Response) => {
  try {
    const { storeId, title, message } = req.body;

    if (!storeId || !title || !message) {
      return res.status(400).json({ message: 'Store ID, title, and message are required' });
    }

    // Find the seller by storeId
    const seller = await SellerSchema.findOne({ storeId }).exec();

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Create a new notification
    const newNotification = new Notification({
      storeId,
      title,
      message,
      // Add any other necessary fields
    });

    await newNotification.save();

    // Emit notification to the seller's socket room
    // Assuming you have a reference to the socket instance
    io.to(storeId.toString()).emit('receive_notification', newNotification);

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
