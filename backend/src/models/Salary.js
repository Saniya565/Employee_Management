import mongoose from "mongoose";
const schema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  basicSalary: { type: Number, default: 0 },
  hra: { type: Number, default: 0 },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  grossSalary: { type: Number, default: 0 },
  netSalary: { type: Number, default: 0 },
  ctc: { type: Number, default: 0 },
  effectiveFrom: { type: Date, required: true },
  salaryRevisionDate: Date,
  reason: String
}, { timestamps: true });
export default mongoose.model("Salary", schema);
