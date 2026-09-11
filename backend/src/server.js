import dns from "node:dns"

dns.setServers(["8.8.8.8", "8.8.4.4"]);


import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import path from "path";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import internRoutes from "./routes/intern.routes.js";
import salaryRoutes from "./routes/salary.routes.js";
import documentRoutes from "./routes/document.routes.js";
import offerRoutes from "./routes/offer.routes.js";
import salarySlipRoutes from "./routes/salarySlip.routes.js";
import masterRoutes from "./routes/master.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();
//app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://employee-management-1-3rm0.onrender.com",
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/api/health", (_, res) => res.json({ ok: true, service: "scorecare-hr-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/interns", internRoutes);
app.use("/api", salaryRoutes);
app.use("/api", documentRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/salary-slips", salarySlipRoutes);
app.use("/api", masterRoutes);





const port = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    const count = await User.countDocuments();

    if (!count) {
      const email = process.env.DEMO_ADMIN_EMAIL;
      const plainPassword = process.env.DEMO_ADMIN_PASSWORD;

      if (!email || !plainPassword) {
        console.error("Demo admin credentials are missing in .env");
        process.exit(1);
      }

      const password = await bcrypt.hash(plainPassword, 12);

      await User.create({
        name: "Scorecare Admin",
        email,
        password,
        role: "admin",
      });

      console.log(`Demo admin created: ${email}`);
    }

    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Startup failed:", err);
    process.exit(1);
  });
