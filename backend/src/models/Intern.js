import mongoose from "mongoose";
const schema = new mongoose.Schema({
  internId: { type: String, required: true, unique: true, trim: true, uppercase: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: String,
  college: String,
  course: String,
  department: String,
  internshipRole: String,
  startDate: Date,
  endDate: Date,
  mentor: String,
  stipend: { type: Number, default: 0 },
  status: { type: String, enum: ["Upcoming", "Active", "Completed", "Terminated"], default: "Upcoming" },
  remarks: String
}, { timestamps: true });
export default mongoose.model("Intern", schema);
