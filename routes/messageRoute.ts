import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import { sendMessage,getMessage,getUsersForSidebar } from "../controllers/messageController";
const router = express.Router();


//this order is important or else conversation will work as an id
router.get("/conversations",protectRoute,getUsersForSidebar)
router.get("/:id",protectRoute,getMessage);
router.post("/send/:id",protectRoute,sendMessage);

export default router;