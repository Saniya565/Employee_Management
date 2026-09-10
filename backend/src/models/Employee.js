import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true, trim: true, uppercase: true },
  fullName: { type: String, required: true, trim: true },
  profilePhoto: String,
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  dateOfBirth: Date,
  gender: { type: String, enum: ["Male", "Female", "Other", "Prefer not to say"], default: "Prefer not to say" },
  address: String,
  department: { type: String, required: true },
  designation: { type: String, required: true },
  employmentType: { type: String, enum: ["Full-time", "Part-time", "Contract", "Intern"], default: "Full-time" },
  dateOfJoining: { type: Date, required: true },
  reportingManager: String,
  workLocation: String,
  employmentStatus: { type: String, enum: ["Active", "Inactive", "Resigned", "Terminated", "Relieved"], default: "Active" },
  probationPeriod: { type: Number, default: 3 },
  probationEndDate: Date,
  emergencyContact: String,
  bankDetails: String,
  panDetails: String,
  notes: String
}, { timestamps: true });

employeeSchema.index({ fullName: "text", employeeId: "text", email: "text" });
export default mongoose.model("Employee", employeeSchema);
