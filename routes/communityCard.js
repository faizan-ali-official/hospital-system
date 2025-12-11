import { Router } from "express";
import CommunityCardController from "../controllers/communityCardController.js";
import {
  communityCardValidation,
} from "../middlewares/validation.js";
import authenticateToken, { isAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticateToken);

router.post(
  "/",
  communityCardValidation.create,
  isAdmin,
  CommunityCardController.createMember
);

router.get("/", CommunityCardController.getMembers);

router.get(
  "/search/by-cnic",
  CommunityCardController.searchByCnic
);

router.get(
  "/:id",
  communityCardValidation.idParam,
  CommunityCardController.getMemberById
);

router.put(
  "/:id",
  communityCardValidation.idParam,
  communityCardValidation.update,
  isAdmin,
  CommunityCardController.updateMember
);

router.delete(
  "/:id",
  communityCardValidation.idParam,
  isAdmin,
  CommunityCardController.deleteMember
);

export default router;

