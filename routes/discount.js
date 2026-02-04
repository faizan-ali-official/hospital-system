import { Router } from "express";
import {
  createAndUpdateDiscountValidation,
  IdParamValidation
} from "../middlewares/validation.js";
import authenticateToken, { isAdmin } from "../middlewares/authMiddleware.js";
import DiscountController from "../controllers/discountController.js";

const router = Router();

router.use(authenticateToken);

router.post(
  "/",
  createAndUpdateDiscountValidation,
  isAdmin,
  DiscountController.createDiscount
);
router.get("/", DiscountController.getDiscounts);
router.get("/:id", IdParamValidation, DiscountController.getDiscountById);
router.put(
  "/:id",
  IdParamValidation,
  createAndUpdateDiscountValidation,
  isAdmin,
  DiscountController.updateDiscount
);
router.delete("/:id", IdParamValidation, isAdmin, DiscountController.deleteDiscount);

export default router;
