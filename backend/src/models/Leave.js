import mongoose from "mongoose";
const schema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String, required: true, trim: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewRemarks: String,
  reviewedAt: Date
}, { timestamps: true });
export default mongoose.model("Leave", schema);
