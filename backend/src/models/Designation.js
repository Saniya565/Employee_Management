import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  department: String
}, { timestamps: true });
export default mongoose.model("Designation", schema);
