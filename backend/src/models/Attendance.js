import mongoose from "mongoose";
const schema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["Present", "Absent", "Half Day", "Leave", "Holiday"], default: "Present" },
  remarks: String,
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });
schema.index({ employee: 1, date: 1 }, { unique: true });
export default mongoose.model("Attendance", schema);
