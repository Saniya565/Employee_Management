import "dotenv/config";
import bcrypt from "bcryptjs";

import { connectDB } from "./config/db.js";

import Department from "./models/Department.js";
import Designation from "./models/Designation.js";
import FinanceHead from "./models/FinanceHead.js";
import Employee from "./models/Employee.js";
import User from "./models/User.js";

async function run() {
  await connectDB();

  // -----------------------------
  // DEPARTMENTS
  // -----------------------------

  for (const name of [
    "Technology",
    "HR",
    "Finance",
    "Marketing",
    "Sales",
  ]) {
    await Department.updateOne(
      { name },
      { name },
      { upsert: true }
    );
  }

  // -----------------------------
  // DESIGNATIONS
  // -----------------------------

  for (const name of [
    "Intern",
    "Junior Developer",
    "Software Developer",
    "Senior Developer",
    "Team Lead",
    "HR Executive",
  ]) {
    await Designation.updateOne(
      { name },
      { name },
      { upsert: true }
    );
  }

  // -----------------------------
  // FINANCE HEADS
  // -----------------------------

  const income = [
    "App Subscription Revenue",
    "Credit Repair Service Fees",
    "Credit Report Analysis Fees",
    "CIBIL Dispute/Rectification Fees",
    "Referral/Affiliate Income",
    "Loan/Bharat Connect Commission",
    "Other Income",
  ];

  const expenditure = [
    "Salaries & Wages",
    "HRMS – Assessment Day",
    "Marketing & Ad Spend (Meta/Google)",
    "Content Production (reels, videos)",
    "Software/Hosting & API Costs",
    "Office & Admin Expenses",
    "Recruitment/Hiring Costs",
    "Professional/Legal Fees",
    "Miscellaneous Expenses",
  ];

  for (const name of income) {
    await FinanceHead.updateOne(
      {
        name,
        type: "Income",
      },
      {
        name,
        type: "Income",
        isDefault: true,
      },
      {
        upsert: true,
      }
    );
  }

  for (const name of expenditure) {
    await FinanceHead.updateOne(
      {
        name,
        type: "Expenditure",
      },
      {
        name,
        type: "Expenditure",
        isDefault: true,
      },
      {
        upsert: true,
      }
    );
  }

  // -----------------------------
  // EMPLOYEE
  // -----------------------------

  const emp = await Employee.findOneAndUpdate(
    {
      email: process.env.EMPLOYEE_EMAIL,
    },
    {
      employeeId: "EMP-001",
      fullName: process.env.EMPLOYEE_NAME,
      email: process.env.EMPLOYEE_EMAIL,
      phone: "0000000000",
      department: "Technology",
      designation: "Software Developer",
      employmentType: "Full-time",
      dateOfJoining: new Date(),
      employmentStatus: "Active",
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  const employeePassword = await bcrypt.hash(
    process.env.EMPLOYEE_PASSWORD,
    12
  );

  await User.updateOne(
    {
      email: process.env.EMPLOYEE_EMAIL,
    },
    {
      $set: {
        name: process.env.EMPLOYEE_NAME,
        password: employeePassword,
        role: "employee",
        employee: emp._id,
      },
    },
    {
      upsert: true,
    }
  );

  // -----------------------------
  // EMPLOYER
  // -----------------------------

  const employerPassword = await bcrypt.hash(
    process.env.EMPLOYER_PASSWORD,
    12
  );

  await User.updateOne(
    {
      email: process.env.EMPLOYER_EMAIL,
    },
    {
      $set: {
        name: process.env.EMPLOYER_NAME,
        password: employerPassword,
        role: "employer",
      },
    },
    {
      upsert: true,
    }
  );

  // -----------------------------
  // ADMIN
  // -----------------------------

  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD,
    12
  );

  await User.updateOne(
    {
      email: process.env.ADMIN_EMAIL,
    },
    {
      $set: {
        name: process.env.ADMIN_NAME,
        password: adminPassword,
        role: "admin",
      },
    },
    {
      upsert: true,
    }
  );

  console.log("Master data, finance heads and demo role accounts seeded.");

  console.log(`Admin: ${process.env.ADMIN_EMAIL}`);
  console.log(`Employer: ${process.env.EMPLOYER_EMAIL}`);
  console.log(`Employee: ${process.env.EMPLOYEE_EMAIL}`);

  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});