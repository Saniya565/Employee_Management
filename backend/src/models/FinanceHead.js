import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["Income", "Expenditure"], required: true },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });
schema.index({ name: 1, type: 1 }, { unique: true });
export default mongoose.model("FinanceHead", schema);
