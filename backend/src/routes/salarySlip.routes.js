import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { createSlip, slipPdf } from "../controllers/salarySlip.controller.js";
const router = Router();
router.use(protect);
router.post("/", createSlip);
router.get("/:id/pdf", slipPdf);
export default router;
