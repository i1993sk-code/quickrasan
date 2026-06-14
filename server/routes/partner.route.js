import { Router } from "express";
import { createPartnerController, getPartnersController } from "../controllers/partner.controller.js";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/Admin.js";

const partnerRouter = Router();

partnerRouter.post("/create", createPartnerController);
partnerRouter.get("/get", auth, admin, getPartnersController);

export default partnerRouter;
