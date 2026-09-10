import mongoose from "mongoose";
const schema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  candidateName: { type: String, required: true },
  designation: String,
  department: String,
  joiningDate: Date,
  employmentType: String,
  salaryCTC: Number,
  probationPeriod: Number,
  workLocation: String,
  reportingManager: String,
  offerDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["Draft", "Generated", "Sent", "Accepted", "Rejected"], default: "Draft" }
}, { timestamps: true });
export default mongoose.model("Offer", schema);
