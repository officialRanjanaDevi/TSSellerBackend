import { Router } from 'express';
import { CategoryController } from "../controllers/category.controller";

const router = Router();

router.get('/:id', CategoryController.getCategoryById);
router.put('/:id', CategoryController.updateCategory);
// router.get('/:id/:name',CategoryController.getSubcategoryId)

export default router;
