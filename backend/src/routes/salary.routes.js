import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { getSalary, createSalary, updateSalary } from "../controllers/salary.controller.js";
const router = Router();
router.use(protect);
router.get("/employees/:id/salary", getSalary);
router.post("/employees/:id/salary", createSalary);
router.put("/salary/:id", updateSalary);
export default router;
