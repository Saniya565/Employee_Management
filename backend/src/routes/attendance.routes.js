import {Router} from "express";
import {protect,allow} from "../middleware/auth.js";
import {listAttendance,markAttendance} from "../controllers/attendance.controller.js";
const r=Router(); r.use(protect);
r.get("/",listAttendance); r.post("/",allow("admin","hr","employer"),markAttendance); export default r;
