import { Router } from "express";
import { createPartnerController, getPartnersController, updatePartnerStatusController } from "../controllers/partner.controller.js";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/Admin.js";

const partnerRouter = Router();

partnerRouter.post("/create", createPartnerController);
partnerRouter.get("/get", auth, admin, getPartnersController);
partnerRouter.put("/update-status", auth, admin, updatePartnerStatusController);

export default partnerRouter;
