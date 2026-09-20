import mongoose from "mongoose";
const schema = new mongoose.Schema({
  date: { type: Date, required: true, default: Date.now },
  type: { type: String, enum: ["Income", "Expenditure"], required: true },
  head: { type: mongoose.Schema.Types.ObjectId, ref: "FinanceHead", required: true },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true },
  remarks: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });
schema.index({ type: 1, date: -1 });
export default mongoose.model("Transaction", schema);
