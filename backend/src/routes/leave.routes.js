import {Router} from "express";
import {protect,allow} from "../middleware/auth.js";
import {listLeaves,createLeave,reviewLeave} from "../controllers/leave.controller.js";
const r=Router(); r.use(protect);
r.get("/",listLeaves); r.post("/",allow("employee"),createLeave);
r.put("/:id/review",allow("admin","hr","employer"),reviewLeave); export default r;
