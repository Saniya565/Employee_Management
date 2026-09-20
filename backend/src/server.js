import "dotenv/config";
import dns from "node:dns/promises";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import path from "path";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import FinanceHead from "./models/FinanceHead.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import internRoutes from "./routes/intern.routes.js";
import salaryRoutes from "./routes/salary.routes.js";
import documentRoutes from "./routes/document.routes.js";
import offerRoutes from "./routes/offer.routes.js";
import salarySlipRoutes from "./routes/salarySlip.routes.js";
import masterRoutes from "./routes/master.routes.js";
import financeRoutes from "./routes/finance.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import leaveRoutes from "./routes/leave.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();
//app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/api/health", (req, res) => res.json({ ok: true, service: "scorecare-hr-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/interns", internRoutes);
app.use("/api", salaryRoutes);
app.use("/api", documentRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/salary-slips", salarySlipRoutes);
app.use("/api", masterRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
connectDB().then(async () => {
  const incomeHeads=["App Subscription Revenue","Credit Repair Service Fees","Credit Report Analysis Fees","CIBIL Dispute/Rectification Fees","Referral/Affiliate Income","Loan/Bharat Connect Commission","Other Income"];
  const expenditureHeads=["Salaries & Wages","HRMS – Assessment Day","Marketing & Ad Spend (Meta/Google)","Content Production (reels, videos)","Software/Hosting & API Costs","Office & Admin Expenses","Recruitment/Hiring Costs","Professional/Legal Fees","Miscellaneous Expenses"];
  for(const name of incomeHeads) await FinanceHead.updateOne({name,type:"Income"},{name,type:"Income",isDefault:true},{upsert:true});
  for(const name of expenditureHeads) await FinanceHead.updateOne({name,type:"Expenditure"},{name,type:"Expenditure",isDefault:true},{upsert:true});
  const count = await User.countDocuments();
  if (!count) {
    const password = await bcrypt.hash(
  process.env.ADMIN_PASSWORD,
  12
);

await User.create({
  name: process.env.ADMIN_NAME,
  email: process.env.ADMIN_EMAIL,
  password,
  role: "admin",
});
  }
  app.listen(port, () => console.log(`API running on http://localhost:${port}`));
}).catch(err => {
  console.error("Startup failed:", err);
  process.exit(1);
});
