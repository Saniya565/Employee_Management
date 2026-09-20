import {Router} from "express";
import {protect,allow} from "../middleware/auth.js";
import {listHeads,createHead,listTransactions,createTransaction,updateTransaction,deleteTransaction,financeSummary} from "../controllers/finance.controller.js";
const r=Router(); r.use(protect,allow("admin","hr","employer"));
r.get("/heads",listHeads); r.post("/heads",createHead);
r.get("/transactions",listTransactions); r.post("/transactions",createTransaction);
r.put("/transactions/:id",updateTransaction); r.delete("/transactions/:id",deleteTransaction);
r.get("/summary",financeSummary); export default r;
