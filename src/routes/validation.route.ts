import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import SellerSchema from '../models/registerSeller.model';
import StoreSchema from '../models/store.model';

const router = express.Router();

// Validate a store based on sellerId
router.post('/validateStore/:sellerId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.params.sellerId;
    // console.log(sellerId, 'is slajfalfjla')
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ success: false, message: 'Invalid seller ID' });
    }
   
    // Get the storeId from the seller schema
    const storeId = sellerId;
    if (!storeId) {
      return res.status(400).json({ success: false, message: 'Seller does not have a store associated' });
    }

    // Now find the store by storeId
    const store = await StoreSchema.findById(storeId);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    // Proceed with validation
    if (store.varification === 'Submitted') {
      store.varification = 'Varified';

      await store.save();
      return res.status(200).json({ success: true, message: 'Store validated successfully' });
    }     
    else {
      return res.status(400).json({ success: false, message: 'Store is already in process, verified, or failed' });
    }
  } catch (error) {
    console.error('Error validating store:', error);
    res.status(500).json({ success: false, message: 'Failed to validate store', error: error.message });
  }
});


// Delete a store
router.delete('/deleteStore/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ success: false, message: 'Invalid seller ID' });
    }

    const seller = await SellerSchema.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    await SellerSchema.findByIdAndDelete(sellerId);

    res.status(200).json({ success: true, message: 'Seller deleted successfully' });
  } catch (error) {
    console.error("Error deleting seller:", error);
    res.status(500).json({ success: false, message: 'Failed to delete seller', error: error.message });
  }
});
export { router as ValidationRoute };

