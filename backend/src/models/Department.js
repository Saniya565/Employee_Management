import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: String
}, { timestamps: true });
export default mongoose.model("Department", schema);
