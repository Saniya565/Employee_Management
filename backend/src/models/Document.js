import mongoose from "mongoose";
const schema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  documentName: { type: String, required: true },
  documentType: { type: String, required: true },
  fileName: String,
  filePath: String,
  mimeType: String,
  status: { type: String, enum: ["Pending", "Verified", "Rejected"], default: "Pending" },
  uploadDate: { type: Date, default: Date.now }
}, { timestamps: true });
export default mongoose.model("Document", schema);
