import mongoose from "mongoose";
const schema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  month: { type: Number, min: 1, max: 12, required: true },
  year: { type: Number, required: true },
  basicSalary: Number,
  allowances: Number,
  deductions: Number,
  bonus: Number,
  grossSalary: Number,
  netSalary: Number
}, { timestamps: true });
schema.index({ employee: 1, month: 1, year: 1 }, { unique: true });
export default mongoose.model("SalarySlip", schema);
